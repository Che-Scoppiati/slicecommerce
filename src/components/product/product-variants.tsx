
import { cn } from "@/lib/utils";
import { ProductCart } from "@slicekit/core";
import React, { Dispatch, SetStateAction } from "react";

interface ProductVariantsProps {
  product: ProductCart;
  selectedVariant: string | null;
  setSelectedVariant: Dispatch<SetStateAction<string | null>>
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  product,
  selectedVariant,
  setSelectedVariant
}) => {

  return (
    <div className="w-full max-w-md mx-auto pb-2">
      <h2 className="text-lg font-semibold mb-2">Select Variant</h2>
      <div className="relative">
        <div className="flex overflow-x-auto -mx-2 px-2 scrollbar-hide">
          {product.externalProduct?.providerVariants.map(
            (variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.variant)}
                className={cn(
                  "flex-shrink-0 h-10 px-4 mr-2 text-sm text-black rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  selectedVariant === variant.variant
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
      {selectedVariant && (
        <p className="mt-4 text-sm text-gray-600">
          Selected variant:{" "}
          <span className="font-semibold">{selectedVariant}</span>
        </p>
      )}
    </div>
  )
}