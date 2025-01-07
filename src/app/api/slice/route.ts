import { NextResponse, type NextRequest } from "next/server";

import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { validate as uuidValidate } from "uuid";

import type { Params } from "@/types/request-params";
import { getSliceStores } from "@/lib/slice";

const paramsCache = createSearchParamsCache({
  userId: parseAsString.withDefault(""),
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<Params> }
): Promise<Response> {
  const { userId } = await paramsCache.parse(props.params);
  if (!userId || !uuidValidate(userId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
  try {
    const stores = await getSliceStores();

    if (!stores) {
      return new NextResponse(undefined, {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    return new NextResponse(JSON.stringify({ status: "ok", data: stores }), {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify({ data: stores }).length.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ status: "nok", error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
