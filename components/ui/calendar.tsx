"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-surface-container rounded-xl elevation-2 border border-outline-variant", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 pb-2 relative items-center w-full",
        caption_label: "text-lg font-semibold text-surface-foreground tracking-tight",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-xl state-layer",
          "h-9 w-9 bg-surface-container-high hover:bg-surface-container-highest",
          "border border-outline-variant hover:border-outline",
          "text-surface-foreground transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:pointer-events-none disabled:opacity-50"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: cn(
          "text-surface-variant-foreground rounded-lg w-10 font-medium text-sm",
          "flex items-center justify-center h-10 uppercase tracking-wide"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm h-10 w-10",
          "focus-within:relative focus-within:z-20",
          "has-[button[aria-selected=true]]:bg-primary-container/30 rounded-xl",
          props.mode === "range"
            ? "has-[button.day-range-end]:rounded-r-xl has-[button.day-range-start]:rounded-l-xl first:has-[button[aria-selected=true]]:rounded-l-xl last:has-[button[aria-selected=true]]:rounded-r-xl"
            : "has-[button[aria-selected=true]]:rounded-xl"
        ),
        day: cn(
          "h-10 w-10 p-0 font-normal rounded-xl transition-all duration-200 text-sm",
          "hover:bg-surface-container-high hover:text-surface-foreground hover:scale-105",
          "focus-visible:bg-surface-container-high focus-visible:text-surface-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "aria-selected:opacity-100 aria-selected:bg-primary aria-selected:text-primary-foreground",
          "aria-selected:font-semibold aria-selected:shadow-lg aria-selected:scale-105",
          "active:scale-95 cursor-pointer"
        ),
        day_range_start: cn(
          "day-range-start rounded-l-xl",
          "aria-selected:bg-primary aria-selected:text-primary-foreground"
        ),
        day_range_end: cn(
          "day-range-end rounded-r-xl", 
          "aria-selected:bg-primary aria-selected:text-primary-foreground"
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground font-semibold shadow-lg",
          "hover:bg-primary hover:text-primary-foreground hover:brightness-110",
          "focus:bg-primary focus:text-primary-foreground",
          "ring-2 ring-primary/30 scale-105"
        ),
        day_today: cn(
          "bg-tertiary-container text-tertiary-container-foreground font-semibold",
          "ring-2 ring-tertiary shadow-md",
          "hover:bg-tertiary hover:text-tertiary-foreground"
        ),
        day_outside: cn(
          "day-outside text-surface-variant-foreground/60 opacity-60",
          "aria-selected:text-primary-foreground aria-selected:opacity-100",
          "hover:opacity-80"
        ),
        day_disabled: "text-surface-variant-foreground/40 opacity-40 cursor-not-allowed hover:scale-100",
        day_range_middle: cn(
          "aria-selected:bg-primary-container aria-selected:text-primary-container-foreground",
          "rounded-none bg-primary-container/20"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return (
            <Icon 
              className={cn("h-4 w-4 text-surface-foreground", className)} 
              {...props} 
            />
          );
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
