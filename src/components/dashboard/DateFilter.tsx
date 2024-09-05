import { useDataContext } from "@/context/DataContext";
import { DatePickerWithRange } from "../ui/DatePicker";

export const DateFilter = () => {
  const { setFromDate, fromDate, toDate, setToDate } = useDataContext();

  return (
    <div className="flex gap-3 justify-end">
      <DatePickerWithRange value={fromDate} onChange={setFromDate} label="From" />
      <DatePickerWithRange value={toDate} onChange={setToDate} label="To" />
    </div>
  );
};
