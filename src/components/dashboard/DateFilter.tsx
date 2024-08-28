import { useDataContext } from "@/context/DataContext";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../ui/DatePicker";

export const DateFilter = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    to: new Date(),
  });

  const { setFromDate, setToDate } = useDataContext();

  console.log({ date });

  const onClick = () => {
    setFromDate(date.from);
    setToDate(date.to);
  };

  return <DatePickerWithRange date={date} setDate={setDate} onClick={onClick} />;
};
