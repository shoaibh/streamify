"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";

type Props = {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<DateRange | undefined>;
  onClick: () => void;
  loading?: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void;
};

export function DatePickerWithRange({ className, date, setDate, onClick, setLoading }: Props) {
  const handleDateConfirm = () => {
    setLoading(true);
    onClick();
  };
  return (
    <div className={cn("grid gap-2 mr-5", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 mr-8 flex md:block" align="start" onBlur={handleDateConfirm}>
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
          <PopoverClose className="PopoverClose p-3 text-right w-full" aria-label="Close">
            <Button onClick={handleDateConfirm}>Confirm</Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
