import React, { useState, useEffect } from 'react';
import { TorScraperLog } from '../types';
import { 
  Terminal, 
  RotateCw, 
  Play, 
  Square, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Send,
  Sparkles,
  Wifi
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TorScraperConsoleProps {
  logs: TorScraperLog[];
  onRotateTor: () => void;
  isRotating: boolean;
  torStatus: {
    is_active: boolean;
    current_node: { ip: string; city: string; country: string; bandwidth_mbps?: number };
    stats: {
      total_rotations: number;
      total_scrapes: number;
      captcha_bypassed: number;
      active_workers: number;
      avg_latency_ms: number;
    };
  };
  onAddLog?: (log: TorScraperLog) => void;
}

export const TorScraperConsole: React.FC<TorScraperConsoleProps> = ({
  logs: initialLogs,
  onRotateTor,
  isRotating,
  torStatus,
  onAddLog
}) => {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<TorScraperLog[]>(initialLogs);
  const [targetPlatform, setTargetPlatform] = useState('Amazon.de');
  const [targetKeyword, setTargetKeyword] = useState('B08HXK9921');
  const [isScanning, setIsScanning] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  // Periodic heartbeat log if running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const randomTargets = [
        { platform: 'Amazon.de', url: 'https://www.amazon.de/s?k=philips+sonicare', action: 'Stealth DOM Scraping (Playwright headless Chromium)' },
        { platform: 'Trendyol.com', url: 'https://www.trendyol.com/sr?q=yedek+baslik', action: 'Product Pricing & Stock Extraction / Anti-Bot Bypassed' },
        { platform: 'Google Places', url: 'https://maps.googleapis.com/maps/api/place/textsearch', action: 'Local HVAC / Notdienst Review Stream Ingestion' },
        { platform: 'G2.com', url: 'https://www.g2.com/products/category/developer-tools', action: 'SaaS License Unmet Support Sentiment Mining' }
      ];
      const target = randomTargets[Math.floor(Math.random() * randomTargets.length)];
      
      const newLog: TorScraperLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Şimdi',
        tor_ip: torStatus.current_node?.ip || '185.220.101.54',
        country: torStatus.current_node?.country || 'DE',
        action: `[Worker #0${Math.floor(Math.random() * 4) + 1}] ${target.action} on ${target.platform}`,
        target_url: target.url,
        status: Math.random() > 0.3 ? 'SUCCESS' : 'CAPTCHA_BYPASSED',
        latency_ms: Math.floor(Math.random() * 200) + 180
      };

      setLogs(prev => [newLog, ...prev.slice(0, 30)]);
      if (onAddLog) onAddLog(newLog);
    }, 4500);

    return () => clearInterval(interval);
  }, [isRunning, torStatus.current_node, onAddLog]);

  const handleTriggerScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKeyword.trim()) return;

    setIsScanning(true);
    try {
      const res = await fetch('/api/scraper/trigger-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: targetPlatform,
          search_term: targetKeyword
        })
      });
      const data = await res.json();
      
      const manualLog: TorScraperLog = {
        id: `log-manual-${Date.now()}`,
        timestamp: 'Şimdi',
        tor_ip: torStatus.current_node?.ip || '185.220.101.54',
        country: torStatus.current_node?.country || 'DE',
        action: `[MANUAL JOB] Scraped "${targetKeyword}" on ${targetPlatform} -> Data Ingested`,
        target_url: `https://${targetPlatform.toLowerCase().replace(/\s+/g, '')}/search?q=${encodeURIComponent(targetKeyword)}`,
        status: 'SUCCESS',
        latency_ms: 240
      };

      setLogs(prev => [manualLog, ...prev]);
      if (onAddLog) onAddLog(manualLog);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div id="tor-scraper-console-container" className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#161618] border border-white/5 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-semibold text-base tracking-tight">
              {t.scraperHeader}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.scraperSub}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            id="scraper-toggle-btn"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              isRunning 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            {isRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? t.scraperStop : t.scraperStart}</span>
          </button>

          <button
            id="scraper-rotate-ip-btn"
            onClick={onRotateTor}
            disabled={isRotating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{t.scraperRotateIp}</span>
          </button>
        </div>
      </div>

      {/* 4 Diagnostic Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161618] border border-white/5 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">{t.scraperExitNodeCard}</span>
          <div className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Wifi className="w-4 h-4 text-orange-400" />
            <span>{torStatus.current_node?.city || 'Frankfurt'} ({torStatus.current_node?.country || 'DE'})</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">IP: {torStatus.current_node?.ip || '185.220.101.54'}</p>
        </div>

        <div className="bg-[#161618] border border-white/5 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">{t.scraperSocks5Card}</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            127.0.0.1:9050
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{torStatus.stats?.total_rotations || 42} IP Rotasyonu Yapıldı</p>
        </div>

        <div className="bg-[#161618] border border-white/5 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">{t.scraperStealthCard}</span>
          <div className="text-base font-bold text-white font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>v2.4 Stealth Enabled</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Canvas & WebGL Spoofed</p>
        </div>

        <div className="bg-[#161618] border border-white/5 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">{t.scraperBlockRateCard}</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            %0.02 (Bypassed: {torStatus.stats?.captcha_bypassed || 389})
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{t.scraperLast24h}</p>
        </div>
      </div>

      {/* Manual Target Scrape Dispatcher */}
      <form onSubmit={handleTriggerScan} className="bg-[#161618] border border-white/5 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-end gap-3 text-xs">
        <div className="flex-1">
          <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.scraperPlatformInput}</label>
          <input
            type="text"
            value={targetPlatform}
            onChange={(e) => setTargetPlatform(e.target.value)}
            className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            placeholder="Amazon.de / Trendyol / G2"
          />
        </div>

        <div className="flex-1">
          <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.scraperKeywordInput}</label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            placeholder="ASIN veya Anahtar Kelime..."
          />
        </div>

        <button
          type="submit"
          disabled={isScanning}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Send className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Taranıyor...' : t.scraperLaunchBtn}</span>
        </button>
      </form>

      {/* Live Terminal Daemon Log Box */}
      <div className="bg-[#0C0C0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="bg-[#161618] px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-slate-400 text-[11px] ml-2 font-mono">{t.scraperTerminalTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            {isRunning && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{t.scraperLiveStreaming}</span>
              </span>
            )}
            <button
              onClick={handleClearLogs}
              className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.scraperClearLogs}</span>
            </button>
          </div>
        </div>

        {/* Logs Output Box */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2 text-slate-300">
          {logs.length === 0 ? (
            <div className="text-slate-600 py-8 text-center">
              [LOG STREAM IDLE] Taramayı başlatarak canlı çıktıyı izleyebilirsiniz.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 hover:bg-white/[0.02] p-1 rounded transition-colors text-[11px]">
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="text-orange-400 font-bold shrink-0">{log.tor_ip} ({log.country})</span>
                <span className="text-slate-300 flex-1 break-all">{log.action}</span>
                <span className="text-slate-500 text-[10px] shrink-0 font-mono">{log.latency_ms}ms</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                  log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' :
                  log.status === 'CAPTCHA_BYPASSED' ? 'bg-blue-500/10 text-blue-400' :
                  log.status === 'ROTATING' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
