"use client";

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CustomLoader from "../ui/CustomLoader";
import Skeleton from "../ui/Skeleton";

type Props = {
  header: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  chartConfig: ChartConfig;
  xAxixKey: string;
  yAxisKey: string;
  yAxisKey2: string;
  isLoading: boolean;
};

export function LineGraph({ header, description, chartData, chartConfig, xAxixKey, yAxisKey, yAxisKey2, isLoading }: Props) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-[clamp(1rem,2vw+0.5rem,1.5rem)]">{header}</CardTitle>
        <CardDescription>{isLoading ? <Skeleton className="w-full h-4" /> : description}</CardDescription>
      </CardHeader>
      <CardContent className={`${isLoading ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2" : ""}`}>
        {isLoading ? (
          <CustomLoader />
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxixKey}
                tickLine={true}
                axisLine={true}
                tickMargin={12}
                tickFormatter={(value) => value.slice(0, 3)}
              ></XAxis>
              <YAxis dx={-15}></YAxis>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Legend layout="horizontal" align="right" verticalAlign="top" />
              <Line dataKey={yAxisKey} label={yAxisKey} type="linear" stroke="var(--color-totalUsers)" strokeWidth={2} dot={false} />
              <Line dataKey={yAxisKey2} label={yAxisKey2} type="linear" stroke="var(--color-activeUsers)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
