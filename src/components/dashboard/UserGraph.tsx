import { LineGraph } from "../graph/LineGraph";
import { ChartConfig } from "../ui/chart";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserGraph = ({ userGraphData, isLoading }: { userGraphData: any; isLoading: boolean }) => {
  return (
    <LineGraph
      header="Users Growth"
      description={`Users growth from ${userGraphData?.[0]?.month} to ${userGraphData?.[userGraphData?.length - 1]?.month}`}
      chartConfig={chartConfig}
      chartData={userGraphData}
      xAxixKey="month"
      yAxisKey="totalUsers"
      yAxisKey2="activeUsers"
      isLoading={isLoading}
    />
  );
};
