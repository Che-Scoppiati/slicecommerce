import * as dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  NEXT_PUBLIC_URL: z.string().url(),
  SLICE_STORE_ID: z.coerce.number().min(1),
  THEGRAPH_API_KEY: z.string().optional(),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error(
    `An error has occurred while parsing environment variables:${error.errors.map(
      (e) => ` ${e.path.join(".")} is ${e.message}`
    )}`
  );
  process.exit(1);
}

export type EnvSchemaType = z.infer<typeof envSchema>;
export const env = data;
