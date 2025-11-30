import Campaign from "../models/campaign.model.js";

export const createCampaign = async (data) => {
  try {
    const campaign = new Campaign(data);
    return await campaign.save();
  } catch (error) {
    console.error("MongoDB Save Error:", error);
    throw error;
  }
};

export const getCampaigns = (filters = {}) => {
  return Campaign.find(filters).sort({ createdAt: -1 }).lean();
};

export const getCampaignById = (id) => {
  return Campaign.findById(id).lean();
};

export const updateCampaign = (id, updateData) => {
  return Campaign.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteCampaign = (id) => {
  return Campaign.findByIdAndDelete(id);
};

export const updateCampaignStatus = (id, status) => {
  return Campaign.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
};

export const addCampaignAttachment = (id, attachment) => {
  return Campaign.findByIdAndUpdate(
    id,
    { $push: { attachments: attachment } },
    { new: true, runValidators: true }
  );
};

export const addCampaignVolunteer = (campaignId, volunteerRegId) => {
  return Campaign.findByIdAndUpdate(
    campaignId,
    { $push: { volunteers: volunteerRegId } },
    { new: true, runValidators: true }
  );
};

export const addCampaignRating = (campaignId, ratingData) => {
  return Campaign.findByIdAndUpdate(
    campaignId,
    { $push: { ratings: ratingData } },
    { new: true, runValidators: true }
  );
};
