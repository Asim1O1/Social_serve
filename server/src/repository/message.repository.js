import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const findConversation = (campaignId, participantA, participantB) => {
  return Conversation.findOne({
    campaignId,
    participants: { $all: [participantA, participantB] },
  })
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage");
};

export const createConversation = (campaignId, participantA, participantB) => {
  const conversation = new Conversation({
    campaignId,
    participants: [participantA, participantB],
    unreadCount: {
      [participantA.toString()]: 0,
      [participantB.toString()]: 0,
    },
  });
  return conversation.save();
};

export const getConversationById = (conversationId) => {
  return Conversation.findById(conversationId)
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage");
};

export const getConversationsByUser = (userId) => {
  return Conversation.find({ participants: userId })
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage")
    .populate("campaignId", "title")
    .sort({ updatedAt: -1 });
};

export const updateConversationLastMessage = (conversationId, messageId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { lastMessage: messageId },
    { new: true },
  );
};

export const incrementUnreadCount = (conversationId, userId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { $inc: { [`unreadCount.${userId}`]: 1 } },
    { new: true },
  );
};

export const resetUnreadCount = (conversationId, userId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { $set: { [`unreadCount.${userId}`]: 0 } },
    { new: true },
  );
};

export const createMessage = (data) => {
  const message = new Message(data);
  return message.save();
};

export const getMessagesByConversation = (
  conversationId,
  page = 1,
  limit = 30,
) => {
  return Message.find({ conversationId })
    .populate("sender", "firstName lastName profilePic role")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const markMessagesAsRead = (conversationId, recipientId) => {
  return Message.updateMany(
    {
      conversationId,
      sender: { $ne: recipientId },
      readAt: null,
    },
    { readAt: new Date() },
  );
};

export const getUnreadMessageCount = (conversationId, userId) => {
  return Message.countDocuments({
    conversationId,
    sender: { $ne: userId },
    readAt: null,
  });
};
