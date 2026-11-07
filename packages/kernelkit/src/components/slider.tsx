"use client";

import {Slider as SliderPrimitive} from "@base-ui/react/slider";
import {cn} from "cn";

function Slider({className, defaultValue, value, min = 0, max = 100, ...props}: SliderPrimitive.Root.Props) {
    const _values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max];
    const thumbs = value !== undefined || defaultValue !== undefined ? _values.length : 1;

    return (
        <SliderPrimitive.Root
            className={cn("group/slider data-horizontal:w-full data-vertical:h-full", className)}
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            thumbAlignment="edge"
            {...props}
        >
            <SliderPrimitive.Control
                data-slot="slider-control"
                className="relative flex w-full touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-horizontal:h-4 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-4 data-vertical:flex-col data-vertical:justify-center"
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className="relative grow overflow-hidden rounded-pill bg-input select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
                >
                    <SliderPrimitive.Indicator
                        data-slot="slider-range"
                        className="bg-primary select-none group-data-invalid/slider:bg-danger data-horizontal:h-full data-vertical:w-full"
                    />
                </SliderPrimitive.Track>
                {Array.from({length: thumbs}, (_, index) => (
                    <SliderPrimitive.Thumb
                        data-slot="slider-thumb"
                        key={index}
                        className="relative block size-4 shrink-0 cursor-grab rounded-pill border-2 border-primary bg-background shadow-sm shadow-(color:--shadow-color) ring-ring/50 transition-[color,box-shadow,border-color] duration-100 select-none after:absolute after:-inset-1 hover:ring-3 has-focus-visible:ring-3 has-focus-visible:outline-hidden active:cursor-grabbing active:ring-3 group-data-invalid/slider:border-danger group-data-invalid/slider:ring-danger/20 data-disabled:pointer-events-none motion-reduce:transition-none"
                    />
                ))}
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    );
}

export {Slider};
