"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
  header: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  chartConfig: ChartConfig;
  xAxixKey: string;
  yAxisKey: string;
  yAxisKey2: string;
};

export function LineGraph({ header, description, chartData, chartConfig, xAxixKey, yAxisKey, yAxisKey2 }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xAxixKey} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey={yAxisKey} label={yAxisKey} type="linear" stroke="var(--color-totalUsers)" strokeWidth={2} dot={false} />
            <Line dataKey={yAxisKey2} label={yAxisKey2} type="linear" stroke="var(--color-activeUsers)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
