import { cn } from "@/lib/utils";

import type { InputProps } from "./types";
import { memo } from "react";

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 outline-none",
        className,
      )}
      {...props}
    />
  );
}
const MemoizedInput = memo(Input);
export { MemoizedInput as Input };
export default MemoizedInput;
