export interface Dataset {
  id: string;
  name: string;
  description: string;
  filename: string;
  years: [number, number];
  energyTypes: string[];
}

export interface DatasetResponse {
  id: string;
  data: any[];
  metadata: {
    totalRecords: number;
    years: [number, number];
    energyTypes: string[];
  };
}

export interface FilteredDatasetResponse extends DatasetResponse {
  filters: {
    startYear: string | "all";
    endYear: string | "all";
    energyTypes: string | "all";
  };
}

export interface SummaryResponse {
  id: string;
  summary: Record<
    string,
    {
      min: number;
      max: number;
      average: number;
      total: number;
    }
  >;
  metadata: {
    totalRecords: number;
    years: [number, number];
    energyTypes: string[];
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
} 