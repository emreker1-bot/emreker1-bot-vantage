import React, { useState } from 'react';
import { OpportunityItem } from '../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Code2, 
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ExportModalProps {
  items: OpportunityItem[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ items, onClose }) => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [copied, setCopied] = useState(false);

  // Generate CSV string
  const generateCSV = (): string => {
    const headers = [
      'ID',
      'Title',
      'ItemType',
      'IdentifierCode',
      'Category',
      'SourcePlatform',
      'SourceRegion',
      'SourcePrice',
      'SourceCurrency',
      'TargetPlatform',
      'TargetRegion',
      'TargetPrice',
      'TargetCurrency',
      'NetProfitUSD',
      'ProfitMarginPct',
      'EstimatedMonthlySales',
      'MonthlyRevenueUSD',
      'OpportunityScore',
      'AuthorizedResellerExists',
      'TorExitNode'
    ];

    const rows = items.map(item => [
      `"${item.id}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.item_type}"`,
      `"${item.identifier_code}"`,
      `"${item.category}"`,
      `"${item.source_market.platform_name}"`,
      `"${item.source_market.region}"`,
      item.source_market.price,
      `"${item.source_market.currency}"`,
      `"${item.target_market.platform_name}"`,
      `"${item.target_market.region}"`,
      item.target_market.price,
      `"${item.target_market.currency}"`,
      item.net_profit_usd,
      item.profit_margin_pct,
      item.estimated_monthly_sales,
      item.monthly_potential_revenue_usd,
      item.opportunity_score,
      item.authorized_reseller_exists ? 'YES' : 'NO',
      `"${item.scraper_telemetry.tor_node_ip}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // Generate JSON string
  const generateJSON = (): string => {
    return JSON.stringify(items, null, 2);
  };

  const currentContent = format === 'csv' ? generateCSV() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([currentContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vantage_intelligence_export_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="export-modal"
        className="bg-[#161618] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0C0C0D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-400" />
            <h2 className="text-white font-semibold text-sm tracking-tight">
              {t.exportTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-300">
          {/* Format Chooser */}
          <div>
            <label className="text-[11px] text-slate-400 mb-2 block font-medium">
              {t.exportFormatChoice} ({items.length} {t.exportRecordsCount})
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  format === 'csv'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-semibold'
                    : 'bg-[#0C0C0D] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t.exportCsv}</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  format === 'json'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-semibold'
                    : 'bg-[#0C0C0D] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>{t.exportJson}</span>
              </button>
            </div>
          </div>

          {/* Code Preview */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Önizleme ({format.toUpperCase()}):</span>
            <pre className="w-full bg-[#0C0C0D] border border-white/10 rounded-xl p-3.5 text-[11px] text-slate-300 font-mono max-h-48 overflow-auto whitespace-pre leading-relaxed">
              {currentContent.slice(0, 1500) + (currentContent.length > 1500 ? '\n... (Kalan satırlar indirilen dosyada)' : '')}
            </pre>
          </div>

          <p className="text-[10px] text-slate-500">
            {t.exportDisclaimer}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-white/5 bg-[#0C0C0D] flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copied : t.exportCopyBtn}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-md shadow-orange-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportDownloadBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
