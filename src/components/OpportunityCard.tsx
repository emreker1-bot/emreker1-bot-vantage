import React from 'react';
import { OpportunityItem } from '../types';
import { 
  Package, 
  Terminal, 
  Wrench, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OpportunityCardProps {
  item: OpportunityItem;
  onSelect: (item: OpportunityItem) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ item, onSelect }) => {
  const { t } = useLanguage();

  const getItemTypeConfig = () => {
    switch (item.item_type) {
      case 'PHYSICAL':
        return {
          icon: <Package className="w-3.5 h-3.5" />,
          label: 'Fiziki Arbitraj',
          badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          scoreBadge: 'bg-orange-500 text-white',
        };
      case 'SOFTWARE':
        return {
          icon: <Terminal className="w-3.5 h-3.5" />,
          label: 'SaaS / Lisans Arbitrajı',
          badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          scoreBadge: 'bg-blue-500 text-white',
        };
      case 'SERVICE':
        return {
          icon: <Wrench className="w-3.5 h-3.5" />,
          label: 'Bölgesel Hizmet Açığı',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          scoreBadge: 'bg-emerald-500 text-white',
        };
    }
  };

  const config = getItemTypeConfig();

  // Brand Official Seller status badge with visual shield indicator
  const renderBrandAuthorizationBadge = () => {
    const isFree = !item.authorized_reseller_exists || 
      (item.brand_authorized_presence && !item.brand_authorized_presence.has_brand_store_in_target);

    const verifiedAt = item.brand_authorized_presence?.verified_at;
    const gapLevel = item.brand_authorized_presence?.distributor_gap_level || (isFree ? 'TAM_ACIK' : 'KORUMALI');

    if (isFree) {
      return (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 shadow-sm shadow-emerald-950/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Resmi Marka Satıcısı Yok</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-200 uppercase font-mono">
              {gapLevel === 'TAM_ACIK' ? 'Serbest Giriş' : 'Açık'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 pl-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Hedef pazarda yetkili tekel yok; Buy Box 3P satıcılara açık</span>
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/30">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Resmi Marka Mağazası Mevcut</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-200 uppercase font-mono">
            Korumalı
          </span>
        </div>
        <p className="text-[10px] text-slate-400 pl-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Marka doğrudan satıyor; rekabet ve fiyat kırma gerekebilir</span>
        </p>
      </div>
    );
  };

  return (
    <div 
      id={`spotlight-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="bg-[#131316] hover:bg-[#18181c] border border-white/10 hover:border-orange-500/40 rounded-xl p-5 transition-all shadow-lg hover:shadow-2xl cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Card Top Meta */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${config.badgeClass}`}>
                {config.icon}
                <span>{config.label}</span>
              </span>
              {item.scraper_telemetry?.is_live_scraped && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Canlı Veri
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              <span className="text-slate-300 font-semibold">{item.brand_or_provider}</span> • <span className="font-mono text-[11px] text-slate-500">{item.identifier_code}</span>
            </p>
          </div>

          <div className={`${config.scoreBadge} px-2.5 py-1.5 rounded-lg shadow font-mono font-bold text-xs flex items-center gap-1 shrink-0`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>OS: {item.opportunity_score.toFixed(1)}</span>
          </div>
        </div>

        {/* Brand Authorization Verification Pill */}
        <div className="mb-3.5">
          {renderBrandAuthorizationBadge()}
        </div>

        {/* Pricing Corridor Box */}
        <div className="bg-[#0b0b0d] rounded-lg p-3 border border-white/5 space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Tedarik / Kaynak:</span>
            <span className="text-slate-200 font-semibold">
              {item.source_market.region} • <span className="font-mono text-white">{item.source_market.price} {item.source_market.currency}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Hedef Satış:</span>
            <span className="text-slate-200 font-semibold">
              {item.target_market.region} • <span className="font-mono text-orange-400 font-bold">{item.target_market.price} {item.target_market.currency}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom: Financials & Direct Links */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Birim Net Kâr</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-emerald-400 font-bold text-lg font-mono">
                +${item.net_profit_usd.toFixed(2)}
              </span>
              <span className="text-emerald-400/80 text-xs font-semibold">
                (%{item.profit_margin_pct.toFixed(0)})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Aylık Tahmini Ciro</span>
            <span className="text-white font-bold text-sm font-mono">
              ${(item.monthly_potential_revenue_usd || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Direct Action Links */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {item.source_market?.url && (
            <a
              href={item.source_market.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="Kaynak pazar satın alma/tedarik bağlantısı"
            >
              <ShoppingCart className="w-3 h-3 text-orange-400" />
              <span className="truncate">Tedarik Et / Al</span>
            </a>
          )}

          {item.target_market?.url && (
            <a
              href={item.target_market.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 border border-orange-500/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="Hedef pazar listeleme ve pazar yeri bağlantısı"
            >
              <ExternalLink className="w-3 h-3 text-orange-400" />
              <span className="truncate">Pazarda Sat</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
