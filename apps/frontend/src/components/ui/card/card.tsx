import { cn } from "@/lib/utils";

import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "./types";
import { memo } from "react";

function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

const MemoizedCard = memo(Card);
const MemoizedCardContent = memo(CardContent);
const MemoizedCardDescription = memo(CardDescription);
const MemoizedCardFooter = memo(CardFooter);
const MemoizedCardHeader = memo(CardHeader);
const MemoizedCardTitle = memo(CardTitle);

export {
  MemoizedCard as Card,
  MemoizedCardContent as CardContent,
  MemoizedCardDescription as CardDescription,
  MemoizedCardFooter as CardFooter,
  MemoizedCardHeader as CardHeader,
  MemoizedCardTitle as CardTitle,
};

const CardComponents = {
  Card: MemoizedCard,
  CardContent: MemoizedCardContent,
  CardDescription: MemoizedCardDescription,
  CardFooter: MemoizedCardFooter,
  CardHeader: MemoizedCardHeader,
  CardTitle: MemoizedCardTitle,
};

export default CardComponents;
