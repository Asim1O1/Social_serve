import userModel from "../models/user.model.js";

export const extractMentions = async (comment) => {
  if (!comment) return [];

  const mentionMatches = comment.match(/@([a-zA-Z0-9._]+)/g) || [];

  const usernames = mentionMatches.map((m) => m.slice(1)); // remove @

  if (usernames.length === 0) return [];

  const users = await userModel
    .find({
      $or: usernames.map((name) => ({
        firstName: new RegExp(`^${name}$`, "i"),
      })),
    })
    .select("_id");

  return users.map((u) => u._id);
};
