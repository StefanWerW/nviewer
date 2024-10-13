import { useListenerHistory } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type MemoryInfoEvent = {
  total: number;
  used: number;
};

export const MemoryChart = () => {
  const points = useListenerHistory<MemoryInfoEvent, MemoryInfoEvent>({
    event: "memory",
    maxPoints: 60,
    mapToHistory: (event) => ({
      total: Math.floor(event.total / 1024 / 1024),
      used: Math.floor(event.used / 1024 / 1024),
    }),
  });

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={points}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />

        <YAxis yAxisId="left" domain={[0, "auto"]} />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />

        <Area
          yAxisId="left"
          dataKey="total"
          type="basis"
          isAnimationActive={false}
          fill="var(--color-total)"
          fillOpacity={0.4}
          stroke="var(--color-total)"
          stackId="b"
        />
        <Area
          yAxisId="left"
          dataKey="used"
          type="basis"
          isAnimationActive={false}
          fill="var(--color-used)"
          fillOpacity={0.4}
          stroke="var(--color-used)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
