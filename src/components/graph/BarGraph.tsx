import { Bar, BarChart, CartesianGrid, LabelList, Legend, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import Skeleton from "../ui/Skeleton";
import CustomLoader from "../ui/CustomLoader";

type Props = {
  header: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  chartConfig: ChartConfig;
  xAxixKey: string;
  yAxisKey: string;
  isLoading: boolean;
};

export function BarGraph({ header, description, chartData, chartConfig, xAxixKey, yAxisKey, isLoading }: Props) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardDescription>{isLoading ? <Skeleton className="w-full h-4" /> : description}</CardDescription>
      </CardHeader>
      <CardContent className={`${isLoading ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2" : ""}`}>
        {isLoading ? (
          <CustomLoader />
        ) : (
          <ChartContainer config={chartConfig} className={`${chartData?.length <= 0 ? "hidden" : ""}`}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 25,
              }}
              maxBarSize={400}
              height={500}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey={yAxisKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey={xAxixKey} tickSize={5} width={240} tickMargin={5} type="number" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Legend />
              <Bar dataKey={xAxixKey} layout="vertical" width={100} barSize={50} height={100} fill="var(--color-songName)" radius={4}>
                <LabelList dataKey={yAxisKey} position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} />
                <LabelList dataKey={xAxixKey} position="right" offset={8} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
        {!isLoading && chartData?.length <= 0 && <h1 className="my-10">No Top Song Found</h1>}
      </CardContent>
    </Card>
  );
}
