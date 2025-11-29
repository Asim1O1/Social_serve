import { z } from "zod";

/**
 * CREATE CAMPAIGN SCHEMA
 */
export const createCampaignSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title is too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),

  category: z.enum(
    ["Health", "Education", "Environment", "Social Work", "Other"],
    {
      errorMap: () => ({ message: "Invalid campaign category" }),
    }
  ),

  location: z.string().min(2, "Location is required"),

  date: z
    .string()
    .or(z.date())
    .refine((val) => new Date(val) > new Date(), {
      message: "Date must be in the future",
    }),

  createdBy: z.string().optional(), // usually added automatically from auth
});

/**
 * UPDATE CAMPAIGN SCHEMA
 */
export const updateCampaignSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z
    .enum(["Health", "Education", "Environment", "Social Work", "Other"])
    .optional(),
  location: z.string().optional(),
  date: z.string().or(z.date()).optional(),
});

/**
 * UPDATE STATUS SCHEMA
 */
export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED"], {
    errorMap: () => ({ message: "Invalid campaign status" }),
  }),
});

/**
 * RATING SCHEMA
 */
export const ratingSchema = z.object({
  volunteer: z.string({
    required_error: "Volunteer ID is required",
  }),

  rating: z
    .number({
      required_error: "Rating is required",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z.string().optional(),
});
