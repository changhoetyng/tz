import data from "../data/indonesia-generation-medium-resolution.json";
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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <Card className="w-full shadow-none rounded-md">
        <CardHeader>
          <CardTitle>Generation</CardTitle>
          <CardDescription>
            Electricity generation by technology from 2023 to 2050
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
          Data shows projected energy generation mix evolution from 2023 to 2050
        </CardFooter>
      </Card>
    </div>
  );
}
