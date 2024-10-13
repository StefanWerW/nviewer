"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useListenerValue } from "@/lib/utils";

const chartConfig = {
  used: {
    label: "Used",
    color: "hsl(var(--chart-1))",
  },
  unused: {
    label: "Unused",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FanChart() {
  const fanPercent = useListenerValue<number, number>({
    event: "fanSpeed",
    initValue: 0,
    mapToValue: (event) => event,
  });
  const chartData = [{ used: fanPercent, unused: 100 - fanPercent }];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {fanPercent}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      speed
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>

        <RadialBar
          dataKey="unused"
          fill="var(--color-unused)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="used"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-used)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
