import React, { useState, useEffect } from 'react';

// Real-world threat vectors to prove dynamic AI processing
const THREAT_SCENARIOS = {
  db_crash: "FATAL EXCEPTION: connection to primary database system lost at db-cluster-main. Timeout after 30000ms. STATUS: 500 Internal Server Error.",
  memory_leak: "java.lang.OutOfMemoryError: Java heap space at java.base/java.util.Arrays.copyOf(Arrays.java:3537) FATAL CORE DUMP INITIATED. STATUS: 503",
  security_breach: "WARN: Multiple anomalous failed login attempts (500+ in 2s) detected from IP 192.168.1.105 targeting /api/admin/auth. STATUS: 401 Unauthorized"
};

export default function App() {
  const [logs, setLogs] = useState(THREAT_SCENARIOS.db_crash);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // REAL-WORLD FEATURE: Persistent State Memory
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('aegis_history');
    return saved ? JSON.parse(saved) : [];
  });

  // REAL-WORLD FEATURE: Live Cluster Vitals
  const [vitals, setVitals] = useState({ cpu: 45, mem: 60, latency: 42, db: 100 });

  useEffect(() => {
    const interval = setInterval(() => {
      let newVitals = {
        cpu: 40 + Math.floor(Math.random() * 10),
        mem: 55 + Math.floor(Math.random() * 10),
        latency: 35 + Math.floor(Math.random() * 15),
        db: 100
      };

      // Vitals react to the injected threat dynamically
      if (logs === THREAT_SCENARIOS.db_crash) {
        newVitals.db = 0; 
        newVitals.latency = 500 + Math.floor(Math.random() * 200); 
      } else if (logs === THREAT_SCENARIOS.memory_leak) {
        newVitals.mem = 99; 
        newVitals.cpu = 95 + Math.floor(Math.random() * 5); 
      } else if (logs === THREAT_SCENARIOS.security_breach) {
        newVitals.cpu = 85 + Math.floor(Math.random() * 10);
        newVitals.latency = 800 + Math.floor(Math.random() * 400); 
      }

      setVitals(newVitals);
    }, 1200); // Fluctuate every 1.2 seconds

    return () => clearInterval(interval);
  }, [logs]);

  const analyzeIncident = async () => {
    setLoading(true);
    setResult(null); 
    try {
      const res = await fetch('http://localhost:3000/api/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs })
      });
      const data = await res.json();
      
      const intelligenceWithTime = { ...data.intelligence, timestamp: new Date().toLocaleTimeString() };
      setResult(intelligenceWithTime);
      
      setHistory(prev => {
        const updatedHistory = [intelligenceWithTime, ...prev].slice(0, 5);
        localStorage.setItem('aegis_history', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.remediation_script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const reportData = {
      incident_timestamp: new Date().toISOString(),
      inference_node: "Crusoe-Nemotron-3-Nano",
      ingested_log: logs,
      ai_intelligence: result
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AegisOps_Incident_Report_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <header className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-400">🛡️ AEGIS_OPS AI</h1>
          <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">Autonomous Incident Control Core</p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs text-right">
          <span className="text-slate-500">Inference Node:</span> <span className="text-amber-400 font-mono ml-2">Crusoe-Nemotron-3-Nano</span>
        </div>
      </header>

      {/* NEW: LIVE CLUSTER VITALS TELEMETRY */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className={`bg-slate-900 border rounded-lg p-4 transition-colors duration-500 ${vitals.cpu > 90 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Core CPU Load</div>
          <div className={`text-2xl font-black font-mono transition-colors duration-300 ${vitals.cpu > 90 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{vitals.cpu}%</div>
        </div>
        <div className={`bg-slate-900 border rounded-lg p-4 transition-colors duration-500 ${vitals.mem > 90 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Heap Memory</div>
          <div className={`text-2xl font-black font-mono transition-colors duration-300 ${vitals.mem > 90 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{vitals.mem}%</div>
        </div>
        <div className={`bg-slate-900 border rounded-lg p-4 transition-colors duration-500 ${vitals.latency > 300 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">API Latency</div>
          <div className={`text-2xl font-black font-mono transition-colors duration-300 ${vitals.latency > 300 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{vitals.latency}ms</div>
        </div>
        <div className={`bg-slate-900 border rounded-lg p-4 transition-colors duration-500 ${vitals.db === 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">DB Connection Pool</div>
          <div className={`text-2xl font-black font-mono transition-colors duration-300 ${vitals.db === 0 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{vitals.db}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Input panel */}
        <div className="flex flex-col gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Ingested Exception Streams</h2>
            </div>
            
            {/* THREAT INJECTION MATRIX */}
            <div className="flex gap-2 mb-2">
              <button onClick={() => setLogs(THREAT_SCENARIOS.db_crash)} className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded transition-colors ${logs === THREAT_SCENARIOS.db_crash ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
                Inject DB Timeout
              </button>
              <button onClick={() => setLogs(THREAT_SCENARIOS.memory_leak)} className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded transition-colors ${logs === THREAT_SCENARIOS.memory_leak ? 'bg-rose-900/50 text-rose-400 border border-rose-800/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
                Inject OOM Error
              </button>
              <button onClick={() => setLogs(THREAT_SCENARIOS.security_breach)} className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded transition-colors ${logs === THREAT_SCENARIOS.security_breach ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
                Inject Brute Force
              </button>
            </div>

            <textarea 
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-rose-300 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
            />
            <button 
              onClick={analyzeIncident}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-4 px-6 rounded-lg text-sm tracking-widest shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? "PROFILING SYSTEM RECONNAISSANCE..." : "DEPLOY AEGIS OPS ANALYSIS"}
            </button>
          </div>

          {/* PERSISTENT AUDIT LEDGER */}
          {history.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Historical Audit Ledger</h2>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">LOCAL STORAGE</span>
              </div>
              <div className="flex flex-col gap-3">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded p-3 text-xs flex justify-between items-center">
                    <div>
                      <div className="text-slate-500 mb-1">{item.timestamp}</div>
                      <div className="text-slate-300 font-medium">{item.incident_type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-mono bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/50">
                        {item.autonomous_action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Output Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Autonomous Mitigation Feed</h2>
          
          {result ? (
            <div className="flex flex-col gap-4 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pipeline Router</div>
                  <div className="text-sm font-mono font-bold text-amber-400 mt-2">Crusoe Cloud Network</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Anomalous Classification</div>
                  <div className="text-sm font-bold text-slate-200 mt-2">{result.incident_type}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Root Cause Intelligence</div>
                <div className="text-sm text-slate-300 mt-2 leading-relaxed">{result.root_cause}</div>
              </div>

              {result.remediation_script && (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 relative group">
                  <div className="text-xs text-emerald-500 font-medium uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>Auto-Generated Remediation Script</span>
                    <button 
                      onClick={handleCopy}
                      className={`text-[10px] px-2 py-1 rounded border transition-all ${copied ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-emerald-900/50 text-emerald-400 border-emerald-800 hover:bg-emerald-800/50'}`}
                    >
                      {copied ? 'COPIED TO CLIPBOARD' : 'COPY & DEPLOY'}
                    </button>
                  </div>
                  <div className="bg-black/50 rounded p-3 overflow-x-auto border border-slate-800/50">
                    <code className="text-sm font-mono text-emerald-300 whitespace-pre">
                      {result.remediation_script}
                    </code>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Calculated Blast Radius</div>
                  <div className="text-2xl font-black mt-2 text-rose-500">{result.severity_score} / 10</div>
                </div>
                <div className="bg-emerald-950/40 p-4 rounded-lg border border-emerald-800/60 text-center h-full flex flex-col justify-center">
                  <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Countermeasure Deployed</div>
                  <div className="text-sm font-mono font-black text-emerald-400 mt-2 bg-emerald-950 px-2 py-1 rounded inline-block border border-emerald-800/80 mx-auto">
                    {result.autonomous_action}
                  </div>
                </div>
              </div>

              <button 
                onClick={downloadReport}
                className="w-full mt-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-emerald-400 font-bold py-3 px-4 rounded-lg text-xs tracking-widest border border-slate-800 hover:border-emerald-900/50 transition-all flex justify-center items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DOWNLOAD POST-MORTEM AUDIT LOG
              </button>

            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-8 text-center text-slate-600">
              <div className="text-4xl mb-4">📡</div>
              <p className="text-sm uppercase tracking-widest max-w-xs leading-relaxed">Awaiting anomalous event input stream to initialize threat mitigation loop.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}