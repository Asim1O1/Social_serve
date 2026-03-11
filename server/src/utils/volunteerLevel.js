import Campaign from "../models/campaign.model.js";
import taskSubmissionModel from "../models/taskSubmission.model.js";
import userModel from "../models/user.model.js";

export const LEVELS = [
  { name: "Novice", minPoints: 0 },
  { name: "Apprentice", minPoints: 20 },
  { name: "Contributor", minPoints: 50 },
  { name: "Achiever", minPoints: 100 },
  { name: "Champion", minPoints: 200 },
];

export const calculateVolunteerPoints = async (volunteerId) => {
  const user = await userModel.findById(volunteerId);
  if (!user) return 0;

  let points = 0;

  user.attendanceHistory?.forEach((att) => {
    if (att.attendanceStatus === "present") points += 1;
  });

  const acceptedTasks = await taskSubmissionModel.countDocuments({
    volunteer: volunteerId,
    status: "accepted",
  });
  points += acceptedTasks * 5;

  const completedCampaigns = await Campaign.countDocuments({
    "volunteers.volunteer": volunteerId,
    status: "PUBLISHED",
    endDate: { $lte: new Date() },
  });
  points += completedCampaigns * 10;

  const campaignsWithRatings = await Campaign.find({
    "ratings.volunteer": volunteerId,
  }).lean();

  campaignsWithRatings.forEach((c) => {
    const rating = c.ratings.find(
      (r) => r.volunteer.toString() === volunteerId.toString(),
    );
    if (rating) points += rating.rating || 0;
  });

  return points;
};

export const updateVolunteerLevelAndBadge = async (volunteerId) => {
  const user = await userModel.findById(volunteerId);
  if (!user) return;

  const points = await calculateVolunteerPoints(volunteerId);

  const level = LEVELS.slice()
    .reverse()
    .find((lvl) => points >= lvl.minPoints);

  if (!level) return;

  user.level = level.name;

  const existingBadge = user.badges.find((b) => b.name === level.name);
  if (!existingBadge) {
    user.badges.push({ name: level.name, earnedAt: new Date() });
  }

  await user.save();
  return { points, level: level.name };
};
