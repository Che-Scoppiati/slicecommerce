import { NextRequest } from "next/server";

import { getProductByName } from "@/lib/db";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url);
    const slicerName = url.searchParams.get("slicerName");
    const productName = url.searchParams.get("productName");

    if (!slicerName || !productName) {
      return new Response(undefined, {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const product = await getProductByName(slicerName, productName);

    console.log("db product", product);

    if (!product) {
      return new Response(undefined, {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }
    return Response.json(
      { status: "ok", data: product },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "nok", error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
