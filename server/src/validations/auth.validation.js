import { z } from "zod";

const baseUserFields = {
  firstName: z
    .string({ message: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),

  lastName: z
    .string({ message: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  phoneNumber: z
    .string({ message: "Phone number is required" })
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number format")
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
};

// ============================================
// SCHEMA 1: Volunteer Registration
// ============================================
export const registerVolunteerSchema = z.object({
  ...baseUserFields,

  skills: z
    .array(z.string().trim().min(1))
    .max(20, "Cannot have more than 20 skills")
    .optional()
    .default([]),

  interests: z
    .array(z.string().trim().min(1))
    .max(20, "Cannot have more than 20 interests")
    .optional()
    .default([]),
});

// ============================================
// SCHEMA 2: Organizer Registration
// ============================================
export const registerOrganizerSchema = z.object({
  ...baseUserFields,

  // Required organization fields
  organizationName: z
    .string({ message: "Organization name is required" })
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .trim(),

  // Optional organization fields
  organizationDescription: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional()
    .nullable(),

  organizationType: z
    .enum(["NGO", "Charity", "Club", "Community", "Other"], {
      errorMap: () => ({ message: "Invalid organization type" }),
    })
    .optional()
    .nullable(),

  organizationPhone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number format")
    .trim()
    .optional()
    .nullable(),

  organizationEmail: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),

  organizationLocation: z
    .object({
      address: z.string().trim().optional().nullable(),
      city: z.string().trim().optional().nullable(),
      state: z.string().trim().optional().nullable(),
      country: z.string().trim().optional().nullable(),
    })
    .optional()
    .nullable(),

  organizationLogo: z
    .object({
      url: z.string().url("Invalid URL format").optional().nullable(),
      public_id: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

// ============================================
// OTHER AUTH SCHEMAS
// ============================================
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});
