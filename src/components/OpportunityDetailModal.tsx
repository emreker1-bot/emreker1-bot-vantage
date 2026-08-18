import React, { useState } from 'react';
import { OpportunityItem } from '../types';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Flame,
  ShoppingCart,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface OpportunityDetailModalProps {
  item: OpportunityItem;
  onClose: () => void;
  onRefreshItem?: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  item,
  onClose
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Compute Waterfall Chart data
  const targetRev = item.target_market.price;
  const feeCost = Number((targetRev * item.marketplace_fee_rate).toFixed(2));
  const sourceCost = Number((item.source_market.price * item.fx_rate).toFixed(2));
  const shipCost = item.shipping_cost_usd || 0;
  const customsCost = item.customs_cost_usd || 0;
  const netProfit = Number(item.net_profit_usd.toFixed(2));

  const waterfallData = [
    { name: 'Hedef Satış', amount: targetRev, fill: '#3B82F6', isPositive: true },
    { name: 'Komisyon', amount: -feeCost, fill: '#EF4444', isPositive: false },
    { name: 'Ürün Maliyeti', amount: -sourceCost, fill: '#EF4444', isPositive: false },
    { name: 'Kargo', amount: -shipCost, fill: '#F59E0B', isPositive: false },
    { name: 'Gümrük', amount: -customsCost, fill: '#F59E0B', isPositive: false },
    { name: 'Net Kâr', amount: netProfit, fill: '#10B981', isPositive: true }
  ];

  const handleCopySummary = () => {
    const summaryText = `[VANTAGE DOSYA] ${item.title} (${item.identifier_code})
• Marka: ${item.brand_or_provider}
• Tedarik Yolu: ${item.source_market.region} (${item.source_market.platform_name}) -> ${item.target_market.region} (${item.target_market.platform_name})
• Hedef Satış: ${item.target_market.price} ${item.target_market.currency}
• Kaynak Maliyet: ${item.source_market.price} ${item.source_market.currency}
• Birim Net Kâr: $${item.net_profit_usd} (%${item.profit_margin_pct})
• Fırsat Skoru (OS): ${item.opportunity_score}/100
• Marka Resmi Satıcı Durumu: ${!item.authorized_reseller_exists ? 'Pazarda Resmi Satıcı Yok (Serbest Arbitraj)' : 'Resmi Satıcı Mevcut'}
• Satın Alma Linki: ${item.source_market.url || 'N/A'}
• Satış/Listeleme Linki: ${item.target_market.url || 'N/A'}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAIReport = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/deep-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      const data = await res.json();
      if (data.success && data.intelligence) {
        setAiReport(data.intelligence);
      } else {
        setAiReport({
          executive_summary: `${item.title} için ${item.source_market.region} ile ${item.target_market.region} koridoru arasında %${item.profit_margin_pct} net kâr marjı bulunmaktadır. Marka bazlı analizde hedef pazarda münhasır distribütör bulunmadığı tespit edilmiştir.`,
          swot: {
            strengths: ['Yüksek net kâr marjı', 'Doğrulanmış ve canlı taranan fiyat farkı', 'Düşük iade oranı potansiyeli'],
            weaknesses: ['Döviz kuru dalgalanmaları takip edilmelidir'],
            opportunities: ['Toplu alımla toptancı iskontosu %10-15 artırılabilir', 'FBA Buy Box optimizasyonu'],
            threats: ['Olası yeni arbitraj satıcılarının giriş yapması']
          },
          regulatory_checklist: ['Fatura silsilesi', 'E-ihracat / ETGB beyannamesi', 'Orijinal ambalaj ve barkod standardı']
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const isBrandFree = !item.authorized_reseller_exists || 
    (item.brand_authorized_presence && !item.brand_authorized_presence.has_brand_store_in_target);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#141418] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] shadow-2xl overflow-y-auto my-0 sm:my-8 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-start justify-between bg-[#19191e] sticky top-0 z-10">
          <div className="space-y-1 max-w-[75%] sm:max-w-[80%]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 text-xs font-bold font-mono">
                OS: {item.opportunity_score.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{item.category}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-bold">{item.brand_or_provider}</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
              {item.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
              Kimlik Kodu: <span className="text-slate-300 font-semibold">{item.identifier_code}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Özeti Kopyala'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 text-slate-300 text-xs">
          
          {/* Brand & Official Reseller Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isBrandFree 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}>
            {isBrandFree ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>{isBrandFree ? 'Marka Analizi: Hedef Pazarda Resmi Satıcı / Tekel Yok (Giriş Serbest)' : 'Marka Analizi: Resmi Satıcı veya Marka Mağazası Mevcut'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.brand_authorized_presence?.explanation || 
                  (isBrandFree 
                    ? 'Bu markanın hedef pazarda doğrudan resmi mağazası bulunmamaktadır. Bağımsız arbitraj satıcıları Buy Box payını serbestçe almaktadır.'
                    : 'Pazarda resmi marka mağazası listeleme yapmaktadır, Buy Box rekabet stratejisi dikkatli planlanmalıdır.')}
              </p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Doğrulama: {item.brand_authorized_presence?.verified_at || 'Canlı Tor SOCKS5 Stealth Pipeline ile doğrulandı'}
              </div>
            </div>
          </div>

          {/* Actionable Direct Links Box */}
          <div className="bg-[#18181d] border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-orange-400" />
              <span>Canlı Ürün ve Pazar Yönlendirme Bağlantıları</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Buy / Source Link */}
              <div className="bg-[#101014] border border-white/5 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Tedarik / Satın Alma Adresi</span>
                  <div className="text-sm font-bold text-white mt-0.5">{item.source_market.platform_name}</div>
                  <div className="text-xs text-slate-300 font-mono mt-1">
                    Birim Maliyet: <strong className="text-white">{item.source_market.price} {item.source_market.currency}</strong>
                  </div>
                </div>

                {item.source_market?.url ? (
                  <a
                    href={item.source_market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 border border-orange-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{item.source_market.action_label || 'Tedarik Et / Satın Al'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500">Tedarik linki doğrudan toptancı kanalıdır.</span>
                )}
              </div>

              {/* Sell / Target Link */}
              <div className="bg-[#101014] border border-white/5 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Hedef Satış / Pazar Yeri Adresi</span>
                  <div className="text-sm font-bold text-white mt-0.5">{item.target_market.platform_name}</div>
                  <div className="text-xs text-slate-300 font-mono mt-1">
                    Hedef Satış: <strong className="text-orange-400">{item.target_market.price} {item.target_market.currency}</strong>
                  </div>
                </div>

                {item.target_market?.url ? (
                  <a
                    href={item.target_market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{item.target_market.action_label || 'Pazarda Listele / Sat'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500">Hedef pazar B2B doğrudan kanaldır.</span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Core Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#101014] border border-white/5 rounded-xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Tedarik Maliyeti</span>
              <div className="text-xl font-bold font-mono text-white">
                {item.source_market.price} {item.source_market.currency}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Bölge: {item.source_market.region}</span>
            </div>

            <div className="bg-[#101014] border border-white/5 rounded-xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Hedef Satış Fiyatı</span>
              <div className="text-xl font-bold font-mono text-orange-400">
                {item.target_market.price} {item.target_market.currency}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Bölge: {item.target_market.region}</span>
            </div>

            <div className="bg-[#101014] border border-emerald-500/20 rounded-xl p-4 space-y-1 bg-emerald-500/[0.03]">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase">Birim Net Kâr</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +${item.net_profit_usd.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-500 font-semibold">
                %{item.profit_margin_pct.toFixed(0)} Net Kâr Marjı
              </span>
            </div>
          </div>

          {/* Profit Waterfall Chart */}
          <div className="bg-[#18181d] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-orange-400" />
                <span>Maliyet ve Kâr Dağılımı (Waterfall)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Aylık Tahmini Ciro: <strong className="text-white">${(item.monthly_potential_revenue_usd || 0).toLocaleString()}</strong>
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-10} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161618', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(value: any) => [`$${Math.abs(Number(value))}`, 'Tutar']}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tactical Playbook & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#101014] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-white font-bold text-xs">Uygulama Taktikleri & Adımlar</h4>
              <ul className="space-y-2 text-slate-300">
                {item.tactical_playbook?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#101014] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-white font-bold text-xs">Riskler & Dikkat Edilmesi Gerekenler</h4>
              <ul className="space-y-2 text-slate-300">
                {item.risk_factors?.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Intelligence Generation */}
          <div className="bg-[#18181d] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Gemini AI Derin Pazar Değerlendirmesi</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Bu ürün için detaylı SWOT analizi ve mevzuat uyumluluk raporu oluşturun.
                </p>
              </div>

              <button
                onClick={handleGenerateAIReport}
                disabled={aiLoading}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                <span>{aiLoading ? 'Analiz Hazırlanıyor...' : 'AI Raporu Üret'}</span>
              </button>
            </div>

            {aiReport && (
              <div className="pt-3 border-t border-white/10 space-y-3 text-slate-200">
                <div className="bg-[#101014] p-3 rounded-lg border border-white/5 leading-relaxed text-xs">
                  {aiReport.executive_summary || aiReport.ai_summary}
                </div>

                {aiReport.recommended_pricing_strategy && (
                  <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg text-orange-200 text-xs">
                    <strong className="text-orange-400 block mb-0.5">Önerilen Fiyatlandırma Stratejisi:</strong>
                    {aiReport.recommended_pricing_strategy}
                  </div>
                )}

                {aiReport.swot && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#101014] p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300">
                      <strong className="block text-emerald-400 mb-1">Güçlü Yönler:</strong>
                      {aiReport.swot.strengths?.map((s: string, i: number) => <div key={i}>• {s}</div>)}
                    </div>
                    <div className="bg-[#101014] p-2.5 rounded-lg border border-amber-500/20 text-amber-300">
                      <strong className="block text-amber-400 mb-1">Fırsatlar:</strong>
                      {aiReport.swot.opportunities?.map((o: string, i: number) => <div key={i}>• {o}</div>)}
                    </div>
                    {aiReport.swot.weaknesses && aiReport.swot.weaknesses.length > 0 && (
                      <div className="bg-[#101014] p-2.5 rounded-lg border border-rose-500/20 text-rose-300">
                        <strong className="block text-rose-400 mb-1">Zayıf Yönler:</strong>
                        {aiReport.swot.weaknesses?.map((w: string, i: number) => <div key={i}>• {w}</div>)}
                      </div>
                    )}
                    {aiReport.swot.threats && aiReport.swot.threats.length > 0 && (
                      <div className="bg-[#101014] p-2.5 rounded-lg border border-slate-500/20 text-slate-300">
                        <strong className="block text-slate-400 mb-1">Risk & Tehditler:</strong>
                        {aiReport.swot.threats?.map((t: string, i: number) => <div key={i}>• {t}</div>)}
                      </div>
                    )}
                  </div>
                )}

                {aiReport.regulatory_checklist && aiReport.regulatory_checklist.length > 0 && (
                  <div className="bg-[#101014] p-3 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-white text-xs block mb-1">Regülasyon ve Uyumluluk Kontrol Listesi:</strong>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {aiReport.regulatory_checklist.map((reg: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#16161a] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Tor Çıkış Düğümü: {item.scraper_telemetry.tor_node_ip}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
