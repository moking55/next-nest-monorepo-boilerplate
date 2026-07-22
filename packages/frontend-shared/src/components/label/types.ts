import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import type * as LabelPrimitive from "@radix-ui/react-label";
import type { VariantProps } from "class-variance-authority";

import type { labelVariants } from "./label";

export type LabelRef = ComponentRef<typeof LabelPrimitive.Root>;

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>;
