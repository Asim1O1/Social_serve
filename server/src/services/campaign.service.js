import {
  addCampaignAttachment,
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from "../repositories/campaign.repository.js";

import { HTTP_STATUS } from "../constants/http.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createCampaignService = async (data) => {
  const campaign = await createCampaign(data);

  return {
    id: campaign._id,
    title: campaign.title,
    status: campaign.status,
  };
};

export const getCampaignsService = async (filters) => {
  return await getCampaigns(filters);
};

export const getCampaignByIdService = async (id) => {
  const campaign = await getCampaignById(id);

  if (!campaign) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return campaign;
};

export const updateCampaignService = async (id, data) => {
  const updated = await updateCampaign(id, data);

  if (!updated) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

export const deleteCampaignService = async (id) => {
  const deleted = await deleteCampaign(id);

  if (!deleted) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return { message: "Campaign deleted successfully" };
};

export const updateCampaignStatusService = async (id, status) => {
  const updated = await updateCampaignStatus(id, status);

  if (!updated) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

export const addCampaignAttachmentService = async (id, file) => {
  if (!file) {
    throw new AppError("No file uploaded", HTTP_STATUS.BAD_REQUEST);
  }

  const uploaded = await uploadToCloudinary(
    file.buffer,
    "campaign_attachments"
  );

  const attachment = {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    type: uploaded.resource_type,
  };

  const updated = await addCampaignAttachment(id, attachment);

  if (!updated) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

export const addCampaignVolunteerService = async (
  campaignId,
  volunteerRegId
) => {
  const updated = await addCampaignVolunteer(campaignId, volunteerRegId);

  if (!updated) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

export const addCampaignRatingService = async (campaignId, data) => {
  const { volunteer, rating, comment } = data;

  const ratingData = {
    volunteer,
    rating,
    comment,
    createdAt: new Date(),
  };

  const updated = await addCampaignRating(campaignId, ratingData);

  if (!updated) {
    throw new AppError("Campaign not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};
