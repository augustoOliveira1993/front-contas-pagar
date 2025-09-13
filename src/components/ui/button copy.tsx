import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 disabled:opacity-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 [&_svg]:size-4 font-medium text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-zinc-200 shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
        shineHover:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
        gooeyRight:
          "relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft:
          "relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        gradientSlideShow:
          "bg-[size:400%] bg-[linear-gradient(-45deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] animate-gradient-flow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

interface IconProps {
  icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps &
    ButtonIconProps & {
      loading?: boolean;
      tooltip?: React.ReactNode | string;
      tooltipSide?: "top" | "right" | "bottom" | "left";
      tooltipAlign?: "start" | "center" | "end";
      tooltipDelay?: number;
    }
>(
  (
    {
      className,
      variant,
      effect,
      loading,
      size,
      tooltip,
      icon: Icon,
      iconPlacement,
      tooltipSide = "left",
      tooltipAlign = "center",
      tooltipDelay = 0,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <TooltipProvider>
        <Tooltip delayDuration={tooltipDelay}>
          <TooltipTrigger asChild>
            <Comp
              className={cn(
                buttonVariants({ variant, effect, size, className })
              )}
              ref={ref}
              {...props}
            >
              {Icon &&
                iconPlacement === "left" &&
                (effect === "expandIcon" ? (
                  <div className="opacity-0 group-hover:opacity-100 pr-0 group-hover:pr-2 w-0 group-hover:w-5 transition-all translate-x-[0%] group-hover:translate-x-100 duration-200">
                    <Icon />
                  </div>
                ) : (
                  <Icon />
                ))}
              {loading && !(effect === "expandIcon") && (
                <LoaderIcon className="animate-spin" />
              )}
              <Slottable>{props.children}</Slottable>
              {Icon &&
                iconPlacement === "right" &&
                (effect === "expandIcon" ? (
                  <div className="opacity-0 group-hover:opacity-100 pl-0 group-hover:pl-2 w-0 group-hover:w-5 transition-all translate-x-[100%] group-hover:translate-x-0 duration-200">
                    <Icon />
                  </div>
                ) : (
                  <Icon />
                ))}
            </Comp>
          </TooltipTrigger>
          {tooltip ? (
            <TooltipContent
              side={tooltipSide}
              align={tooltipAlign}
            >
              {tooltip}
            </TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
