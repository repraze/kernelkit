"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import useEmblaCarousel, {type UseEmblaCarouselType} from "embla-carousel-react";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import * as React from "react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }

    return context;
}

function Carousel({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & CarouselProps) {
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
        },
        plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
        if (!api) {
            return;
        }
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollNext();
            }
        },
        [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
        if (!api || !setApi) {
            return;
        }
        setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
        if (!api) {
            return;
        }
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);

        return () => {
            api.off("reInit", onSelect);
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                api,
                opts,
                orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
            }}
        >
            <div
                onKeyDownCapture={handleKeyDown}
                className={cn("relative", className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({className, ...props}: React.ComponentProps<"div">) {
    const {carouselRef, orientation} = useCarousel();

    return (
        <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
            <div
                data-slot="carousel-track"
                className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
                {...props}
            />
        </div>
    );
}

function CarouselItem({className, ...props}: React.ComponentProps<"div">) {
    const {orientation} = useCarousel();

    return (
        <div
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                orientation === "horizontal" ? "pl-4" : "pt-4",
                className,
            )}
            {...props}
        />
    );
}

function CarouselPrevious({
    className,
    variant = "outline",
    size = "icon-sm",
    ...props
}: React.ComponentProps<typeof Button>) {
    const {orientation, scrollPrev, canScrollPrev} = useCarousel();

    return (
        <Button
            data-slot="carousel-previous"
            variant={variant}
            size={size}
            className={cn(
                "absolute touch-manipulation rounded-pill",
                orientation === "horizontal"
                    ? "inset-y-0 -left-12 my-auto"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

function CarouselNext({
    className,
    variant = "outline",
    size = "icon-sm",
    ...props
}: React.ComponentProps<typeof Button>) {
    const {orientation, scrollNext, canScrollNext} = useCarousel();

    return (
        <Button
            data-slot="carousel-next"
            variant={variant}
            size={size}
            className={cn(
                "absolute touch-manipulation rounded-pill",
                orientation === "horizontal"
                    ? "inset-y-0 -right-12 my-auto"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRightIcon />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

/** One dot per snap point; the current one is a wider primary pill (selected = fill, §6). */
function CarouselDots({className, ...props}: React.ComponentProps<"div">) {
    const {api, orientation} = useCarousel();
    const [snaps, setSnaps] = React.useState<number[]>([]);
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }
        const update = () => {
            setSnaps(api.scrollSnapList());
            setCurrent(api.selectedScrollSnap());
        };
        update();
        api.on("reInit", update);
        api.on("select", update);
        return () => {
            api.off("reInit", update);
            api.off("select", update);
        };
    }, [api]);

    return (
        <div
            data-slot="carousel-dots"
            className={cn(
                "flex items-center justify-center gap-1.5",
                orientation === "horizontal" ? "pt-3" : "flex-col pl-3",
                className,
            )}
            {...props}
        >
            {snaps.map((_, index) => (
                <button
                    key={index}
                    type="button"
                    data-slot="carousel-dot"
                    data-active={index === current || undefined}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === current || undefined}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        focusRing,
                        "size-2 rounded-pill bg-border transition-[width,height,background-color,box-shadow] duration-150 hover:bg-primary/50 motion-reduce:transition-none",
                        "data-active:bg-primary-text",
                        orientation === "horizontal" ? "data-active:w-5" : "data-active:h-5",
                    )}
                />
            ))}
        </div>
    );
}

export {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselDots,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    useCarousel,
};
