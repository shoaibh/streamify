import { useMemo, useState } from "react";
import { CustomPieChart } from "../graph/PieChart";
import { ChartConfig } from "../ui/chart";
import { useDataContext } from "@/context/DataContext";

const desktopData = [
  { source: "subscriptions", revenue: 186, fill: "var(--color-subscriptions)" },
  { source: "ads", revenue: 305, fill: "var(--color-ads)" },
];

const pieChartConfig = {
  subscriptions: {
    label: "Subscriptions",
    color: "hsl(var(--chart-1))",
  },
  ads: {
    label: "ads",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RevenueGraph = ({ pieChartData }: { pieChartData: any }) => {
  const [activeMonth, setActiveMonth] = useState("");
  const activeIndex = useMemo(() => desktopData.findIndex((item) => item.source === activeMonth), [activeMonth]);

  const { setRevenueSource } = useDataContext();

  const { chartData, totalRevenue } = useMemo(() => {
    if (!pieChartData) {
      return { totalRevenue: 0 };
    }

    const chartData = [
      { source: "subscriptions", revenue: pieChartData.subsRevenue, fill: "var(--color-subscriptions)" },
      { source: "ads", revenue: pieChartData.adsRevenue, fill: "var(--color-ads)" },
    ];
    return {
      chartData,
      totalRevenue: Number(pieChartData.totalRevenue),
    };
  }, [pieChartData]);

  const onClickPieSection = (section: string) => {
    if (section === activeMonth) {
      setActiveMonth("");
      setRevenueSource("");
      return;
    }
    setActiveMonth(section);
    setRevenueSource(section);
  };

  return (
    <CustomPieChart
      header="Revenue"
      description="chart showing revenue distribution"
      chartData={chartData || []}
      dataKey="revenue"
      nameKey="source"
      chartConfig={pieChartConfig}
      activeIndex={activeIndex}
      onClick={(e) => onClickPieSection(e.name)}
      total={totalRevenue}
    />
  );
};
