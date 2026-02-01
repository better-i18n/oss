import { z } from "zod";

export const invoiceSchema = z.object({
  id: z.string(),
  date: z.number(),
  amount: z.number(),
  status: z.enum(["draft", "open", "paid", "uncollectible", "void"]),
  pdfUrl: z.string().nullable(),
  hostedUrl: z.string().nullable(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
