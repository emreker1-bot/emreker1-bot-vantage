import React, { useState, useMemo } from 'react';
import { OpportunityItem, FilterState } from '../types';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Terminal, 
  Wrench, 
  Trash2,
  Flame,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OpportunityTableProps {
  items: OpportunityItem[];
  allItemsCount?: number;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onSelectRow: (item: OpportunityItem) => void;
  onDeleteItem?: (id: string) => void;
  onResetFilters: () => void;
  onBulkScan?: () => void;
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({
  items,
  allItemsCount = items.length,
  filters,
  onFilterChange,
  onSelectRow,
  onDeleteItem,
  onResetFilters,
  onBulkScan
}) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const dynamicCategories = useMemo(() => {
    const defaultCategories = [
      'Ev Aletleri & Yedek Parça',
      'Kişisel Bakım & Sağlık',
      'Geliştirici Araçları & SaaS Lisans',
      'Bilgisayar & Çevre Birimleri',
      'Yerel Hizmet & Acil Onarım',
      'Endüstriyel & Yapı Market',
      'Elektronik & Ses Sistemleri',
      'Yenilenebilir Enerji Hizmetleri',
      'Termos, Outdoor & Yaşam',
      'Profesyonel El Aletleri & Sanayi',
      'Kahve & Gurme Mutfak',
      'Kozmetik & Kişisel Bakım'
    ];
    const itemCats = items.map(i => i.category).filter(Boolean);
    return Array.from(new Set([...defaultCategories, ...itemCats]));
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  
  // Slice items for pagination
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getItemTypeBadge = (type: OpportunityItem['item_type']) => {
    switch (type) {
      case 'PHYSICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
            <Package className="w-3 h-3" />
            <span>Fiziki Arbitraj</span>
          </span>
        );
      case 'SOFTWARE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Terminal className="w-3 h-3" />
            <span>SaaS / Lisans</span>
          </span>
        );
      case 'SERVICE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Wrench className="w-3 h-3" />
            <span>Bölgesel Hizmet</span>
          </span>
        );
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (score >= 80) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  };

  return (
    <div id="opportunity-ledger-container" className="bg-[#121215] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Controls & Filter Bar */}
      <div className="p-5 border-b border-white/10 space-y-4 bg-[#16161a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base tracking-tight">
                Canlı Fırsat ve Arbitraj Tablosu
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-mono font-bold border border-orange-500/20">
                {items.length} Aktif Fırsat
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Canlı pazar verileri, doğrudan satın alma/satış yönlendirmeleri ve marka resmi satıcı doğrulama analizleri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Filtreleri Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Search and Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ürün, marka, ASIN veya koridor ara..."
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Asset Type Filter */}
          <div>
            <select
              value={filters.itemType || 'ALL'}
              onChange={(e) => onFilterChange({ itemType: e.target.value })}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="ALL">Tüm Varlık Türleri</option>
              <option value="PHYSICAL">📦 Fiziki Ürün Arbitrajı</option>
              <option value="SOFTWARE">💻 SaaS / Dijital Lisans</option>
              <option value="SERVICE">🔧 Bölgesel Hizmet Açığı</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category || 'ALL'}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="ALL">Tüm Kategoriler</option>
              {dynamicCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Official Seller Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer bg-[#0d0d0f] border border-white/10 rounded-xl px-3 py-2 w-full select-none hover:border-white/20 transition-colors">
              <input
                type="checkbox"
                checked={filters.noAuthorizedSellerOnly || false}
                onChange={(e) => onFilterChange({ noAuthorizedSellerOnly: e.target.checked })}
                className="rounded accent-orange-500 cursor-pointer"
              />
              <span className="text-slate-200 text-xs font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Yalnızca Resmi Satıcısız Olanlar</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-[#0d0d0f] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Fırsat & Marka</th>
              <th className="py-3.5 px-3">Tür & Kategori</th>
              <th className="py-3.5 px-3">Marka Resmi Satıcı Durumu</th>
              <th className="py-3.5 px-3">Fiyat & Koridor</th>
              <th className="py-3.5 px-3">Birim Net Kâr</th>
              <th className="py-3.5 px-3 text-center">Fırsat Skoru</th>
              <th className="py-3.5 px-4 text-right">Direkt Linkler & Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">Seçili filtrelerle eşleşen fırsat ürünü bulunamadı.</p>
                  <button
                    onClick={onResetFilters}
                    className="mt-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-orange-400 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isBrandFree = !item.authorized_reseller_exists || 
                  (item.brand_authorized_presence && !item.brand_authorized_presence.has_brand_store_in_target);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectRow(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Title & Brand */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-bold text-white group-hover:text-orange-400 transition-colors text-sm line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-300">{item.brand_or_provider}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">{item.identifier_code}</span>
                      </div>
                    </td>

                    {/* Type & Category */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div>{getItemTypeBadge(item.item_type)}</div>
                        <div className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                          {item.category}
                        </div>
                      </div>
                    </td>

                    {/* Brand Authorized Presence */}
                    <td className="py-3.5 px-3">
                      {isBrandFree ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Resmi Satıcı Yok</span>
                          </span>
                          <p className="text-[10px] text-slate-500 max-w-[170px] line-clamp-1">
                            Pazarda yetkili distribütör tekeli yok
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-medium border border-amber-500/20">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Resmi Mağaza Var</span>
                          </span>
                          <p className="text-[10px] text-slate-500 max-w-[170px] line-clamp-1">
                            Buy Box rekabeti yüksek olabilir
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Pricing Corridor */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-xs">
                        <div className="text-slate-400 text-[11px]">
                          Tedarik: <span className="text-slate-200 font-semibold">{item.source_market.price} {item.source_market.currency}</span> ({item.source_market.region})
                        </div>
                        <div className="text-slate-300 font-bold">
                          Hedef: <span className="text-orange-400">{item.target_market.price} {item.target_market.currency}</span> ({item.target_market.region})
                        </div>
                      </div>
                    </td>

                    {/* Net Profit */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono">
                        <div className="text-emerald-400 font-bold text-sm">
                          +${item.net_profit_usd.toFixed(2)}
                        </div>
                        <div className="text-emerald-400/80 text-[11px] font-medium">
                          %{item.profit_margin_pct.toFixed(0)} Kâr Marjı
                        </div>
                      </div>
                    </td>

                    {/* Opportunity Score */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold text-xs border ${getScoreBadge(item.opportunity_score)}`}>
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{item.opportunity_score.toFixed(1)}</span>
                      </span>
                    </td>

                    {/* Direct Action Links & Inspect */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.source_market?.url && (
                          <a
                            href={item.source_market.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                            title="Tedarik Kaynağına Git (Satın Al)"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                          </a>
                        )}

                        {item.target_market?.url && (
                          <a
                            href={item.target_market.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 border border-orange-500/20 transition-colors"
                            title="Hedef Pazara Git (Listele / Sat)"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                          </a>
                        )}

                        <button
                          onClick={() => onSelectRow(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-1 transition-colors ml-1"
                        >
                          <span>İncele</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Ledger Summary Footer */}
      <div className="p-4 border-t border-white/10 bg-[#16161a] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span>
            Toplam <strong className="text-white font-mono">{items.length}</strong> fırsattan{' '}
            <strong className="text-orange-400 font-mono">
              {items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, items.length)}
            </strong>{' '}
            arası gösteriliyor
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
            <span className="text-slate-500">Sayfa Başına:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-[#0f0f11] border border-white/10 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-orange-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Önceki Sayfa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded bg-[#0d0d0f] border border-white/10 font-mono text-xs text-slate-300">
            Sayfa <span className="text-orange-400 font-bold">{currentPage}</span> / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Sonraki Sayfa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
