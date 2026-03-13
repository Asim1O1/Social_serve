import {
  getConversationsService,
  getMessagesService,
  getOrCreateConversationService,
  uploadAttachmentService,
} from "../services/message.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { campaignId, volunteerId } = req.body;
  const data = await getOrCreateConversationService(
    campaignId,
    req.user,
    volunteerId,
  );
  return success(res, "Conversation retrieved successfully", data);
});

export const getConversations = asyncHandler(async (req, res) => {
  const data = await getConversationsService(req.user._id);
  return success(res, "Conversations retrieved successfully", data);
});

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const data = await getMessagesService(
    conversationId,
    req.user._id,
    req.query,
  );
  return success(res, "Messages retrieved successfully", data);
});

export const uploadAttachment = asyncHandler(async (req, res) => {
  const data = await uploadAttachmentService(req.file);
  return success(res, "Attachment uploaded successfully", data);
});
