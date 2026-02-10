export const getCampaignPhase = (campaign) => {
  const now = new Date();

  if (campaign.status === "DRAFT") return "DRAFT";

  if (now < campaign.startDate) return "UPCOMING";
  if (now <= campaign.endDate) return "ONGOING";

  return "COMPLETED";
};
