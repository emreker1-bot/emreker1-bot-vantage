import React from 'react';
import { 
  Layers, 
  Calculator, 
  Cpu, 
  Sparkles, 
  RotateCw, 
  Download, 
  Plus, 
  Globe,
  Languages,
  Search,
  X,
  Boxes,
  Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: 'dashboard' | 'calculator' | 'scraper' | 'ai-radar' | 'architecture';
  setActiveTab: (tab: 'dashboard' | 'calculator' | 'scraper' | 'ai-radar' | 'architecture') => void;
  torStatus: {
    is_active: boolean;
    current_node: { ip: string; city: string; country: string };
  };
  onRotateTor: () => void;
  isRotating: boolean;
  onOpenExport: () => void;
  onOpenNewItemModal: () => void;
  onOpenAlerts: () => void;
  onOpenApiHub?: () => void;
  unreadAlertsCount?: number;
  itemCount: number;
  avgScore: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  torStatus,
  onRotateTor,
  isRotating,
  onOpenExport,
  onOpenNewItemModal,
  onOpenAlerts,
  onOpenApiHub,
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
    <header id="main-header" className="bg-[#0C0C0D] border-b border-white/5 sticky top-0 z-40 text-slate-300 shadow-xl">
      {/* Top Telemetry & Status Bar */}
      <div className="border-b border-white/5 bg-[#080809] px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 uppercase text-[11px] font-sans font-semibold">{t.torProxy}</span>
            <span className="text-emerald-400">socks5://127.0.0.1:9050</span>
            <span className="text-white/10">|</span>
            <span className="text-slate-400 uppercase text-[11px] font-sans font-semibold">{t.exitNode}</span>
            <span className="text-orange-400">{torStatus.current_node?.city || 'Frankfurt'} ({torStatus.current_node?.country || 'DE'}) [{torStatus.current_node?.ip || '185.220.101.54'}]</span>
          </div>

          <button
            id="rotate-tor-ip-btn"
            onClick={onRotateTor}
            disabled={isRotating}
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 cursor-pointer disabled:opacity-50 text-[11px] font-sans"
            title="Tor Signal.NEWNYM IP Rotasyonu"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? t.ipRotating : t.ipRotateBtn}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-slate-300 font-sans text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold">{t.liveTracking}</span>
            <span className="font-mono text-white font-semibold">{itemCount} {t.opportunitiesCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold">{t.avgOsScore}</span>
            <span className="font-mono text-orange-400 font-bold">{avgScore}/100</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold">{t.playwrightStealth}</span>
            <span className="text-emerald-400 font-mono text-[11px]">{t.online}</span>
          </div>

          {/* Language Switcher Button */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161618] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer font-sans text-xs font-semibold"
            title={language === 'tr' ? 'Switch to English' : 'Türkçe Dil Seçeneğine Geç'}
          >
            <Languages className="w-3.5 h-3.5 text-orange-400" />
            <span>{language.toUpperCase()}</span>
            <span className="text-[10px] text-slate-500 font-normal">
              ({language === 'tr' ? 'Türkçe' : 'English'})
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg shadow-orange-950/40 flex items-center justify-center font-bold text-white tracking-wider">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
                <span>VANTAGE</span>
                <span className="text-slate-500 font-normal">GLOBE</span>
              </h1>
              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] uppercase font-bold border border-orange-500/20">
                {t.intelligenceLive}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">{t.brandSubtitle}</p>
          </div>
        </div>

        {/* Global Search Bar (Omni-Search) */}
        <div className="relative flex-1 max-w-xs md:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="navbar-global-search"
            type="text"
            placeholder={t.globalSearchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-[#161618] border border-white/10 focus:border-orange-500/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => handleGlobalSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title={t.quickClearSearch}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* View Tabs */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.tabDashboard}</span>
          </button>

          <button
            id="nav-tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.tabCalculator}</span>
          </button>

          <button
            id="nav-tab-scraper"
            onClick={() => setActiveTab('scraper')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'scraper'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tabScraper}</span>
          </button>

          <button
            id="nav-tab-ai-radar"
            onClick={() => setActiveTab('ai-radar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'ai-radar'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.tabAiRadar}</span>
          </button>

          <button
            id="nav-tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.tabArchitecture}</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Live External API Hub Button */}
          {onOpenApiHub && (
            <button
              id="api-hub-btn"
              onClick={onOpenApiHub}
              title="Dış API ve Canlı Veri Merkezi"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161618] border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Canlı API & Kurlar</span>
            </button>
          )}

          {/* Custom Opportunity Alerts Bell */}
          <button
            id="alerts-btn"
            onClick={onOpenAlerts}
            title={t.alertBellTooltip}
            className="relative p-1.5 rounded-lg bg-[#161618] border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-orange-400" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse font-mono">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            id="export-btn"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161618] border border-white/10 text-xs text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportDataset}</span>
          </button>

          <button
            id="add-item-btn"
            onClick={onOpenNewItemModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-md shadow-orange-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addCustomOpportunity}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
