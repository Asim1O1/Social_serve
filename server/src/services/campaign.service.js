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

  const campaign = await createCampaign({
    title,
    description,
    category,
    location,
    date,
    createdBy,
    attachments,
  });

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
    ({ _id, title, location, date, category, status, createdAt, attachments }) => ({
      id: _id,
      title,
      location,
      date,
      category,
      status,
      createdAt,
      attachments
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
    attachments,
    volunteers,
    ratings,
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
