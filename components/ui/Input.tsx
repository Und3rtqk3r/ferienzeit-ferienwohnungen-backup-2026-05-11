import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type LabelHTMLAttributes } from "react";

// -----------------------------------------------------------------
// Label
// -----------------------------------------------------------------
export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-xs uppercase tracking-[0.18em] text-ink/70 font-medium",
        className
      )}
      {...props}
    />
  );
}

// -----------------------------------------------------------------
// Input
// -----------------------------------------------------------------
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-transparent border-b py-2.5 text-base",
        "placeholder:text-ink/40 focus:outline-none",
        error
          ? "border-red-600 focus:border-red-700"
          : "border-ink/25 focus:border-ink",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

// -----------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-transparent border py-3 px-3 text-base rounded-md",
        "placeholder:text-ink/40 focus:outline-none resize-y min-h-[120px]",
        error
          ? "border-red-600 focus:border-red-700"
          : "border-ink/25 focus:border-ink",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// -----------------------------------------------------------------
// FieldError – ein einheitlicher Fehler-Text
// -----------------------------------------------------------------
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-700">{message}</p>;
}
