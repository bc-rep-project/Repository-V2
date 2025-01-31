import React, { useState, useEffect, useCallback } from 'react';
import './styles/App.css'; // App-specific styles
import FileSystemChart from './components/FileSystemChart/FileSystemChart';
import { crawlFileSystem } from './data/crawler/fileCrawler';
import { transformFileSystemData } from './data/dataTransformer';

function App() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rootDirPath] = useState(process.env.PUBLIC_URL);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/filesystem?path=${encodeURIComponent(rootDirPath)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const transformedData = await response.json();
      setChartData(transformedData);
    } catch (err) {
      setError(err);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  }, [rootDirPath]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>File System Visualizer</h1>
        <p>Visualizing: {rootDirPath}</p>
      </header>

      <main className="main-content">
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner" />
            <p>Analyzing file structure...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>Error loading data:</h3>
            <p>{error.message}</p>
            <button onClick={fetchData}>Retry</button>
          </div>
        )}

        {!isLoading && !error && chartData && (
          <FileSystemChart 
            data={chartData.nodes[0]} 
            onNodeSelect={node => console.log('Selected:', node)}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} File System Visualizer</p>
      </footer>
    </div>
  );
}

export default App; 