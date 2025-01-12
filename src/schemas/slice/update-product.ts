import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  currencyAddress: z.string(),
  currencySymbol: z.string(),
  currencyDecimals: z.number(),
  availableUnits: z.number(),
});

export type UpdateProductParams = z.infer<typeof updateProductSchema>;
