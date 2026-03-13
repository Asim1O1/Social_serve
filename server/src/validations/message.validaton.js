import { z } from "zod";

const objectId = (fieldName) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .length(24, `Invalid ${fieldName}`)
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: `Invalid ${fieldName}`,
    });

export const getOrCreateConversationSchema = z.object({
  campaignId: objectId("campaignId"),

  volunteerId: objectId("volunteerId").optional(),
});
