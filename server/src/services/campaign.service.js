import { HTTP_STATUS } from "../constants/http.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

import {
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from "../repository/campaign.repository.js";

export const createCampaignService = async (data) => {
  const { title, description, category, location, date, createdBy, files } =
    data;

  let attachments = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "campaign_attachments"
      );

      return {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        type: uploaded.resource_type,
      };
    });

    attachments = await Promise.all(uploadPromises);
  }

  const campaignData = {
    title,
    description,
    category,
    location,
    date,
    createdBy,
    attachments,
  };

  const campaign = await createCampaign(campaignData);

  return {
    id: campaign._id,
    title: campaign.title,
    status: campaign.status,
    attachments: campaign.attachments,
    createdAt: campaign.createdAt,
  };
};

export const getCampaignsService = async (filters = {}) => {
  const campaigns = await getCampaigns(filters);

  return campaigns.map(
    ({
      _id,
      title,
      location,
      date,
      category,
      status,
      createdBy,
      createdAt,
      attachments,
    }) => ({
      id: _id,
      title,
      location,
      date,
      category,
      status,
      createdBy,
      createdAt,
      attachments,
    })
  );
};

export const getCampaignByIdService = async (id) => {
  const campaign = await getCampaignById(id);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const {
    _id,
    title,
    description,
    category,
    location,
    date,
    status,
    attachments,
    volunteers,
    ratings,
    createdBy,
    createdAt,
    updatedAt,
  } = campaign;

  return {
    id: _id,
    title,
    description,
    category,
    location,
    date,
    status,
    attachments: attachments.map((att) => ({
      url: att.url,
      public_id: att.public_id,
      type: att.type,
      id: att._id,
    })),
    volunteers,
    ratings: ratings.map((rating) => ({
      volunteer: rating.volunteer,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
    })),
    createdBy,
    createdAt,
    updatedAt,
  };
};

export const updateCampaignService = async (id, data) => {
  const { title, description, category, location, date, status, files } = data;

  let newAttachments = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "campaign_attachments"
      );

      return {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        type: uploaded.resource_type,
      };
    });

    newAttachments = await Promise.all(uploadPromises);
  }

  const updated = await updateCampaign(id, {
    title,
    description,
    category,
    location,
    date,
    status,
    ...(newAttachments.length > 0 && {
      $push: { attachments: { $each: newAttachments } },
    }),
  });

  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, updatedAt } = updated;

  return {
    id: _id,
    updatedAt,
    attachments: updated.attachments,
  };
};

export const deleteCampaignService = async (id) => {
  const deleted = await deleteCampaign(id);
  assertOrThrow(deleted, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id,
    message: "Campaign deleted successfully",
  };
};

export const applyForCampaignService = async (campaignId, userId) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() !== userId.toString(),
    HTTP_STATUS.BAD_REQUEST,
    "Organizers cannot apply as volunteers"
  );

  const alreadyApplied = campaign.volunteers?.some(
    (vol) => vol.volunteer.toString() === userId.toString()
  );

  assertOrThrow(
    !alreadyApplied,
    HTTP_STATUS.BAD_REQUEST,
    "You have already applied as a volunteer"
  );

  const updated = await addCampaignVolunteer(campaignId, {
    volunteer: userId,
    status: "pending",
    appliedAt: new Date(),
  });

  return {
    message: "Volunteer request submitted successfully",
    volunteers: updated.volunteers,
  };
};
export const getCampaignVolunteerRequestsService = async (
  campaignId,
  organizerId
) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "You are not authorized to view volunteer requests for this campaign"
  );

  return {
    id: campaign._id,
    title: campaign.title,
    volunteerRequests: campaign.volunteers.map((v) => ({
      id: v._id,
      volunteer: v.volunteer,
      status: v.status,
      appliedAt: v.appliedAt,
    })),
  };
};

export const updateCampaignStatusService = async (id, status) => {
  const updated = await updateCampaignStatus(id, status);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, status: newStatus } = updated;

  return {
    id: _id,
    status: newStatus,
  };
};

export const addCampaignVolunteerService = async (
  campaignId,
  volunteerRegId
) => {
  const updated = await addCampaignVolunteer(campaignId, volunteerRegId);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, volunteers } = updated;

  return {
    id: _id,
    volunteers,
  };
};

export const addCampaignRatingService = async (campaignId, data) => {
  const { volunteer, rating, comment } = data;

  const ratingData = {
    volunteer,
    rating,
    comment: comment || null,
    createdAt: new Date(),
  };

  const updated = await addCampaignRating(campaignId, ratingData);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, ratings } = updated;

  return {
    id: _id,
    ratings,
  };
};
