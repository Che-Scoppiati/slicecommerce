import { getSliceStoreProducts } from "@/lib/slice";

export async function GET(): Promise<Response> {
  try {
    const { cartProducts } = await getSliceStoreProducts(undefined, undefined);

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
