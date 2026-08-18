import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityItem, FilterState, TorScraperLog } from './types';
import { INITIAL_OPPORTUNITIES } from './data/seedData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityTable } from './components/OpportunityTable';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { ArbitrageCalculator } from './components/ArbitrageCalculator';
import { TorScraperConsole } from './components/TorScraperConsole';
import { AIOpportunityRadar } from './components/AIOpportunityRadar';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { ExportModal } from './components/ExportModal';
import { ExternalApiHubModal } from './components/ExternalApiHubModal';
import { 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Cpu,
  RotateCw
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'scraper' | 'ai-radar' | 'architecture'>('dashboard');
  const [items, setItems] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [selectedItem, setSelectedItem] = useState<OpportunityItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isApiHubOpen, setIsApiHubOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(2);
  const [isRotatingTor, setIsRotatingTor] = useState(false);
  const [logs, setLogs] = useState<TorScraperLog[]>([]);

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
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);

  // Fetch Items from Backend API
  const fetchItems = async () => {
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
      console.warn('Backend fetch error, retaining current items:', e);
    }
  };

  const handleSyncBulkDatabase = async () => {
    setIsBulkSyncing(true);
    try {
      const res = await fetch('/api/items/reset-and-seed', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (e) {
      console.error('Bulk sync error:', e);
    } finally {
      setIsBulkSyncing(false);
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
        if (data.recent_logs) {
          setLogs(data.recent_logs);
        }
      }
    } catch (e) {
      console.error(e);
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
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    fetchItems();
    // Auto-poll items every 10 seconds to fetch dynamically discovered opportunities across all scenarios
    const interval = setInterval(fetchItems, 10000);
    return () => clearInterval(interval);
  }, [filters]);

  useEffect(() => {
    fetchTorStatus();
    fetchAlertsCount();
    const interval = setInterval(fetchAlertsCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRotateTor = async () => {
    setIsRotatingTor(true);
    try {
      const res = await fetch('/api/scraper/rotate-ip', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTorStatus((prev) => ({
          ...prev,
          current_node: { ip: data.new_ip, city: data.city, country: data.country },
          stats: {
            ...prev.stats,
            total_rotations: prev.stats.total_rotations + 1,
          }
        }));

        const rotateLog: TorScraperLog = {
          id: `log-rot-${Date.now()}`,
          timestamp: 'Şimdi',
          tor_ip: data.new_ip,
          country: data.country,
          action: `Tor Signal.NEWNYM -> Rotated to ${data.city} (${data.country})`,
          target_url: `socks5://127.0.0.1:9050 -> ${data.new_ip}`,
          status: 'ROTATING',
          latency_ms: 110,
        };
        setLogs((prev) => [rotateLog, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRotatingTor(false);
    }
  };

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
      console.error('Delete error:', err);
      // Fallback local deletion
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleItemSaved = (newItem: OpportunityItem) => {
    setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
    setActiveTab('dashboard');
    setSelectedItem(newItem);
  };

  const handleOpportunityDiscovered = (item: OpportunityItem) => {
    setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        torStatus={torStatus}
        onRotateTor={handleRotateTor}
        isRotating={isRotatingTor}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNewItemModal={() => setActiveTab('calculator')}
        onOpenAlerts={() => {
          setIsAlertsOpen(true);
          setUnreadAlertsCount(0);
        }}
        onOpenApiHub={() => setIsApiHubOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        itemCount={items.length}
        avgScore={avgScore}
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => {
          handleFilterChange({ searchQuery: query });
          if (activeTab !== 'dashboard') {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#161618] border border-white/5 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">{t.kpiTotalPool}</p>
              <p className="text-base font-mono font-bold text-emerald-400">
                ${totalMonthlyPotentialUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">{t.kpiAvgScore}</p>
              <p className="text-base font-mono font-bold text-orange-400">
                {avgScore} / 100
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">{t.kpiOpenNiches}</p>
              <p className="text-base font-mono font-bold text-white">
                {highConfidenceCount} {t.opportunitiesCount}
              </p>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">{t.kpiTorWorkers}</p>
              <p className="text-base font-mono font-bold text-emerald-400">
                {t.kpiOnlineStatus}
              </p>
            </div>
          </div>
        </div>

        {/* View 1: Main Dashboard (Spotlight Cards + Matrix Table) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Spotlight Highlight Cards Section */}
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
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Otomatik Pazar Taraması Aktif (Tüm Senaryolar)</span>
                  </div>

                  <button
                    onClick={handleSyncBulkDatabase}
                    disabled={isBulkSyncing}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Tüm pazar veritabanını yenile"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                    <span>{isBulkSyncing ? 'Yükleniyor...' : 'Veritabanını Yenile'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spotlightItems.map((item) => (
                  <OpportunityCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </div>
            </div>

            {/* Detailed Matrix Table */}
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
        )}

        {/* View 2: Arbitrage Sandbox Calculator */}
        {activeTab === 'calculator' && (
          <ArbitrageCalculator 
            onItemSaved={handleItemSaved} 
            onNavigateToMatrix={() => setActiveTab('dashboard')}
          />
        )}

        {/* View 3: Zero-Cost Tor Scraper Console */}
        {activeTab === 'scraper' && (
          <TorScraperConsole
            logs={logs}
            onRotateTor={handleRotateTor}
            isRotating={isRotatingTor}
            torStatus={torStatus}
            onAddLog={(log) => setLogs((prev) => [log, ...prev])}
          />
        )}

        {/* View 4: Gemini AI Opportunity Radar */}
        {activeTab === 'ai-radar' && (
          <AIOpportunityRadar
            onSelectOpportunity={(selected) => setSelectedItem(selected)}
            onOpportunityDiscovered={handleOpportunityDiscovered}
          />
        )}

        {/* View 5: System Architecture & Technical Specifications */}
        {activeTab === 'architecture' && (
          <SystemArchitectureView />
        )}
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

      {/* External Real API & Live FX Hub Modal */}
      <ExternalApiHubModal
        isOpen={isApiHubOpen}
        onClose={() => setIsApiHubOpen(false)}
        onItemDiscovered={(item) => {
          handleOpportunityDiscovered(item);
          fetchItems();
        }}
      />

      {/* Footer */}
      <footer className="px-6 py-3.5 border-t border-white/5 bg-[#0A0A0B] flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex gap-6 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TOR IP: {torStatus.current_node.ip} (Rotation: Active)</span>
          </div>
          <div>{t.footerDbReady}</div>
        </div>
        <div className="flex gap-4 items-center">
          <span>NODE_ID: OC-FREE-DE-01</span>
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
