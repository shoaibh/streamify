"use client";

import * as React from "react";

import { Calendar } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "./date-picker-custom.css";

type Props = {
  label?: string;
  value: Date;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export function DatePickerWithRange({ label, value, onChange }: Props) {
  const handleDateChange = (value: Value) => {
    if (value) {
      onChange(value as Date);
    }
  };

  return (
    <div className="relative">
      <div className="text-start text-xs text-gray-500">{label}</div>
      <DatePicker
        className="date-picker border-gray-300"
        onChange={handleDateChange}
        value={value}
        calendarIcon={<Calendar />}
        clearIcon={null}
      />
    </div>
  );
}
