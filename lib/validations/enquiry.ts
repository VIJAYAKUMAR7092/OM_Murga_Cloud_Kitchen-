import { z } from "zod";

export const customerEnquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Invalid phone number format"),
  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    }),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type CustomerEnquiryInput = z.infer<typeof customerEnquirySchema>;
