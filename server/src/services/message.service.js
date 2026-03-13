import { HTTP_STATUS } from "../constants/http.js";
import { getCampaignById } from "../repository/campaign.repository.js";
import {
  createConversation,
  createMessage,
  findConversation,
  getConversationById,
  getConversationsByUser,
  getMessagesByConversation,
  incrementUnreadCount,
  markMessagesAsRead,
  resetUnreadCount,
  updateConversationLastMessage,
} from "../repository/message.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const assertParticipant = (conversation, userId) => {
  const isParticipant = conversation.participants.some(
    (p) => p._id.toString() === userId.toString(),
  );
  assertOrThrow(isParticipant, HTTP_STATUS.FORBIDDEN, "Access denied");
};

const resolveParticipants = (campaign, requestingUser, volunteerId) => {
  if (requestingUser.role === "ADMIN") {
    assertOrThrow(
      volunteerId,
      HTTP_STATUS.BAD_REQUEST,
      "volunteerId is required",
    );
    return {
      adminId: requestingUser._id,
      volunteerId,
    };
  }

  return {
    adminId: campaign.createdBy._id ?? campaign.createdBy,
    volunteerId: requestingUser._id,
  };
};

export const getOrCreateConversationService = async (
  campaignId,
  requestingUser,
  volunteerId,
) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { adminId, volunteerId: resolvedVolunteerId } = resolveParticipants(
    campaign,
    requestingUser,
    volunteerId,
  );

  const volunteerRecord = campaign.volunteers.find(
    (v) => v.volunteer._id.toString() === resolvedVolunteerId.toString(),
  );
  assertOrThrow(
    volunteerRecord,
    HTTP_STATUS.FORBIDDEN,
    "Volunteer has not applied to this campaign",
  );
  assertOrThrow(
    volunteerRecord.status === "accepted",
    HTTP_STATUS.FORBIDDEN,
    "Only accepted volunteers can use campaign chat",
  );

  let conversation = await findConversation(
    campaignId,
    adminId,
    resolvedVolunteerId,
  );

  if (!conversation) {
    conversation = await createConversation(
      campaignId,
      adminId,
      resolvedVolunteerId,
    );

    conversation = await getConversationById(conversation._id);
  }

  return conversation;
};

export const getConversationsService = async (userId) => {
  return getConversationsByUser(userId);
};

export const getMessagesService = async (conversationId, userId, query) => {
  const { page = 1, limit = 30 } = query;

  const conversation = await getConversationById(conversationId);
  assertOrThrow(conversation, HTTP_STATUS.NOT_FOUND, "Conversation not found");
  assertParticipant(conversation, userId);

  const messages = await getMessagesByConversation(
    conversationId,
    Number(page),
    Number(limit),
  );

  await markMessagesAsRead(conversationId, userId);
  await resetUnreadCount(conversationId, userId);

  return { messages, conversation };
};

export const sendMessageService = async ({
  conversationId,
  senderId,
  text,
  attachment,
}) => {
  const conversation = await getConversationById(conversationId);
  assertOrThrow(conversation, HTTP_STATUS.NOT_FOUND, "Conversation not found");
  assertParticipant(conversation, senderId);

  const message = await createMessage({
    conversationId,
    sender: senderId,
    text: text || null,
    attachment: attachment || {},
  });

  await updateConversationLastMessage(conversationId, message._id);

  const recipient = conversation.participants.find(
    (p) => p._id.toString() !== senderId.toString(),
  );
  if (recipient) {
    await incrementUnreadCount(conversationId, recipient._id);
  }

  const populated = await message.populate(
    "sender",
    "firstName lastName profilePic role",
  );

  return { message: populated, recipientId: recipient?._id };
};

export const uploadAttachmentService = async (file) => {
  assertOrThrow(file, HTTP_STATUS.BAD_REQUEST, "No file provided");

  const uploaded = await uploadToCloudinary(file.buffer, "chat_attachments");

  return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    type: uploaded.resource_type,
    originalName: file.originalname,
  };
};

export const markAsReadService = async (conversationId, userId) => {
  await markMessagesAsRead(conversationId, userId);
  await resetUnreadCount(conversationId, userId);
};
