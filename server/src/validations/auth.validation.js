import { z } from "zod";

export const registerSchema = z.object({
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
    .string()
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  role: z
    .enum(["ADMIN", "VOLUNTEER"], {
      errorMap: () => ({ message: "Role must be either ADMIN or VOLUNTEER" }),
    })
    .optional()
    .default("VOLUNTEER"),

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
