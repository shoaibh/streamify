import { useDataContext } from "@/context/DataContext";
import { monthNames } from "@/lib/utils";
import { BarGraph } from "../graph/BarGraph";
import { ChartConfig } from "../ui/chart";

const chartBarConfig = {
  songName: {
    label: "Song Name",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SongGraph = ({ songChartData, isLoading }: { songChartData: any; isLoading: boolean }) => {
  const { fromDate, toDate } = useDataContext();

  return (
    <BarGraph
      header="Top 5 stream songs"
      description={`Top songs streamed from ${monthNames[fromDate?.getMonth()]} to ${monthNames[toDate?.getMonth()]}`}
      chartConfig={chartBarConfig}
      chartData={songChartData}
      xAxixKey="streams"
      yAxisKey="songName"
      isLoading={isLoading}
    />
  );
};
