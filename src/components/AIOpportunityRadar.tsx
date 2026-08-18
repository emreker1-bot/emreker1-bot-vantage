import React, { useState } from 'react';
import { OpportunityItem } from '../types';
import { 
  Sparkles, 
  Search, 
  Flame, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Terminal, 
  Wrench, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AIOpportunityRadarProps {
  onSelectOpportunity: (item: OpportunityItem) => void;
  onOpportunityDiscovered?: (item: OpportunityItem) => void;
}

export const AIOpportunityRadar: React.FC<AIOpportunityRadarProps> = ({
  onSelectOpportunity,
  onOpportunityDiscovered
}) => {
  const { t, language } = useLanguage();
  const [scanMode, setScanMode] = useState<'grounded_live' | 'strategic_radar'>('grounded_live');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredItems, setDiscoveredItems] = useState<OpportunityItem[]>([]);
  const [groundingSources, setGroundingSources] = useState<Array<{ title?: string; uri?: string }>>([]);
  const [strategyReport, setStrategyReport] = useState<string | null>(null);

  const presets = [
    'Dyson Saç Şekillendirici & Süpürge TR-DE Arbitrajı',
    'Philips Hue & Akıllı Ev Aydınlatma Serisi',
    'Stanley & Yeti Termos Kategorisi TR/DE Fiyat Farkı',
    'DeWalt & Bosch Profesyonel El Aletleri B2B Arbitrajı',
  ];

  const handleRunRadar = async (searchPrompt?: string) => {
    const activeQuery = searchPrompt || prompt;
    if (!activeQuery.trim()) return;

    setIsLoading(true);
    setStrategyReport(null);
    setGroundingSources([]);

    try {
      if (scanMode === 'grounded_live') {
        const res = await fetch('/api/market/live-search-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: activeQuery,
            sourceRegion: 'Türkiye (Trendyol/Hepsiburada/Amazon TR)',
            targetRegion: 'Almanya (Amazon DE/eBay DE)',
            category: 'Tüm Kategoriler'
          })
        });

        const data = await res.json();
        if (data.success && data.items && data.items.length > 0) {
          setDiscoveredItems(data.items);
          if (data.groundingSources) {
            setGroundingSources(data.groundingSources);
          }
          if (data.searchSummary) {
            setStrategyReport(data.searchSummary);
          }
          if (onOpportunityDiscovered) {
            data.items.forEach((it: OpportunityItem) => onOpportunityDiscovered(it));
          }
        }
      } else {
        const res = await fetch('/api/ai/discover-opportunities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: activeQuery,
            query: activeQuery,
            category: 'Tüm Kategoriler',
            region: 'Global'
          })
        });

        const data = await res.json();
        if (data.success && data.items && data.items.length > 0) {
          setDiscoveredItems(data.items);
          if (data.strategy_report) {
            setStrategyReport(data.strategy_report);
          }
          if (onOpportunityDiscovered) {
            data.items.forEach((it: OpportunityItem) => onOpportunityDiscovered(it));
          }
        }
      }
    } catch (err) {
      console.error('AI Radar error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-opportunity-radar-container" className="space-y-6">
      {/* Header & Prompt Box */}
      <div className="bg-gradient-to-br from-[#161618] to-orange-950/20 border border-orange-500/30 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base tracking-tight">
                {t.aiRadarHeader}
              </h2>
              <p className="text-xs text-slate-400">
                {t.aiRadarSub}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0C0C0D] p-1 rounded-lg border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setScanMode('grounded_live')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                scanMode === 'grounded_live' 
                  ? 'bg-orange-500 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Web Canlı Arama (Grounding)</span>
            </button>
            <button
              type="button"
              onClick={() => setScanMode('strategic_radar')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                scanMode === 'strategic_radar' 
                  ? 'bg-orange-500 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stratejik Pazar Modeli</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <textarea
            id="ai-radar-textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.aiRadarPromptPlaceholder}
            className="w-full bg-[#0C0C0D] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-none font-sans leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-3">
            {/* Presets List */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
              <span className="font-semibold text-slate-500 uppercase text-[10px]">{t.aiRadarPresetsLabel}</span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(preset);
                    handleRunRadar(preset);
                  }}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-orange-500/10 hover:text-orange-300 border border-white/5 transition-colors cursor-pointer text-left truncate max-w-xs"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              id="ai-radar-run-btn"
              onClick={() => handleRunRadar()}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? t.aiRadarScanning : t.aiRadarRunBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Items Section */}
      {discoveredItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{t.aiRadarResultsTitle}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1">
              <FileCheck2 className="w-3 h-3" />
              <span>{t.aiRadarAddedToDb} ({discoveredItems.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveredItems.map((item) => (
              <div
                key={item.id}
                id={`radar-item-${item.id}`}
                onClick={() => onSelectOpportunity(item)}
                className="bg-[#161618] border border-orange-500/20 hover:border-orange-500/40 rounded-xl p-5 shadow-xl cursor-pointer flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold">
                      {item.item_type}
                    </span>
                    <div className="px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-mono font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>OS: {item.opportunity_score}</span>
                    </div>
                  </div>

                  <h4 className="text-white font-medium text-xs group-hover:text-orange-200 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {item.identifier_code} • {item.brand_or_provider}
                  </p>

                  {/* Route & Net Profit */}
                  <div className="bg-[#0C0C0D] rounded-lg p-3 border border-white/5 my-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>{item.source_market.region} ({item.source_market.price} {item.source_market.currency})</span>
                      <span>➔</span>
                      <span>{item.target_market.region} ({item.target_market.price} {item.target_market.currency})</span>
                    </div>
                    <div className="flex justify-between font-mono font-bold text-emerald-400 pt-1 border-t border-white/5">
                      <span>Birim Net Kar:</span>
                      <span>+${item.net_profit_usd.toFixed(2)} (%{item.profit_margin_pct})</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`radar-inspect-btn-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOpportunity(item);
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/5"
                >
                  <span>{t.inspectOpportunity}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Grounding URL Sources */}
          {groundingSources && groundingSources.length > 0 && (
            <div className="bg-[#161618] border border-orange-500/20 rounded-xl p-4 space-y-2">
              <h4 className="text-white font-semibold text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Doğrulanan Canlı Web Kaynakları (Google Search Grounding):</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 border border-white/10 text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <span>{source.title || source.uri}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Strategic Assessment Report */}
          {strategyReport && (
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 text-xs text-slate-300 space-y-2">
              <h4 className="text-white font-semibold text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.aiRadarReportTitle}</span>
              </h4>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 bg-[#0C0C0D] p-3.5 rounded-lg border border-white/5 leading-relaxed">
                {strategyReport}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
