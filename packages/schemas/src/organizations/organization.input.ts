
import { z } from 'zod';

/**
 * Schema for creating a new organization.
 */
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be less than 100 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters"),
  logo: z.string().url("Invalid logo URL").optional(),
});

// Type exports
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;


