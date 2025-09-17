export interface DatasetConfig {
  id: string;
  name: string;
}

export const DATASETS_CONFIG: DatasetConfig[] = [
  {
    id: 'indonesia-generation-medium-resolution',
    name: 'Indonesia Generation - Medium Resolution',
  },
  {
    id: 'indonesia-generation-high-resolution',
    name: 'Indonesia Generation - High Resolution', 
  }
];

export const getDefaultDataset = (): DatasetConfig => {
  return DATASETS_CONFIG[0];
};

export const getDatasetById = (id: string): DatasetConfig | undefined => {
  return DATASETS_CONFIG.find(d => d.id === id);
};

export const getAvailableComparisons = (currentDatasetId: string): DatasetConfig[] => {
  return DATASETS_CONFIG.filter(d => d.id !== currentDatasetId);
};
