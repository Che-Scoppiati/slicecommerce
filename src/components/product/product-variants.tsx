
import { cn } from "@/lib/utils";
import { ProductCart } from "@slicekit/core";
import React, { Dispatch, SetStateAction } from "react";

interface ProductVariantsProps {
  product: ProductCart;
  selectedVariant: number | null;
  setSelectedVariant: Dispatch<SetStateAction<number | null>>
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  product,
  selectedVariant,
  setSelectedVariant
}) => {

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Select Variant</h2>
      <div className="relative">
        <div className="flex overflow-x-auto -mx-2 px-2 py-1 scrollbar-hide">
          {product.externalProduct?.providerVariants.map(
            (variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={cn(
                  "flex-shrink-0 h-10 px-4 mr-2 text-sm text-black rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  selectedVariant === variant.id
                    ? "bg-blue-600 text-white border-transparent"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                )}
              >
                {variant.variant}
              </button>
            )
          )}
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white pointer-events-none" />
      </div>
    </div>
  )
}