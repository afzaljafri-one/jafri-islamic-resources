import React, { useState, useEffect } from 'react';
import { cacheService } from '../services/cacheService';
import { Database, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

export const CacheDiagnosticCard: React.FC = () => {
  const [stats, setStats] = useState<{ count: number; keys: string[] }>({ count: 0, keys: [] });
  const [testResult, setTestResult] = useState<string | null>(null);

  const refreshStats = () => {
    setStats(cacheService.getLocalStorageStats());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const runCacheTest = async () => {
    // Write test item to IndexedDB and LocalStorage
    const testKey = 'diagnostic_test_item';
    const testPayload = { text: 'Diagnostic verification item', timestamp: Date.now() };

    cacheService.set(testKey, testPayload, 60000); // 1 min TTL
    await cacheService.setIndexedDB(testKey, testPayload);

    // Read back
    const lsRead = cacheService.get<typeof testPayload>(testKey);
    const idbRead = await cacheService.getIndexedDB<typeof testPayload>(testKey);

    if (lsRead && idbRead) {
      setTestResult('Cache Verified: Both LocalStorage and IndexedDB read/write operations succeeded.');
    } else {
      setTestResult('Cache Test: Partial success or storage unavailable.');
    }

    refreshStats();
  };

  const clearCache = async () => {
    await cacheService.clearAll();
    setTestResult('All cache entries cleared.');
    refreshStats();
  };

  return (
    <div className="rounded-2xl bg-navy-900 border border-gold-500/30 p-5 lg:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-navy-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
              Cache Verification & Storage Diagnostics
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                IndexedDB + LocalStorage
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Multi-tier persistence: Quran texts cached permanently in IndexedDB; preferences & daily prayer times cached in LocalStorage
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={runCacheTest}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Cache Test</span>
          </button>
          <button
            onClick={clearCache}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Cache</span>
          </button>
        </div>
      </div>

      {/* Test Output Banner */}
      {testResult && (
        <div className="p-3 rounded-xl bg-navy-950 border border-gold-500/40 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Cache Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20">
          <span className="text-slate-400 block">IndexedDB Store</span>
          <span className="text-sm font-bold text-slate-100 mt-1 block">jafri_islamic_cache_v1</span>
          <span className="text-[10px] text-gold-400 block">Immutable Quran Text & Ayahs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20">
          <span className="text-slate-400 block">LocalStorage Items</span>
          <span className="text-sm font-mono font-bold text-gold-400 mt-1 block">{stats.count} keys</span>
          <span className="text-[10px] text-slate-400 block">Prefixed with `jafri_*`</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20">
          <span className="text-slate-400 block">Storage Strategy</span>
          <span className="text-sm font-bold text-slate-100 mt-1 block">TTL-Aware + Invalidation</span>
          <span className="text-[10px] text-slate-400 block">24h Prayer TTL, 6h Nisab TTL</span>
        </div>
      </div>

      {/* Active Cached Keys */}
      {stats.keys.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Cached LocalStorage Keys:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stats.keys.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-navy-950 border border-gold-500/20 text-[11px] font-mono text-slate-300"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
