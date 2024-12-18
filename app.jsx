// Import necessary libraries
import React, { useState } from "react";
import "./App.css";

function App() {
  const [provider, setProvider] = useState("AWS");
  const [os, setOs] = useState("Linux");
  const [db, setDb] = useState("None");
  const [cpu, setCpu] = useState(2);
  const [memory, setMemory] = useState(4);
  const [storageType, setStorageType] = useState("SSD");
  const [storageSize, setStorageSize] = useState(50);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // Simulated calculation logic (API integration comes later)
    const baseCost = 100; // Example base cost
    const storageCost = storageSize * (storageType === "SSD" ? 0.2 : 0.1);
    const total = (baseCost + storageCost) * 1.3; // Adding 30% markup

    setResult({
      baseCost: baseCost.toFixed(2),
      storageCost: storageCost.toFixed(2),
      total: total.toFixed(2),
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MPI Cloud Cost Calculator</h1>
      </header>

      <main>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Cloud Provider:</label>
            <select value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
            </select>
          </div>

          <div>
            <label>Operating System:</label>
            <select value={os} onChange={(e) => setOs(e.target.value)}>
              <option value="Linux">Linux</option>
              <option value="Windows">Windows</option>
            </select>
          </div>

          <div>
            <label>Database:</label>
            <select value={db} onChange={(e) => setDb(e.target.value)}>
              <option value="None">None</option>
              <option value="SQL">SQL</option>
              <option value="Oracle">Oracle</option>
            </select>
          </div>

          <div>
            <label>CPU (Cores):</label>
            <input
              type="number"
              value={cpu}
              onChange={(e) => setCpu(parseInt(e.target.value))}
              min="1"
            />
          </div>

          <div>
            <label>Memory (GB):</label>
            <input
              type="number"
              value={memory}
              onChange={(e) => setMemory(parseInt(e.target.value))}
              min="1"
            />
          </div>

          <div>
            <label>Storage Type:</label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
            >
              <option value="SSD">SSD</option>
              <option value="HDD">HDD</option>
            </select>
          </div>

          <div>
            <label>Storage Size (GB):</label>
            <input
              type="number"
              value={storageSize}
              onChange={(e) => setStorageSize(parseInt(e.target.value))}
              min="1"
            />
          </div>

          <button type="button" onClick={handleCalculate}>
            Calculate
          </button>
        </form>

        {result && (
          <div className="results">
            <h2>Results:</h2>
            <p>Base Cost: ${result.baseCost}</p>
            <p>Storage Cost: ${result.storageCost}</p>
            <p>Total Cost (with markup): ${result.total}</p>
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2024 MPI Calculator</p>
      </footer>
    </div>
  );
}

export default App;
