"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addDays, startOfDay } from "date-fns"

interface EnhancedCalendarProps extends React.ComponentProps<typeof Calendar> {
  onSelect?: (date: Date | undefined) => void;
  selected?: Date;
  showQuickActions?: boolean;
}

export function EnhancedCalendar({
  onSelect,
  selected,
  showQuickActions = true,
  className,
  ...props
}: EnhancedCalendarProps) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const nextMonth = addDays(today, 30);

  const quickDates = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: tomorrow },
    { label: "Next Week", date: nextWeek },
    { label: "In 30 Days", date: nextMonth },
  ];

  const handleQuickSelect = (date: Date) => {
    onSelect?.(date);
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    return startOfDay(date).getTime() === startOfDay(selected).getTime();
  };

  return (
    <div className="space-y-3">
      {showQuickActions && (
        <div className="flex flex-wrap gap-2 px-2">
          {quickDates.map(({ label, date }) => (
            <Button
              key={label}
              type="button"
              variant={isSelected(date) ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickSelect(date)}
              className={cn(
                "text-xs h-8 transition-all duration-200",
                isSelected(date) && "ring-2 ring-primary/30 shadow-md"
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        className={className}
        {...props}
      />
    </div>
  );
}
