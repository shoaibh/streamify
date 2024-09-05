import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthNamesBetweenDates(startDate: string | Date, endDate: string | Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = [];

  while (start <= end) {
    const month = monthNames[start.getMonth()];
    const year = start.getFullYear();
    months.push(`${month} ${year}`);

    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
}

export const createDateFromMonthAndDate = (monthYearString: string | undefined, day: number): Date => {
  // Default to "August 2024" if no monthYearString is provided
  if (!monthYearString) {
    monthYearString = "August 2024";
  }

  const [monthName, yearString] = monthYearString.split(" ");
  const year = parseInt(yearString, 10);

  // Create a map of month names to their corresponding month numbers (0-11)
  const monthMap: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Ensure that the month name is valid
  const month = monthMap[monthName];
  if (month === undefined) {
    throw new Error(`Invalid month name: ${monthName}`);
  }

  // Create the Date object
  return new Date(year, month, day);
};

export function getLastMonthDate(date: Date) {
  const lastMonthDate = new Date(date);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  return lastMonthDate;
}

export const updateUrlParams = (params: { [key: string]: string }) => {
  const queryString = new URLSearchParams(params).toString();
  const newUrl = `${window.location.pathname}${queryString && `?${queryString}`}`;

  window.history.pushState({}, "", newUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
