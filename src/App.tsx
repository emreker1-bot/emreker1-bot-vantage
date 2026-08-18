import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityItem, FilterState } from './types';
import { INITIAL_OPPORTUNITIES } from './data/seedData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityTable } from './components/OpportunityTable';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { ExportModal } from './components/ExportModal';
import { 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Cpu,
  RefreshCw
} from 'lucide-react';

const INITIAL_FILTER_STATE: FilterState = {
  category: 'ALL',
  itemType: 'ALL',
  region: 'ALL',
  noAuthorizedSellerOnly: false,
  minScore: 0,
  searchQuery: '',
  sortBy: 'score_desc',
};

function AppContent() {
  const { t } = useLanguage();
  const [items, setItems] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [selectedItem, setSelectedItem] = useState<OpportunityItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  const [torStatus, setTorStatus] = useState({
    is_active: true,
    current_node: { ip: '185.220.101.54', city: 'Frankfurt', country: 'DE', bandwidth_mbps: 120 },
    stats: {
      total_rotations: 42,
      total_scrapes: 1450,
      captcha_bypassed: 389,
      active_workers: 4,
      avg_latency_ms: 310,
    }
  });

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  // Fetch Items automatically from Backend API
  const fetchItems = async () => {
    setIsSyncing(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category !== 'ALL') queryParams.append('category', filters.category);
      if (filters.itemType !== 'ALL') queryParams.append('itemType', filters.itemType);
      if (filters.region !== 'ALL') queryParams.append('region', filters.region);
      if (filters.noAuthorizedSellerOnly) queryParams.append('noAuthorizedSellerOnly', 'true');
      if (filters.minScore && filters.minScore > 0) queryParams.append('minScore', String(filters.minScore));
      if (filters.searchQuery) queryParams.append('searchQuery', filters.searchQuery);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/items?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (e) {
      console.warn('Backend auto-fetch notice, retaining items:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchTorStatus = async () => {
    try {
      const res = await fetch('/api/scraper/status');
      const data = await res.json();
      if (data && data.current_node) {
        setTorStatus({
          is_active: data.is_active,
          current_node: data.current_node,
          stats: data.stats || torStatus.stats,
        });
      }
    } catch (e) {
      // Background status polling
    }
  };

  const fetchAlertsCount = async () => {
    try {
      const res = await fetch('/api/alerts/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        const unread = data.notifications.filter((n: any) => !n.read).length;
        setUnreadAlertsCount(unread);
      }
    } catch (e) {
      // Background alerts polling
    }
  };

  useEffect(() => {
    fetchItems();
    // Auto-sync items every 8 seconds in the background with zero user action needed
    const interval = setInterval(fetchItems, 8000);
    return () => clearInterval(interval);
  }, [filters]);

  useEffect(() => {
    fetchTorStatus();
    fetchAlertsCount();
    const interval = setInterval(() => {
      fetchTorStatus();
      fetchAlertsCount();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  // Summary Metrics
  const avgScore = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((items.reduce((acc, curr) => acc + curr.opportunity_score, 0) / items.length) * 10) / 10;
  }, [items]);

  const totalMonthlyPotentialUSD = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.monthly_potential_revenue_usd || 0), 0);
  }, [items]);

  const highConfidenceCount = useMemo(() => {
    return items.filter((i) => i.opportunity_score >= 85 && !i.authorized_reseller_exists).length;
  }, [items]);

  // Spotlight cards (Top 3 items with highest OS)
  const spotlightItems = useMemo(() => {
    return [...items].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 3);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#080809] text-slate-300 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        torStatus={torStatus}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAlerts={() => {
          setIsAlertsOpen(true);
          setUnreadAlertsCount(0);
        }}
        unreadAlertsCount={unreadAlertsCount}
        itemCount={items.length}
        avgScore={avgScore}
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => {
          handleFilterChange({ searchQuery: query });
        }}
      />

      {/* Main Single-Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-[#161618] border border-white/5 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate">{t.kpiTotalPool}</p>
              <p className="text-xs sm:text-base font-mono font-bold text-emerald-400 truncate">
                ${totalMonthlyPotentialUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate">{t.kpiAvgScore}</p>
              <p className="text-xs sm:text-base font-mono font-bold text-orange-400 truncate">
                {avgScore} / 100
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate">{t.kpiOpenNiches}</p>
              <p className="text-xs sm:text-base font-mono font-bold text-white truncate">
                {highConfidenceCount} {t.opportunitiesCount}
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate">AI Tor Scraper</p>
              <p className="text-xs sm:text-base font-mono font-bold text-emerald-400 truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Otomatik Aktif</span>
              </p>
            </div>
          </div>
        </div>

        {/* Spotlight Top Arbitrage Section */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {t.spotlightTitle}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Canlı Otomatik Senkronizasyon (8s)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {spotlightItems.map((item) => (
                <OpportunityCard
                  key={item.id}
                  item={item}
                  onSelect={(selected) => setSelectedItem(selected)}
                />
              ))}
            </div>
          </div>

          {/* Detailed Matrix Table & Mobile Card List */}
          <OpportunityTable
            items={items}
            allItemsCount={items.length}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectRow={(selected) => setSelectedItem(selected)}
            onDeleteItem={handleDeleteItem}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Deep-Dive Inspection Modal */}
      {selectedItem && (
        <OpportunityDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRefreshItem={fetchItems}
        />
      )}

      {/* Export Dataset Modal */}
      {isExportOpen && (
        <ExportModal
          items={items}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Custom Opportunity Alerts Settings Modal */}
      <AlertSettingsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectOpportunity={(itemId) => {
          const item = items.find(i => i.id === itemId);
          if (item) {
            setSelectedItem(item);
          }
        }}
      />

      {/* Footer */}
      <footer className="px-6 py-3.5 border-t border-white/5 bg-[#0A0A0B] flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex gap-6 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TOR Node: {torStatus.current_node.ip} (Auto-Rotated)</span>
          </div>
          <div>{t.footerDbReady}</div>
        </div>
        <div className="flex gap-4 items-center">
          <span>AI ENGINE: AUTO-PILOT</span>
          <span className="text-slate-400 uppercase font-sans font-bold">{t.footerVersion}</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
