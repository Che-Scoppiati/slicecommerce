import { getSliceStores } from "@/lib/slice";

export async function GET(): Promise<Response> {
  try {
    const stores = await getSliceStores();

    if (!stores) {
      return new Response(undefined, {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }
    return Response.json(
      { status: "ok", data: stores },
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
