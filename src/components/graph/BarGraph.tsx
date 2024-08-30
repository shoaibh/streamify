import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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
};

export function BarGraph({ header, description, chartData, chartConfig, xAxixKey, yAxisKey }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
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
            <Bar dataKey={xAxixKey} layout="vertical" width={5000} barSize={400} height={400} fill="var(--color-songName)" radius={4}>
              <LabelList dataKey={yAxisKey} position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} />
              <LabelList dataKey={xAxixKey} position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
