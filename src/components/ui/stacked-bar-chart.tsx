import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Custom tooltip component matching your design
const CustomTooltip = ({ active, payload, label, config }: any) => {
  
  if (!active || !payload?.length) {
    return null;
  }

  // Calculate total MW
  const total = payload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
  
  // Format number with K suffix for thousands
  const formatValue = (value: number) => {
    return `${Math.round(value)} MW`;
  };

  // Sort payload by value (descending) to match your design
  const sortedPayload = [...payload]
    .filter((item: any) => item.value > 0) // Only show non-zero values
    .sort((a: any, b: any) => b.value - a.value);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
      {/* Header with year and total */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-800">{label}</span>
        <span className="text-lg font-semibold text-gray-600">{formatValue(total)}</span>
      </div>
      
      {/* Technology list */}
      <div className="space-y-2">
        {sortedPayload.map((item: any) => {
          const itemConfig = config[item.dataKey as keyof typeof config];
          const color = itemConfig?.color || item.color;
          
          return (
            <div key={item.dataKey} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {itemConfig?.label || item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-600">
                {formatValue(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface StackedBarChartProps
  extends Omit<React.ComponentProps<typeof ChartContainer>, "children"> {
  data: { x: number; [key: string]: number }[];
  keys: string[];
  config: any;
}

export function StackedBarChart({
  data,
  keys,
  className,
  config,
  ...props
}: StackedBarChartProps) {
  return (
    <ChartContainer
      className={cn("h-[500px] w-full", className)}
      config={config}
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
        <ChartTooltip content={<CustomTooltip config={config} />} />
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
