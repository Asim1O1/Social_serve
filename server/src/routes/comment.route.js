import express from "express";
import {
  addComment,
  deleteComment,
  getCommentThread,
} from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import { addCommentSchema } from "../validations/comment.validation.js";

const router = express.Router({ mergeParams: true });

router.get("/:ratingId", requireAuth, getCommentThread);

router.post("/:ratingId", requireAuth, validate(addCommentSchema), addComment);

router.delete("/:ratingId/:commentId", requireAuth, deleteComment);

export default router;
