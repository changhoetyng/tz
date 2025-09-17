import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chartConfig, chartKeys } from "@/constants";
import { StackedBarChart } from "@/components/ui/stacked-bar-chart";
import { useMultipleDatasets } from "@/hooks/useDatasets";
import { getDefaultDataset, getDatasetById, getAvailableComparisons } from "@/config/datasets";

export default function App() {
  const defaultDataset = getDefaultDataset();
  const [comparisonDatasetId, setComparisonDatasetId] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hiddenTechnologies, setHiddenTechnologies] = useState<Set<string>>(new Set());
  
  // Build the list of datasets to fetch
  const datasetsToFetch = comparisonDatasetId 
    ? [defaultDataset.id, comparisonDatasetId]
    : [defaultDataset.id];
  
  // Fetch datasets
  const { datasets, isLoading, isError, error } = useMultipleDatasets(
    datasetsToFetch,
    { startYear: 2023, endYear: 2025 }
  );

  const availableComparisons = getAvailableComparisons(defaultDataset.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center container mx-auto">
        <Card className="w-full shadow-none rounded-md">
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading generation data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center container mx-auto">
        <Card className="w-full shadow-none rounded-md">
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading data</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Something went wrong. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the datasets data
  const defaultDatasetResult = datasets.find(d => d.id === defaultDataset.id);
  const comparisonDatasetResult = comparisonDatasetId 
    ? datasets.find(d => d.id === comparisonDatasetId) 
    : null;

  const defaultData = defaultDatasetResult?.data?.data || [];
  const comparisonData = comparisonDatasetResult?.data?.data || [];

  // Note: We don't filter keys anymore, we use hiddenTechnologies to control visibility

  // Handle legend click to toggle technology visibility
  const handleLegendClick = (dataKey: string) => {
    setHiddenTechnologies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center container mx-auto p-4">
      {/* Dropdown for comparison selection */}
      <div className="w-full mb-6">
        <div className="flex justify-start">
          <Select 
            value={comparisonDatasetId || "none"} 
            onValueChange={(value) => setComparisonDatasetId(value === "none" ? null : value)}
          >
            <SelectTrigger className="w-fit min-w-[200px] bg-transparent border-0 shadow-none px-0 text-gray-600 hover:text-gray-800 focus:ring-0">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23.2222 19.8267V12.5556C23.2222 10.5911 21.6311 9 19.6667 9C17.7022 9 16.1111 10.5911 16.1111 12.5556V21.4444C16.1111 22.4222 15.3111 23.2222 14.3333 23.2222C13.3556 23.2222 12.5556 22.4222 12.5556 21.4444V14.1733C13.5867 13.8 14.3333 12.8222 14.3333 11.6667C14.3333 10.1911 13.1422 9 11.6667 9C10.1911 9 9 10.1911 9 11.6667C9 12.8222 9.74667 13.8 10.7778 14.1733V21.4444C10.7778 23.4089 12.3689 25 14.3333 25C16.2978 25 17.8889 23.4089 17.8889 21.4444V12.5556C17.8889 11.5778 18.6889 10.7778 19.6667 10.7778C20.6444 10.7778 21.4444 11.5778 21.4444 12.5556V19.8267C20.4133 20.1911 19.6667 21.1689 19.6667 22.3333C19.6667 23.8089 20.8578 25 22.3333 25C23.8089 25 25 23.8089 25 22.3333C25 21.1778 24.2533 20.2 23.2222 19.8267ZM11.6667 12.5556C11.1778 12.5556 10.7778 12.1556 10.7778 11.6667C10.7778 11.1778 11.1778 10.7778 11.6667 10.7778C12.1556 10.7778 12.5556 11.1778 12.5556 11.6667C12.5556 12.1556 12.1556 12.5556 11.6667 12.5556ZM22.3333 23.2222C21.8444 23.2222 21.4444 22.8222 21.4444 22.3333C21.4444 21.8444 21.8444 21.4444 22.3333 21.4444C22.8222 21.4444 23.2222 21.8444 23.2222 22.3333C23.2222 22.8222 22.8222 23.2222 22.3333 23.2222Z"
                    fill="currentColor" />
                </svg>
                <SelectValue placeholder="Compare scenario" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Compare scenario</SelectItem>
              {availableComparisons.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts */}
      <div className={`w-full grid gap-6 ${comparisonDatasetId ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Default Dataset Chart - Always shown */}
        <Card className="shadow-none rounded-md">
          <CardHeader>
          <CardTitle>Total Operating Capacity by Technology</CardTitle>
            <CardDescription>
              Total Operating Capacity by Technology for <strong>{defaultDataset.name}</strong>
            </CardDescription>
            
            {/* <CardDescription>
              {defaultDatasetResult?.data?.metadata && (
                <span className="block mt-1">
                  Electricity generation by technology from {defaultDatasetResult.data.metadata.years[0]} to {defaultDatasetResult.data.metadata.years[1]}
                </span>
              )}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <StackedBarChart
              data={defaultData}
              keys={chartKeys}
              config={chartConfig}
              syncedHoverIndex={hoveredIndex}
              onHoverChange={setHoveredIndex}
              comparisonData={comparisonDatasetId ? comparisonData : undefined}
              chartTitle={defaultDataset.name}
              onLegendClick={handleLegendClick}
              hiddenTechnologies={hiddenTechnologies}
            />
          </CardContent>
        </Card>

        {/* Comparison Chart - Only shown when comparison is selected */}
        {comparisonDatasetId && comparisonDatasetResult && (
          <Card className="shadow-none rounded-md">
            <CardHeader>
            <CardTitle>Total Operating Capacity by Technology</CardTitle>
            <CardDescription>Total Operating Capacity by Technology for <strong>{getDatasetById(comparisonDatasetId)?.name}</strong></CardDescription>
            
              {/* <CardTitle>Generation - {getDatasetById(comparisonDatasetId)?.name}</CardTitle> */}
              {/* <CardDescription>
                {comparisonDatasetResult.data?.metadata && (
                  <span className="block mt-1">
                    Electricity generation by technology from 2023 to 2025
                  </span>
                )}
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={comparisonData}
                keys={chartKeys}
                config={chartConfig}
                syncedHoverIndex={hoveredIndex}
                onHoverChange={setHoveredIndex}
                comparisonData={defaultData}
                chartTitle={getDatasetById(comparisonDatasetId)?.name}
                onLegendClick={handleLegendClick}
                hiddenTechnologies={hiddenTechnologies}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shared Legend - always shown */}
      <div className="mt-6 flex justify-center">
        <div className="grid grid-cols-6 font-normal gap-2">
          {chartKeys.map((key) => {
            const isHidden = hiddenTechnologies?.has(key);
            const itemConfig = chartConfig[key];
            
            return (
              <button
                key={key}
                className={`flex items-center gap-2 text-xs transition-all duration-200 hover:opacity-80 cursor-pointer p-1 rounded ${
                  isHidden ? "opacity-40" : "opacity-100"
                }`}
                onClick={() => handleLegendClick(key)}
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ 
                    backgroundColor: isHidden ? '#d1d5db' : (itemConfig?.color)
                  }}
                />
                <span className={`text-muted-foreground truncate ${
                  isHidden ? "line-through text-gray-400" : ""
                }`}>
                  {itemConfig?.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
