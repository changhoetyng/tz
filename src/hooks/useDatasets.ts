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
