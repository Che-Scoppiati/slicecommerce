/* eslint-disable @next/next/no-img-element */
import { getSliceStoreProducts } from "@/lib/slice";
import { ImageResponse } from "next/og";
export const dynamic = "force-dynamic";

export const contentType = "image/png";

export const alt = "SliceCommerce";
export const size = {
  width: 600,
  height: 400,
};

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image() {
  try {
    const { cartProducts } = await getSliceStoreProducts();
    const product = cartProducts[0];
    const productPrice =
      Number(product.price) / 10 ** (product.currency.decimals || 6);

    console.log(productPrice, product.images[0]);

    return new ImageResponse(
      (
        <div tw="h-full w-full flex flex-col justify-center items-center relative bg-white">
          <div tw="flex flex-col">
            <img
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={250}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0px",
                marginTop: "-10px",
              }}
            >
              <h1 tw="text-2xl">{product.name}</h1>

              <div
                style={{
                  display: "flex",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "1px solid #3b82f6",
                  borderRadius: "20px",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "-10px",
                }}
              >
                <h1 tw="font-bold text-center text-xl px-4 py-1 my-0">{`${productPrice} ${product.currency.symbol}`}</h1>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Geist",
            data: await loadGoogleFont("Geist"),
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    console.log(`Failed to generate image`, e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
