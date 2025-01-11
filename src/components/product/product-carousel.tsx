import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCart } from "@slicekit/core";
import { ZoomableImage } from "../ui/zoomable-image";

interface ProductCarouselProps {
  product: ProductCart;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  product
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col items-center gap-2 w-full mx-auto">
      <Carousel className="w-[80%]" setApi={setApi}>
        <CarouselContent>
          {product.images.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <ZoomableImage
                    src={image}
                    alt={`${product.name} image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="pt-1 text-center text-sm text-muted-foreground">
        Image {current} of {count}
      </div>
    </div>
  )
}