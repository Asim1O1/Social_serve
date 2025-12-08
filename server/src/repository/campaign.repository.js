import Campaign from "../models/campaign.model.js";

export const createCampaign = async (data) => {
  const campaign = new Campaign(data);
  return await campaign.save();
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
