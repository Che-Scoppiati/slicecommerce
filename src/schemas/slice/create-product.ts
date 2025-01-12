import { z } from "zod";

export const createProductSchema = z.object({
  sliceId: z.string().uuid(),
  name: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  currencyAddress: z.string(),
  currencySymbol: z.string(),
  currencyDecimals: z.number(),
  availableUnits: z.number(),
});

export type CreateProductParams = z.infer<typeof createProductSchema>;
