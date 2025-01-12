import { getSliceStoreProducts } from "@/lib/slice";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const slicerId = url.searchParams.get("slicerId")
    const buyer = url.searchParams.get("buyer");
    const isOnsite = url.searchParams.get("isOnsite") === "true";

    if (!slicerId || !buyer) {
      return new Response(undefined, {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const { cartProducts } = await getSliceStoreProducts(Number(slicerId), buyer, isOnsite);

    console.log("cartProducts", cartProducts)

    if (!cartProducts) {
      return new Response(undefined, {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }
    return Response.json(
      { status: "ok", data: cartProducts },
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
