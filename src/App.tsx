import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { chartConfig, chartKeys } from "@/constants";
import { StackedBarChart } from "@/components/ui/stacked-bar-chart";
import { useIndonesiaGenerationData } from "@/hooks/useDatasets";

export default function App() {
  const { data: queryResult, isLoading, isError, error } = useIndonesiaGenerationData({startYear: 2023, endYear: 2025});

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

  const data = queryResult?.data || [];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <Card className="w-full shadow-none rounded-md">
        <CardHeader>
          <CardTitle>Generation</CardTitle>
          <CardDescription>
          {queryResult?.metadata && (
            <span className="block mt-1">
              Electricity generation by technology from {queryResult.metadata.years[0]} to {queryResult.metadata.years[1]}
            </span>
          )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={data}
            keys={chartKeys}
            config={chartConfig}
          />
        </CardContent>
        <CardFooter className="text-xs text-center text-muted-foreground">
          {queryResult?.metadata && (
            <span className="block mt-1">
              Data shows projected energy generation mix evolution {queryResult.metadata.years[0]}-{queryResult.metadata.years[1]}
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
