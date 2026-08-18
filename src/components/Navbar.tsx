import React from 'react';
import { 
  Sparkles, 
  Languages,
  Search,
  X,
  Bell,
  Download,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  torStatus: {
    is_active: boolean;
    current_node: { ip: string; city: string; country: string };
  };
  onOpenExport: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount?: number;
  itemCount: number;
  avgScore: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  torStatus,
  onOpenExport,
  onOpenAlerts,
  unreadAlertsCount = 0,
  itemCount,
  avgScore,
  searchQuery = '',
  onSearchChange
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  const handleGlobalSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <header id="main-header" className="bg-[#0C0C0D] border-b border-white/10 sticky top-0 z-40 text-slate-300 shadow-xl">
      {/* Automatic Status Telemetry Bar */}
      <div className="border-b border-white/5 bg-[#080809] px-3 sm:px-6 py-1.5 text-xs flex items-center justify-between gap-2 text-slate-400 font-mono">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold font-sans text-[11px]">Otomatik Senkronize</span>
            <span className="text-white/10 hidden sm:inline">|</span>
            <span className="text-slate-400 text-[11px] font-sans hidden sm:inline">AI Radar & Tor Scraper Arka Planda Aktif</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-sans">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>Proxy: {torStatus.current_node?.city || 'Frankfurt'} ({torStatus.current_node?.country || 'DE'})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300 font-sans text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold hidden sm:inline">{t.liveTracking}:</span>
            <span className="font-mono text-white font-semibold">{itemCount} {t.opportunitiesCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold hidden sm:inline">{t.avgOsScore}:</span>
            <span className="font-mono text-orange-400 font-bold">{avgScore}/100</span>
          </div>

          {/* Language Switcher */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#161618] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer font-sans text-xs font-semibold"
          >
            <Languages className="w-3.5 h-3.5 text-orange-400" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Main App Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-950/40 flex items-center justify-center font-black text-white text-lg tracking-wider shrink-0">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                PazarRadar
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[10px] font-bold border border-orange-500/30 leading-none shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Oto-AI Engine</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Otomatik Canlı Arbitraj & Fırsat Motoru</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md mx-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="navbar-global-search"
            type="text"
            placeholder="Ürün, marka, ASIN veya fırsat ara..."
            value={searchQuery}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-7 py-2 bg-[#161618] border border-white/10 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => handleGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Export Dataset Button */}
          <button
            onClick={onOpenExport}
            title="Veri Setini Dışa Aktar"
            className="p-2 rounded-xl bg-[#161618] border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
          >
            <Download className="w-4 h-4 text-slate-300" />
          </button>

          {/* Custom Opportunity Alerts Bell */}
          <button
            id="alerts-btn"
            onClick={onOpenAlerts}
            title={t.alertBellTooltip}
            className="relative p-2 rounded-xl bg-[#161618] border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
          >
            <Bell className="w-4 h-4 text-orange-400" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse font-mono">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
