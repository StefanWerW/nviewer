import { useListenerHistory } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type TemperatureInfoEvent = number;

export const TemperatureChart = () => {
  const points = useListenerHistory<
    TemperatureInfoEvent,
    { temperature: number }
  >({
    event: "temperature",
    maxPoints: 60,
    mapToHistory: (event) => ({ temperature: event }),
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
          dataKey="temperature"
          type="basis"
          isAnimationActive={false}
          fill="var(--color-temperature)"
          fillOpacity={0.4}
          stroke="var(--color-temperature)"
          stackId="b"
        />
      </AreaChart>
    </ChartContainer>
  );
};
