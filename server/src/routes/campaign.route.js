import express from "express";
import {
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
} from "../controllers/campaign.controller.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  addVolunteerSchema,
  createCampaignSchema,
  ratingSchema,
  updateCampaignSchema,
  updateStatusSchema,
} from "../validations/campaign.validation.js";

const router = express.Router();

router.post(
  "/",
  upload.array("attachments"),
  validate(createCampaignSchema),
  createCampaign
);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.put(
  "/:id",
  upload.array("attachments"),
  validate(updateCampaignSchema),
  updateCampaign
);
router.delete("/:id", deleteCampaign);

router.patch("/:id/status", validate(updateStatusSchema), updateCampaignStatus);
router.post(
  "/:id/volunteer",
  validate(addVolunteerSchema),
  addCampaignVolunteer
);
router.post("/:id/rating", validate(ratingSchema), addCampaignRating);

export default router;
