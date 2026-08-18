import React, { useState, useMemo } from 'react';
import { OpportunityItem } from '../types';
import { calculateFullOpportunityScore } from '../utils/mathEngine';
import { 
  Calculator, 
  Save, 
  Sparkles, 
  Check, 
  Scale, 
  DollarSign, 
  Flame, 
  Package, 
  Terminal, 
  Wrench,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArbitrageCalculatorProps {
  onItemSaved?: (item: OpportunityItem) => void;
  onNavigateToMatrix?: () => void;
}

export const ArbitrageCalculator: React.FC<ArbitrageCalculatorProps> = ({ 
  onItemSaved,
  onNavigateToMatrix 
}) => {
  const { t, language } = useLanguage();

  // Form State
  const [itemType, setItemType] = useState<OpportunityItem['item_type']>('PHYSICAL');
  const [title, setTitle] = useState('Philips Sonicare Yedek Başlık 8\'li Paket');
  const [identifierCode, setIdentifierCode] = useState('B08HXK9921 / EAN-871010385');
  const [category, setCategory] = useState('Kişisel Bakım & Güzellik');
  
  // Market Variables
  const [sourcePlatform, setSourcePlatform] = useState('Trendyol TR');
  const [sourceRegion, setSourceRegion] = useState('TR');
  const [sourcePrice, setSourcePrice] = useState(380);
  const [sourceCurrency, setSourceCurrency] = useState('TRY');
  const [fxRate, setFxRate] = useState(0.029); // TRY to USD

  const [targetPlatform, setTargetPlatform] = useState('Amazon DE');
  const [targetRegion, setTargetRegion] = useState('DE');
  const [targetPrice, setTargetPrice] = useState(44.99); // In USD or EUR equivalent
  const [targetCurrency, setTargetCurrency] = useState('EUR');

  const [feeRate, setFeeRate] = useState(0.15); // 15% marketplace commission
  const [shippingCost, setShippingCost] = useState(4.5);
  const [customsCost, setCustomsCost] = useState(2.2);

  // Demand & Competition
  const [bsr, setBsr] = useState(1450);
  const [searchVolume, setSearchVolume] = useState(18000);
  const [vendorRating, setVendorRating] = useState(4.3);
  const [negativeSupportMentions, setNegativeSupportMentions] = useState(28);
  const [authorizedSellerExists, setAuthorizedSellerExists] = useState(false);

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedItem, setSavedItem] = useState<OpportunityItem | null>(null);

  // FX presets helper
  const handleCurrencyChange = (curr: string) => {
    setSourceCurrency(curr);
    switch (curr) {
      case 'TRY':
        setFxRate(0.029);
        break;
      case 'EUR':
        setFxRate(1.08);
        break;
      case 'GBP':
        setFxRate(1.28);
        break;
      case 'JPY':
        setFxRate(0.0067);
        break;
      case 'CNY':
        setFxRate(0.14);
        break;
      case 'USD':
      default:
        setFxRate(1.0);
        break;
    }
  };

  // Quick Preset Handlers
  const loadPreset = (type: 'PHYSICAL' | 'SOFTWARE' | 'SERVICE') => {
    setItemType(type);
    setSaveSuccess(false);

    if (type === 'PHYSICAL') {
      setTitle(language === 'tr' ? 'Dyson V15 HEPA Yedek Filtre (OEM Parti)' : 'Dyson V15 HEPA Replacement Filter (OEM Lot)');
      setIdentifierCode('B09J87W8K9 / EAN-502515507');
      setCategory('Ev Aletleri & Yedek Parça');
      setSourcePlatform('Trendyol / TR Toptancı Deposu');
      setSourceRegion('TR');
      setSourcePrice(1200);
      setSourceCurrency('TRY');
      setFxRate(0.029);
      setTargetPlatform('Amazon DE / Amazon EU');
      setTargetRegion('DE / EU');
      setTargetPrice(85.0);
      setTargetCurrency('EUR');
      setFeeRate(0.15);
      setShippingCost(6.5);
      setCustomsCost(3.2);
      setBsr(1420);
      setSearchVolume(18500);
      setVendorRating(4.4);
      setNegativeSupportMentions(84);
      setAuthorizedSellerExists(false);
    } else if (type === 'SOFTWARE') {
      setTitle(language === 'tr' ? 'DevTools Pro IDE Suite Çoklu Kullanıcı Lisansı' : 'DevTools Pro IDE Suite Multi-User License');
      setIdentifierCode('SW-DEVPRO-CORP-2026');
      setCategory('Geliştirici Araçları & SaaS Lisans');
      setSourcePlatform('LATAM / Regional Pricing Portal');
      setSourceRegion('LATAM / IN');
      setSourcePrice(189);
      setSourceCurrency('USD');
      setFxRate(1.0);
      setTargetPlatform('EU / US Corporate Procurement');
      setTargetRegion('EU / US');
      setTargetPrice(499);
      setTargetCurrency('USD');
      setFeeRate(0.08);
      setShippingCost(0);
      setCustomsCost(0);
      setBsr(0);
      setSearchVolume(12400);
      setVendorRating(4.1);
      setNegativeSupportMentions(168);
      setAuthorizedSellerExists(false);
    } else if (type === 'SERVICE') {
      setTitle(language === 'tr' ? 'Berlin 7/24 Acil Su Kaçağı & Notdienst Tesisat' : 'Berlin 24/7 Emergency Plumbing & Notdienst Leak Repair');
      setIdentifierCode('SRV-NOTDIENST-BERLIN-01');
      setCategory('Yerel Hizmet & Acil Onarım');
      setSourcePlatform('Yerel Usta Operasyon Maliyeti');
      setSourceRegion('Berlin / DE');
      setSourcePrice(65);
      setSourceCurrency('EUR');
      setFxRate(1.08);
      setTargetPlatform('Google Places / Notdienst Sonuçları');
      setTargetRegion('Berlin / DE');
      setTargetPrice(240);
      setTargetCurrency('EUR');
      setFeeRate(0.10);
      setShippingCost(0);
      setCustomsCost(0);
      setBsr(0);
      setSearchVolume(4800);
      setVendorRating(2.1);
      setNegativeSupportMentions(430);
      setAuthorizedSellerExists(false);
    }
  };

  // Live Score Computation using PRD Math Engine
  const calculatedResult = useMemo(() => {
    const res = calculateFullOpportunityScore({
      item_type: itemType,
      target_price: targetPrice,
      source_price: sourcePrice,
      fx_rate: fxRate,
      marketplace_fee_rate: feeRate,
      shipping_cost: itemType === 'PHYSICAL' ? shippingCost : 0,
      customs_cost: itemType === 'PHYSICAL' ? customsCost : 0,
      bsr: itemType === 'PHYSICAL' ? bsr : undefined,
      search_volume: searchVolume,
      negative_mentions: negativeSupportMentions,
      total_mentions: Math.max(negativeSupportMentions + 20, 80),
      authorized_seller_exists: authorizedSellerExists,
      avg_vendor_rating: vendorRating,
    });

    const monthlyPotential = Math.round(res.net_profit_usd * res.estimated_monthly_sales);
    const unmetNeed = res.suns_score || res.sogi_score || 75;

    return {
      ...res,
      monthly_potential_revenue_usd: monthlyPotential,
      unmet_need_score: unmetNeed
    };
  }, [
    itemType,
    targetPrice,
    sourcePrice,
    fxRate,
    feeRate,
    shippingCost,
    customsCost,
    bsr,
    searchVolume,
    negativeSupportMentions,
    authorizedSellerExists,
    vendorRating
  ]);

  const handleSaveOpportunity = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const newItem: OpportunityItem = {
      id: `opp-calc-${Date.now()}`,
      item_type: itemType,
      title,
      brand_or_provider: title.split(' ')[0] || 'Vantage Verified',
      identifier_code: identifierCode,
      category,
      source_market: {
        platform_name: sourcePlatform,
        region: sourceRegion,
        price: sourcePrice,
        currency: sourceCurrency,
        seller_name: 'Bağımsız Satıcı / Tedarikçi',
        is_authorized_seller: false,
      },
      target_market: {
        platform_name: targetPlatform,
        region: targetRegion,
        price: targetPrice,
        currency: targetCurrency,
        seller_name: 'Pazaryeri Satıcıları',
        is_authorized_seller: authorizedSellerExists,
        rank_or_bsr: itemType === 'PHYSICAL' ? bsr : undefined,
        rating: vendorRating,
      },
      shipping_cost_usd: itemType === 'PHYSICAL' ? shippingCost : 0,
      customs_cost_usd: itemType === 'PHYSICAL' ? customsCost : 0,
      marketplace_fee_rate: feeRate,
      fx_rate: fxRate,
      sentiment: {
        source_platform: 'Arbitrage Lab Simulator & Live Telemetry',
        search_volume: searchVolume,
        negative_support_mentions: negativeSupportMentions,
        total_support_mentions: 100,
        unmet_need_score: calculatedResult.unmet_need_score,
      },
      net_profit_usd: calculatedResult.net_profit_usd,
      profit_margin_pct: calculatedResult.profit_margin_pct,
      estimated_monthly_sales: calculatedResult.estimated_monthly_sales,
      monthly_potential_revenue_usd: calculatedResult.monthly_potential_revenue_usd,
      opportunity_score: calculatedResult.opportunity_score,
      authorized_reseller_exists: authorizedSellerExists,
      competition_level: calculatedResult.opportunity_score > 85 ? 'DÜŞÜK' : 'ORTA',
      risk_level: 'DÜŞÜK',
      risk_factors: [
        'Arbitrage Lab simülasyon çıktısı: Döviz kur dalgalanmalarını izleyin.',
        'Lojistik ve gümrük beyanlarını tam tutunuz.'
      ],
      tactical_playbook: [
        'İlk test siparişini 25-50 adetlik pilot partiyle başlatın.',
        'Hedef pazaryerinde Buy Box optimizasyonu sağlayarak %40+ marjı koruyun.'
      ],
      historical_price_trend: [
        { month: 'Oca', source_price: sourcePrice * 0.95, target_price: targetPrice * 0.95, net_profit: calculatedResult.net_profit_usd * 0.9 },
        { month: 'Şub', source_price: sourcePrice, target_price: targetPrice * 0.98, net_profit: calculatedResult.net_profit_usd * 0.95 },
        { month: 'Mar', source_price: sourcePrice, target_price: targetPrice, net_profit: calculatedResult.net_profit_usd },
        { month: 'Nis', source_price: sourcePrice, target_price: targetPrice * 1.05, net_profit: calculatedResult.net_profit_usd * 1.08 }
      ],
      scraper_telemetry: {
        tor_node_ip: '185.220.101.54 (Simulator Node)',
        tor_country: 'DE',
        last_scraped_at: 'Şimdi (Arbitrage Lab)',
        playwright_fingerprint: 'Playwright Stealth Custom v2.4',
        confidence_score: 98.8
      }
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setSavedItem(data.item || newItem);
        if (onItemSaved) {
          onItemSaved(data.item || newItem);
        }
      }
    } catch (err) {
      console.error('Failed to save opportunity:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="arbitrage-calculator-container" className="space-y-6">
      {/* Header & Quick Demo Presets */}
      <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-400" />
              <h2 className="text-white font-semibold text-base tracking-tight">
                {t.calcHeader}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.calcSub}
            </p>
          </div>

          {/* Type Selector Pills */}
          <div className="flex items-center gap-2 bg-[#0C0C0D] p-1.5 rounded-lg border border-white/5">
            <button
              onClick={() => loadPreset('PHYSICAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                itemType === 'PHYSICAL' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.physicalTag}</span>
            </button>
            <button
              onClick={() => loadPreset('SOFTWARE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                itemType === 'SOFTWARE' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{t.softwareTag}</span>
            </button>
            <button
              onClick={() => loadPreset('SERVICE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                itemType === 'SERVICE' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{t.serviceTag}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Model Presets */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{t.calcPresets}</span>
          </span>

          <button
            onClick={() => loadPreset('PHYSICAL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
              itemType === 'PHYSICAL'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            {t.calcPresetPhysical}
          </button>

          <button
            onClick={() => loadPreset('SOFTWARE')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
              itemType === 'SOFTWARE'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            {t.calcPresetSoftware}
          </button>

          <button
            onClick={() => loadPreset('SERVICE')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
              itemType === 'SERVICE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            {t.calcPresetService}
          </button>
        </div>
      </div>

      {/* Main Two-Column Grid: Form Inputs & Live Score Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Inputs Form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Block 1: Identification & Market Variables */}
          <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-white font-medium text-xs border-b border-white/5 pb-2 text-slate-300">
              {t.calcSection1}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcTitleInput}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcIdentifierInput}</label>
                <input
                  type="text"
                  value={identifierCode}
                  onChange={(e) => setIdentifierCode(e.target.value)}
                  className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcCategoryInput}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Source Market Details */}
              <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-orange-400 font-mono uppercase font-bold">{t.sourceMarket}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-mono">Döviz:</span>
                    {['TRY', 'EUR', 'USD', 'GBP', 'CNY'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleCurrencyChange(c)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          sourceCurrency === c ? 'bg-orange-500 text-white font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcSourcePlatform}</label>
                  <input
                    type="text"
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcSourcePrice} ({sourceCurrency})</label>
                    <input
                      type="number"
                      value={sourcePrice}
                      onChange={(e) => setSourcePrice(Number(e.target.value))}
                      className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcFxRate} (→ USD)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={fxRate}
                      onChange={(e) => setFxRate(Number(e.target.value))}
                      className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Target Market Details */}
              <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-blue-400 font-mono uppercase font-bold">{t.targetMarket}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-mono">Para:</span>
                    {['EUR', 'USD', 'GBP'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTargetCurrency(c)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          targetCurrency === c ? 'bg-blue-500 text-white font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcTargetPlatform}</label>
                  <input
                    type="text"
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcTargetPrice} ($ / {targetCurrency})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{t.calcFeeRate} (Komisyon)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={feeRate}
                      onChange={(e) => setFeeRate(Number(e.target.value))}
                      className="w-full bg-[#161618] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Customs (Only relevant for Physical goods) */}
              {itemType === 'PHYSICAL' ? (
                <>
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcShipping} ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcCustoms} ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customsCost}
                      onChange={(e) => setCustomsCost(Number(e.target.value))}
                      className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2 p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {itemType === 'SOFTWARE' 
                      ? 'Dijital lisans satışı olduğu için kargo ve gümrük maliyetleri sıfırdır ($0).'
                      : 'Bölgesel hizmet modeli olduğu için fiziksel kargo ve gümrük maliyetleri sıfırdır ($0).'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Block 2: Demand & Competition Variables */}
          <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-white font-medium text-xs border-b border-white/5 pb-2 text-slate-300">
              {t.calcSection2}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {itemType === 'PHYSICAL' && (
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcBsr}</label>
                  <input
                    type="number"
                    value={bsr}
                    onChange={(e) => setBsr(Number(e.target.value))}
                    className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcSearchVolume}</label>
                <input
                  type="number"
                  value={searchVolume}
                  onChange={(e) => setSearchVolume(Number(e.target.value))}
                  className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">{t.calcVendorRating}</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={vendorRating}
                  onChange={(e) => setVendorRating(Number(e.target.value))}
                  className="w-full bg-[#0C0C0D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Authorized Seller Barrier Toggle */}
            <div className="pt-2">
              <label className="text-[11px] text-slate-400 mb-2 block font-medium">{t.calcAuthBarrierLabel}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAuthorizedSellerExists(false)}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    !authorizedSellerExists
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-[#0C0C0D] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-xs">{t.calcAuthBarrierNo}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthorizedSellerExists(true)}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    authorizedSellerExists
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#0C0C0D] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="text-xs">{t.calcAuthBarrierYes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-Time Score Board & Direct Publication */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#161618] to-orange-950/20 border border-orange-500/30 rounded-xl p-6 shadow-2xl space-y-6 sticky top-24">
            {/* Top Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold">
                  {t.calcOutputHeader}
                </span>
                <div className="text-3xl font-black font-mono text-white flex items-center gap-2 mt-1">
                  <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{calculatedResult.opportunity_score} <span className="text-sm font-normal text-slate-500">/ 100</span></span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold">
                OS SCORE
              </div>
            </div>

            {/* Key Output Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0C0C0D] p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-sans">{t.calcUnitProfit}</span>
                <div className="text-lg font-bold text-emerald-400">
                  +${calculatedResult.net_profit_usd.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-500/80 font-sans">
                  {t.calcProfitMargin} %{calculatedResult.profit_margin_pct.toFixed(1)}
                </div>
              </div>

              <div className="bg-[#0C0C0D] p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-sans">{t.calcEstSales}</span>
                <div className="text-lg font-bold text-white">
                  {calculatedResult.estimated_monthly_sales} {t.unitsMonth}
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  {t.calcMonthlyRev} ${(calculatedResult.monthly_potential_revenue_usd || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Weight Breakdown */}
            <div className="bg-[#0C0C0D] p-4 rounded-xl border border-white/5 text-xs space-y-2">
              <span className="text-[11px] text-slate-400 font-medium block">{t.calcMathWeights}</span>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span>{t.calcWeightProfit}</span>
                  <span className="text-white font-bold">{(calculatedResult.breakdown.norm_profit * 100).toFixed(0)} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.calcWeightSales}</span>
                  <span className="text-white font-bold">{(calculatedResult.breakdown.norm_sales * 100).toFixed(0)} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.calcWeightAuth}</span>
                  <span className="text-emerald-400 font-bold">{authorizedSellerExists ? '40 / 100 (Bariyer)' : '100 / 100 (Serbest)'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.calcWeightDomain}</span>
                  <span className="text-orange-400 font-bold">{(calculatedResult.breakdown.domain_score_norm * 100).toFixed(0)} / 100</span>
                </div>
              </div>
            </div>

            {/* Save & Publish Button & Direct Navigation */}
            <div className="space-y-2.5">
              <button
                id="calculator-save-btn"
                onClick={handleSaveOpportunity}
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t.calcSavedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                    <span>{isSaving ? 'Kaydediliyor...' : t.calcSaveBtn}</span>
                  </>
                )}
              </button>

              {saveSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <p className="text-xs text-emerald-400 font-medium">
                    {t.calcSavedNotice}
                  </p>
                  {onNavigateToMatrix && (
                    <button
                      onClick={onNavigateToMatrix}
                      className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.calcInspectSaved}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
