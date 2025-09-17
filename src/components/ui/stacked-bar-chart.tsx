import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Custom tooltip component that can show comparison data
const CustomTooltip = ({ active, payload, label, config, comparisonData, chartTitle }: any) => {
  
  if (!active || !payload?.length) {
    return null;
  }

  // Calculate total MW
  const total = payload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
  
  // Format number with K suffix for thousands
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K MW`;
    }
    return `${Math.round(value)} MW`;
  };

  // Sort payload by value (descending) to match your design
  const sortedPayload = [...payload]
    .filter((item: any) => item.value > 0) // Only show non-zero values
    .sort((a: any, b: any) => b.value - a.value);

  // Find comparison data for the same year if available
  const comparisonDataPoint = comparisonData?.find((d: any) => d.x === label);
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px]">
      {/* Header with year and total */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-800">{label}</span>
        <span className="text-lg font-semibold text-gray-600">{formatValue(total)}</span>
      </div>
      
      {chartTitle && (
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {chartTitle}
          </span>
        </div>
      )}
      
      {/* Technology list */}
      <div className="space-y-2">
        {sortedPayload.map((item: any) => {
          const itemConfig = config[item.dataKey as keyof typeof config];
          const color = itemConfig?.color || item.color;
          const comparisonValue = comparisonDataPoint?.[item.dataKey] || 0;
          
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
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-600">
                  {formatValue(item.value)}
                </span>
                {comparisonData && comparisonValue > 0 && (
                  <span className="text-xs text-gray-400">
                    vs {formatValue(comparisonValue)}
                  </span>
                )}
              </div>
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
  syncedHoverIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  comparisonData?: { x: number; [key: string]: number }[];
  chartTitle?: string;
}

export function StackedBarChart({
  data,
  keys,
  className,
  config,
  syncedHoverIndex,
  onHoverChange,
  comparisonData,
  chartTitle,
  ...props
}: StackedBarChartProps) {
  return (
    <ChartContainer
      className={cn("h-[500px] w-full", className)}
      config={config}
      {...props}
    >
      <BarChart 
        data={data}
        onMouseMove={(state) => {
          if (state?.activeTooltipIndex !== undefined && onHoverChange) {
            onHoverChange(state.activeTooltipIndex);
          }
        }}
        onMouseLeave={() => {
          if (onHoverChange) {
            onHoverChange(null);
          }
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={2}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<CustomTooltip config={config} comparisonData={comparisonData} chartTitle={chartTitle} />} />
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
