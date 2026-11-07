"use client";

import {cn} from "cn";
import {OTPInput, OTPInputContext} from "input-otp";
import {MinusIcon} from "lucide-react";
import * as React from "react";

/** Pass `aria-invalid` to `InputOTP` (it lands on the hidden input) and every slot turns danger. */
function InputOTP({
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn(
                "group/input-otp cn-input-otp flex items-center gap-2 has-disabled:opacity-50",
                containerClassName,
            )}
            spellCheck={false}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
        />
    );
}

function InputOTPGroup({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="input-otp-group" className={cn("flex items-center rounded-lg", className)} {...props} />;
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    index: number;
}) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const {char, hasFakeCaret, isActive} = inputOTPContext?.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                "relative flex size-8 items-center justify-center border-y border-r border-input font-mono text-sm tabular-nums transition-[color,background-color,border-color,box-shadow] outline-none first:rounded-l-lg first:border-l last:rounded-r-lg bg-field hc:bg-transparent dark:hc:bg-transparent",
                "group-has-disabled/input-otp:bg-field-disabled",
                "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50",
                // invalid: on the slot itself or on the OTP input
                "aria-invalid:border-danger group-has-[input[aria-invalid=true]]/input-otp:border-danger",
                "data-[active=true]:aria-invalid:ring-danger/20 group-has-[input[aria-invalid=true]]/input-otp:data-[active=true]:ring-danger/20 dark:data-[active=true]:aria-invalid:ring-danger/40 dark:group-has-[input[aria-invalid=true]]/input-otp:data-[active=true]:ring-danger/40",
                className,
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-otp-separator"
            className={cn("flex items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4", className)}
            role="separator"
            {...props}
        >
            <MinusIcon />
        </div>
    );
}

export {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot};
