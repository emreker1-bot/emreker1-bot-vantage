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
    <>
      <header id="main-header" className="bg-[#0C0C0D] border-b border-white/10 sticky top-0 z-40 text-slate-300 shadow-xl">
        {/* Desktop-only Telemetry Status Bar */}
        <div className="hidden md:flex border-b border-white/5 bg-[#080809] px-4 sm:px-6 py-1.5 text-xs items-center justify-between gap-3 text-slate-400 font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 uppercase text-[11px] font-sans font-semibold">Canlı Tarama Proxy:</span>
              <span className="text-emerald-400">Tor Exit Node</span>
              <span className="text-white/10">|</span>
              <span className="text-orange-400">{torStatus.current_node?.city || 'Frankfurt'} ({torStatus.current_node?.country || 'DE'})</span>
            </div>

            <button
              id="rotate-tor-ip-btn"
              onClick={onRotateTor}
              disabled={isRotating}
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 cursor-pointer disabled:opacity-50 text-[11px] font-sans"
              title="Tor IP Rotasyonu"
            >
              <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'Rotasyon...' : 'IP Değiştir'}</span>
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

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161618] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer font-sans text-xs font-semibold"
            >
              <Languages className="w-3.5 h-3.5 text-orange-400" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Main App Navigation Header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-950/40 flex items-center justify-center font-black text-white text-base tracking-wider shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-none">
                  PazarRadar
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-bold border border-emerald-500/20 leading-none shrink-0">
                  CANLI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden xs:block">Global Arbitraj Fırsat Motoru</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-[180px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm mx-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="navbar-global-search"
              type="text"
              placeholder="Fırsat, marka, ASIN ara..."
              value={searchQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="w-full pl-8 pr-6 py-1.5 bg-[#161618] border border-white/10 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleGlobalSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Fırsatlar</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-orange-400" />
              <span>Hesaplayıcı</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ai-radar'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>AI Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('scraper')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'scraper'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proxy / Scraper</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mimari</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
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

            {/* Custom Add Item Button */}
            <button
              id="add-item-btn"
              onClick={onOpenNewItemModal}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-950/40 transition-all cursor-pointer min-h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Fırsat Ekle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - App Native Touch Navigation */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 inset-x-0 bg-[#0C0C0D]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around py-2 px-1 text-[10px] text-slate-400 shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-h-[44px] justify-center cursor-pointer ${
            activeTab === 'dashboard' ? 'text-orange-400 font-bold bg-orange-500/10' : 'hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Fırsatlar</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-h-[44px] justify-center cursor-pointer ${
            activeTab === 'calculator' ? 'text-orange-400 font-bold bg-orange-500/10' : 'hover:text-slate-200'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span>Hesapla</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-radar')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-h-[44px] justify-center cursor-pointer ${
            activeTab === 'ai-radar' ? 'text-orange-300 font-bold bg-orange-500/20' : 'hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span>AI Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('scraper')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-h-[44px] justify-center cursor-pointer ${
            activeTab === 'scraper' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'hover:text-slate-200'
          }`}
        >
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Proxy</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-h-[44px] justify-center cursor-pointer ${
            activeTab === 'architecture' ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'hover:text-slate-200'
          }`}
        >
          <Boxes className="w-5 h-5 text-indigo-400" />
          <span>Mimari</span>
        </button>
      </nav>
    </>
  );
};
