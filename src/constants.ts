import { ChartConfig } from "./components/ui/chart";

export const chartConfig: ChartConfig = {
  "coal-subcritical": {
    label: "Coal Subcritical",
    color: "#8B4513",
  },
  "coal-supercritical": {
    label: "Coal Supercritical",
    color: "#A0522D",
  },
  "coal-ultrasupercritical": {
    label: "Coal Ultrasupercritical",
    color: "#CD853F",
  },
  "gas-combined-cycle": {
    label: "Gas Combined Cycle",
    color: "#FF6B6B",
  },
  "gas-open-cycle-gas-turbine": {
    label: "Gas Open Cycle",
    color: "#FF8E8E",
  },
  geothermal: {
    label: "Geothermal",
    color: "#4ECDC4",
  },
  "hydro-reservoir-and-run-of-river": {
    label: "Hydro",
    color: "#45B7D1",
  },
  solar: {
    label: "Solar",
    color: "#FFD93D",
  },
  "wind-onshore": {
    label: "Wind Onshore",
    color: "#6BCF7F",
  },
  "wind-offshore": {
    label: "Wind Offshore",
    color: "#4CAF50",
  },
  nuclear: {
    label: "Nuclear",
    color: "#FF6B9D",
  },
  bioenergy: {
    label: "Bioenergy",
    color: "#8FBC8F",
  },
  battery: {
    label: "Battery",
    color: "#DDA0DD",
  },
  "petroleum-products-internal-combustion-engine": {
    label: "Petroleum",
    color: "#F4A460",
  },
};

export const chartKeys: (keyof typeof chartConfig)[] = [
  "coal-subcritical",
  "coal-supercritical",
  "coal-ultrasupercritical",
  "gas-combined-cycle",
  "gas-open-cycle-gas-turbine",
  "geothermal",
  "hydro-reservoir-and-run-of-river",
  "solar",
  "wind-onshore",
  "wind-offshore",
  "nuclear",
  "bioenergy",
  "battery",
  "petroleum-products-internal-combustion-engine",
];
