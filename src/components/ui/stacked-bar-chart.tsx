import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface StackedBarChartProps
  extends Omit<React.ComponentProps<typeof ChartContainer>, "children"> {
  data: { x: number; [key: string]: number }[];
  keys: string[];
}

export function StackedBarChart({
  data,
  keys,
  className,
  ...props
}: StackedBarChartProps) {
  return (
    <ChartContainer
      className={cn("h-[500px] w-full", className)}
      {...props}
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={2}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend
          content={
            <ChartLegendContent className="grid grid-cols-6 font-normal gap-2 mt-6" />
          }
        />
        {keys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={`var(--color-${key})`}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
