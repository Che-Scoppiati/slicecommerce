import { z } from "zod";

export const createSliceSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

export type CreateSliceParams = z.infer<typeof createSliceSchema>;
