import { z } from "zod";

export const updateSliceSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

export type UpdateSliceParams = z.infer<typeof updateSliceSchema>;
