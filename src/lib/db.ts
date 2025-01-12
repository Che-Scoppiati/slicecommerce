import { v4 as uuidv4 } from "uuid";
import { env } from "@/lib/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { slicesTable, productsTable } from "@/schemas/db.schema";
import { CreateSliceParams } from "@/schemas/slice/create-slice";
import { and, eq } from "drizzle-orm";
import { CreateProductParams } from "@/schemas/slice/create-product";
import { UpdateProductParams } from "@/schemas/slice/update-product";
import { UpdateSliceParams } from "@/schemas/slice/update-slice";

export const tursoClient = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoClient, {
  schema: {
    slicesTable,
    productsTable,
  },
});

// --------------- SLICES ---------------

/*
  Get all slices
  @param limit - The number of slices to return
  @returns All the saved slices
*/
export const getSlices = async (limit: number = 10) => {
  return await db.query.slicesTable.findMany({
    limit,
  });
};

/*
  Create a slice
  @param slice - The slice to create
  @returns The created slice
*/
export const createSlice = async (slice: CreateSliceParams) => {
  const newSlice = await db.insert(slicesTable).values({
    id: uuidv4(),
    ...slice,
  });
  return newSlice;
};

/*
  Get a slice by id
  @param id - The id of the slice
  @returns The slice
*/
export const getSliceById = async (id: string) => {
  return await db.query.slicesTable.findFirst({
    where: eq(slicesTable.id, id),
  });
};

/*
  Get a slice by name
  @param name - The name of the slice
  @returns The slice
*/
export const getSliceByName = async (name: string) => {
  return await db.query.slicesTable.findFirst({
    where: eq(slicesTable.name, name),
  });
};

/*
  Update a slice
  @param id - The id of the slice
  @param slice - The slice to update
  @returns The updated slice
*/
export const updateSlice = async (id: string, slice: UpdateSliceParams) => {
  return await db.update(slicesTable).set(slice).where(eq(slicesTable.id, id));
};

// --------------- PRODUCTS ---------------

/*
  Get products for a slice by name
  @param sliceName - The name of the slice
  @param limit - The number of products to return
  @returns The products for the slice
*/
export const getSliceProducts = async (
  sliceName: string,
  limit: number = 10
) => {
  const slice = await getSliceByName(sliceName);
  if (!slice) {
    return [];
  }
  return await db.query.productsTable.findMany({
    where: eq(productsTable.sliceId, slice.id),
    limit,
    with: {
      slice: true,
    },
  });
};

/*
  Create a product
  @param product - The product to create
  @returns The created product
*/
export const createProduct = async (product: CreateProductParams) => {
  const newProduct = await db.insert(productsTable).values({
    ...product,
    id: uuidv4(),
    images: product.images.join(";"),
  });
  return newProduct;
};

/*
  Get a product by id
  @param id - The id of the product
  @returns The product
*/
export const getProductById = async (id: string) => {
  return await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
    with: {
      slice: true,
    },
  });
};

/*
  Get a product by name
  @param sliceName - The name of the slice
  @param productName - The name of the product
  @returns The product
*/
export const getProductByName = async (
  sliceName: string,
  productName: string
) => {
  const slice = await getSliceByName(sliceName);
  if (!slice) {
    return null;
  }
  return await db.query.productsTable.findFirst({
    where: and(
      eq(productsTable.name, productName),
      eq(productsTable.sliceId, slice.id)
    ),
    with: {
      slice: true,
    },
  });
};

/*
  Update a product
  @param id - The id of the product
  @param product - The product to update
  @returns The updated product
*/
export const updateProduct = async (
  id: string,
  product: UpdateProductParams
) => {
  return await db
    .update(productsTable)
    .set({
      ...product,
      images: product.images.join(";"),
    })
    .where(eq(productsTable.id, id));
};
