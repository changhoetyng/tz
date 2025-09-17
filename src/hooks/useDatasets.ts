import { useQuery } from '@tanstack/react-query'
import { DatasetResponse, FilteredDatasetResponse, SummaryResponse } from '@/types/api'

const API_BASE_URL = 'http://localhost:3001/api'

// Hook to fetch a specific dataset
export const useDataset = (datasetId: string) => {
  return useQuery<DatasetResponse>({
    queryKey: ['dataset', datasetId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/datasets/${datasetId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset: ${response.statusText}`)
      }
      return response.json()
    },
    enabled: !!datasetId,
  })
}

// Hook to fetch filtered dataset data
export const useFilteredDataset = (
  datasetId: string,
  filters?: {
    startYear?: number
    endYear?: number
    energyTypes?: string[]
  }
) => {
  return useQuery<FilteredDatasetResponse>({
    queryKey: ['dataset', datasetId, 'filtered', filters],
    queryFn: async () => {
      if (!datasetId) {
        throw new Error('Dataset ID is required')
      }
      
      const params = new URLSearchParams()
      
      if (filters?.startYear) params.append('startYear', filters.startYear.toString())
      if (filters?.endYear) params.append('endYear', filters.endYear.toString())
      if (filters?.energyTypes?.length) {
        params.append('energyTypes', filters.energyTypes.join(','))
      }

      const queryString = params.toString()
      const url = `${API_BASE_URL}/datasets/${datasetId}/filter${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch filtered dataset: ${response.statusText}`)
      }
      return response.json()
    },
    enabled: !!datasetId,
  })
}

// Hook to fetch dataset summary
export const useDatasetSummary = (datasetId: string) => {
  return useQuery<SummaryResponse>({
    queryKey: ['dataset', datasetId, 'summary'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/datasets/${datasetId}/summary`)
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset summary: ${response.statusText}`)
      }
      return response.json()
    },
    enabled: !!datasetId,
  })
}

// Specific hook for Indonesia medium resolution data
export const useIndonesiaGenerationData = (
  filters?: {
    startYear?: number
    endYear?: number
    energyTypes?: string[]
  }
) => {
  return useFilteredDataset('indonesia-generation-medium-resolution', filters)
}

// Hook to fetch multiple datasets for comparison
export const useMultipleDatasets = (
  datasetIds: string[],
  filters?: {
    startYear?: number
    endYear?: number
    energyTypes?: string[]
  }
) => {
  // Always call hooks for both possible datasets to avoid conditional hooks
  const dataset1 = useFilteredDataset(datasetIds[0] || '', filters);
  const dataset2 = useFilteredDataset(datasetIds[1] || '', filters);

  const results = [];
  
  if (datasetIds[0]) {
    results.push({ id: datasetIds[0], ...dataset1 });
  }
  
  if (datasetIds[1]) {
    results.push({ id: datasetIds[1], ...dataset2 });
  }

  return {
    datasets: results,
    isLoading: (datasetIds[0] ? dataset1.isLoading : false) || (datasetIds[1] ? dataset2.isLoading : false),
    isError: (datasetIds[0] ? dataset1.isError : false) || (datasetIds[1] ? dataset2.isError : false),
    error: (datasetIds[0] ? dataset1.error : null) || (datasetIds[1] ? dataset2.error : null)
  };
};
