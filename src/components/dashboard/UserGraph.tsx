import { useDataContext } from "@/context/DataContext";
import { LineGraph } from "../graph/LineGraph";
import { ChartConfig } from "../ui/chart";
import { createDateFromMonthAndDate, getMonthNamesBetweenDates, monthNames } from "@/lib/utils";
import { useMemo } from "react";

const chartConfig = {
  totalUsers: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const UserGraph = () => {
  const { fromDate, toDate, data } = useDataContext();

  const chartData = useMemo(() => {
    const months = getMonthNamesBetweenDates(fromDate, toDate);

    const result = [];

    if (months.length <= 1) {
      months.unshift(monthNames[fromDate.getMonth() - 1]);
    }

    months.forEach((month) => {
      const thatDate = createDateFromMonthAndDate(month, new Date(fromDate).getDate());
      const totalUsersThatMonth = data.users.filter((user) => {
        const dateJoined = new Date(user.date_joined);
        return dateJoined <= thatDate;
      }).length;

      const activeUsersThatMonth = data.users.filter((user) => {
        const dateJoined = new Date(user.last_song_streamed);
        return dateJoined <= thatDate;
      }).length;
      result.push({ month, totalUsers: totalUsersThatMonth, activeUsers: activeUsersThatMonth });
    });

    return result;
  }, [data.users, fromDate, toDate]);

  return (
    <LineGraph
      header="Users Growth"
      description={`Users growth from ${chartData?.[0].month} to ${chartData?.[chartData?.length - 1].month}`}
      chartConfig={chartConfig}
      chartData={chartData}
      xAxixKey="month"
      yAxisKey="totalUsers"
      yAxisKey2="activeUsers"
    />
  );
};
