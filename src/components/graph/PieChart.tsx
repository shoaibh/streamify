import { Label, Legend, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MouseEventHandler } from "react";
import Skeleton from "../ui/Skeleton";
import CustomLoader from "../ui/CustomLoader";

type Props = {
  header: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  chartConfig: ChartConfig;
  dataKey: string;
  nameKey: string;
  activeIndex: number;
  total: number;
  isLoading: boolean;
  onClick: (e: MouseEventHandler) => void;
};

export function CustomPieChart({
  header,
  description,
  chartData,
  chartConfig,
  dataKey,
  nameKey,
  activeIndex,
  onClick,
  total,
  isLoading,
}: Props) {
  const id = "pie-interactive";

  const NoRevenue = !isLoading && chartData?.length <= 0 && <h1 className="my-10">No Revenue Data Found</h1>;

  return (
    <Card data-chart={id} className="relative">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader>
        <div className="grid gap-1">
          <CardTitle>{header}</CardTitle>
          <CardDescription>{isLoading ? <Skeleton className="w-full mt-3 h-4" /> : description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={`${
          isLoading ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2" : "flex flex-1 justify-center px-5 pb-0"
        }`}
      >
        {isLoading ? (
          <CustomLoader />
        ) : (
          <ChartContainer id={id} config={chartConfig} className={`${chartData?.length <= 0 ? "hidden" : ""} mx-auto aspect-square w-full`}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Legend
                layout="vertical"
                align="center"
                verticalAlign="bottom"
                formatter={(value, entry) => {
                  const { payload } = entry;
                  return `${value}: $ ${payload?.value?.toFixed(2)}`; // Display name and value in the legend
                }}
              />
              <Pie
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={60}
                // outerRadius={120}
                strokeWidth={2}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 5} />
                    <Sector {...props} outerRadius={outerRadius + 10} innerRadius={outerRadius + 5} />
                  </g>
                )}
                className="cursor-pointer"
                onClick={onClick}
                // label={(nameKey) => nameKey.name}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Total $
                          </tspan>
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                            {chartData[activeIndex]?.dataKey?.toLocaleString() || total}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        {NoRevenue}
      </CardContent>

      {!isLoading && chartData?.length > 0 && (
        <CardFooter className="flex-col gap-2 mt-4 text-[clamp(0.75rem,2vw+0.5rem,1rem)]">
          <div className="flex items-center gap-2 font-medium leading-none">Select a Pie section to filter the data table</div>
        </CardFooter>
      )}
    </Card>
  );
}
