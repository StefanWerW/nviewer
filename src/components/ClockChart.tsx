import { useListenerHistory } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";

type ClockEvent = number;

export const ClockChart = ({
  event,
}: {
  event:
    | "clockInfoGraphics"
    | "clockInfoSm"
    | "clockInfoMemory"
    | "clockInfoVideo";
}) => {
  const chartConfig = {
    clock: {
      label: `Clock ${event}`,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const points = useListenerHistory<ClockEvent, { clock: number }>({
    event,
    maxPoints: 60,
    mapToHistory: (event) => ({ clock: event }),
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
          dataKey="clock"
          type="basis"
          isAnimationActive={false}
          fill="var(--color-clock)"
          fillOpacity={0.4}
          stroke="var(--color-clock)"
          stackId="b"
        />
      </AreaChart>
    </ChartContainer>
  );
};
