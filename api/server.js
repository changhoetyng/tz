import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON files
const readJsonFile = (filename) => {
  try {
    const filePath = join(__dirname, '..', 'data', filename);
    const fileContent = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error.message);
    return null;
  }
};

// Routes

// Get all datasets
app.get('/api/datasets', (req, res) => {
  res.json({
    datasets: [
      {
        id: 'indonesia-generation-high-resolution',
        name: 'Indonesia Generation - High Resolution',
        description: 'High resolution energy generation data for Indonesia from 2023 to 2050',
        filename: 'indonesia-generation-high-resolution.json',
        years: [2023, 2050],
        energyTypes: [
          'battery', 'bioenergy', 'coal-subcritical', 'coal-supercritical', 
          'coal-ultrasupercritical', 'gas-combined-cycle', 'gas-open-cycle-gas-turbine',
          'geothermal', 'hydro-reservoir-and-run-of-river', 'nuclear',
          'petroleum-products-internal-combustion-engine', 'solar', 'wind-offshore', 'wind-onshore'
        ]
      },
      {
        id: 'indonesia-generation-medium-resolution',
        name: 'Indonesia Generation - Medium Resolution',
        description: 'Medium resolution energy generation data for Indonesia from 2023 to 2050',
        filename: 'indonesia-generation-medium-resolution.json',
        years: [2023, 2050],
        energyTypes: [
          'battery', 'bioenergy', 'coal-subcritical', 'coal-supercritical', 
          'coal-ultrasupercritical', 'gas-combined-cycle', 'gas-open-cycle-gas-turbine',
          'geothermal', 'hydro-reservoir-and-run-of-river', 'nuclear',
          'petroleum-products-internal-combustion-engine', 'solar', 'wind-offshore', 'wind-onshore'
        ]
      }
    ]
  });
});

// Get specific dataset by ID
app.get('/api/datasets/:id', (req, res) => {
  const { id } = req.params;
  
  let filename;
  switch (id) {
    case 'indonesia-generation-high-resolution':
      filename = 'indonesia-generation-high-resolution.json';
      break;
    case 'indonesia-generation-medium-resolution':
      filename = 'indonesia-generation-medium-resolution.json';
      break;
    default:
      return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const data = readJsonFile(filename);
  if (!data) {
    return res.status(500).json({ error: 'Failed to load dataset' });
  }
  
  res.json({
    id,
    data,
    metadata: {
      totalRecords: data.length,
      years: [data[0].x, data[data.length - 1].x],
      energyTypes: Object.keys(data[0]).filter(key => key !== 'x')
    }
  });
});

// Get filtered data by year range
app.get('/api/datasets/:id/filter', (req, res) => {
  const { id } = req.params;
  const { startYear, endYear, energyTypes } = req.query;
  
  let filename;
  switch (id) {
    case 'indonesia-generation-high-resolution':
      filename = 'indonesia-generation-high-resolution.json';
      break;
    case 'indonesia-generation-medium-resolution':
      filename = 'indonesia-generation-medium-resolution.json';
      break;
    default:
      return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const data = readJsonFile(filename);
  if (!data) {
    return res.status(500).json({ error: 'Failed to load dataset' });
  }
  
  // Filter by year range
  let filteredData = data;
  if (startYear || endYear) {
    filteredData = data.filter(item => {
      const year = item.x;
      const start = startYear ? parseInt(startYear) : 2023;
      const end = endYear ? parseInt(endYear) : 2050;
      return year >= start && year <= end;
    });
  }
  
  // Filter by energy types
  if (energyTypes) {
    const types = energyTypes.split(',');
    filteredData = filteredData.map(item => {
      const filtered = { x: item.x };
      types.forEach(type => {
        if (item[type] !== undefined) {
          filtered[type] = item[type];
        }
      });
      return filtered;
    });
  }
  
  res.json({
    id,
    data: filteredData,
    filters: {
      startYear: startYear || 'all',
      endYear: endYear || 'all',
      energyTypes: energyTypes || 'all'
    },
    metadata: {
      totalRecords: filteredData.length,
      years: filteredData.length > 0 ? [filteredData[0].x, filteredData[filteredData.length - 1].x] : []
    }
  });
});

// Get summary statistics for a dataset
app.get('/api/datasets/:id/summary', (req, res) => {
  const { id } = req.params;
  
  let filename;
  switch (id) {
    case 'indonesia-generation-high-resolution':
      filename = 'indonesia-generation-high-resolution.json';
      break;
    case 'indonesia-generation-medium-resolution':
      filename = 'indonesia-generation-medium-resolution.json';
      break;
    default:
      return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const data = readJsonFile(filename);
  if (!data) {
    return res.status(500).json({ error: 'Failed to load dataset' });
  }
  
  // Calculate summary statistics
  const energyTypes = Object.keys(data[0]).filter(key => key !== 'x');
  const summary = {};
  
  energyTypes.forEach(type => {
    const values = data.map(item => item[type]).filter(val => val !== null && val !== undefined);
    if (values.length > 0) {
      summary[type] = {
        min: Math.min(...values),
        max: Math.max(...values),
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        total: values.reduce((sum, val) => sum + val, 0)
      };
    }
  });
  
  res.json({
    id,
    summary,
    metadata: {
      totalRecords: data.length,
      years: [data[0].x, data[data.length - 1].x],
      energyTypes
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Indonesia Energy Generation API',
    version: '1.0.0',
    endpoints: {
      'GET /api/datasets': 'List all available datasets',
      'GET /api/datasets/:id': 'Get specific dataset',
      'GET /api/datasets/:id/filter': 'Get filtered dataset (query params: startYear, endYear, energyTypes)',
      'GET /api/datasets/:id/summary': 'Get dataset summary statistics',
      'GET /api/health': 'Health check'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /api/datasets - List all datasets`);
  console.log(`   GET /api/datasets/:id - Get specific dataset`);
  console.log(`   GET /api/datasets/:id/filter - Get filtered dataset`);
  console.log(`   GET /api/datasets/:id/summary - Get summary statistics`);
  console.log(`   GET /api/health - Health check`);
}); 