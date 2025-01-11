import { ProductCart } from "@slicekit/core";
import Image from "next/image";

interface ProductPriceProps {
  product: ProductCart;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  product
}) => {

  return (
    <div className="flex flex-row justify-left items-center w-full gap-2">
      <h1 className="text-2xl font-bold border border-slate-500 rounded-md p-2 w-fit bg-blue-500 text-white">
        {Number(product.price) /
          10 ** (product.currency.decimals || 6)}{" "}
        {product.currency.symbol}
      </h1>
      <span className="text-sm text-muted-foreground">on</span>
      <Image
        src="/images/logo-base.png"
        width={24}
        height={24}
        alt="Base logo"
      />
    </div>
  )
}