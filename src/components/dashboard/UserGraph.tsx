import { useDataContext } from "@/context/DataContext";
import { LineGraph } from "../graph/LineGraph";
import { ChartConfig } from "../ui/chart";
import { createDateFromMonthAndDate, getLastMonthDate, getMonthNamesBetweenDates, monthNames } from "@/lib/utils";
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
    if (!data?.users) {
      return [];
    }
    const months = getMonthNamesBetweenDates(fromDate, toDate);

    const result: Array<{ month: string; totalUsers: number; activeUsers: number }> = [];

    if (months.length <= 1) {
      months.unshift(monthNames[fromDate.getMonth() - 1]);
    }

    months.forEach((month) => {
      const thatDate = createDateFromMonthAndDate(month, new Date(fromDate).getDate());
      const lastMonthDate = getLastMonthDate(thatDate);

      const totalUsersThatMonth = data?.users.filter((user) => {
        const dateJoined = new Date(user.date_joined);
        return dateJoined <= thatDate;
      }).length;

      const activeUsersThatMonth = data?.users.filter((user) => {
        const dateJoined = new Date(user.last_song_streamed);
        return dateJoined <= thatDate && dateJoined >= lastMonthDate;
      }).length;
      result.push({ month, totalUsers: totalUsersThatMonth, activeUsers: activeUsersThatMonth });
    });

    return result;
  }, [data?.users, fromDate, toDate]);

  return (
    <LineGraph
      header="Users Growth"
      description={`Users growth from ${chartData?.[0]?.month} to ${chartData?.[chartData?.length - 1]?.month}`}
      chartConfig={chartConfig}
      chartData={chartData}
      xAxixKey="month"
      yAxisKey="totalUsers"
      yAxisKey2="activeUsers"
    />
  );
};
