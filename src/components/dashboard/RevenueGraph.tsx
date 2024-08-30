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

export const RevenueGraph = () => {
  const [activeMonth, setActiveMonth] = useState("");
  const activeIndex = useMemo(() => desktopData.findIndex((item) => item.source === activeMonth), [activeMonth]);

  const { data, fromDate, toDate, setRevenueSource } = useDataContext();

  const { chartData, totalRevenue } = useMemo(() => {
    if (!data?.revenue) {
      return { totalRevenue: 0 };
    }

    const revenueBetweenDates = data?.revenue.filter((r) => new Date(r.revenue_date) <= toDate && new Date(r.revenue_date) >= fromDate);

    const totalRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0).toFixed(2);
    const subsRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.subscription_revenue, 0);
    const adsRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.ad_revenue, 0);

    const chartData = [
      { source: "subscriptions", revenue: subsRevenue, fill: "var(--color-subscriptions)" },
      { source: "ads", revenue: adsRevenue, fill: "var(--color-ads)" },
    ];
    return {
      chartData,
      totalRevenue: Number(totalRevenue),
    };
  }, [data?.revenue, fromDate, toDate]);

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
      chartData={chartData}
      dataKey="revenue"
      nameKey="source"
      chartConfig={pieChartConfig}
      activeIndex={activeIndex}
      onClick={(e) => onClickPieSection(e.name)}
      total={totalRevenue}
    />
  );
};
