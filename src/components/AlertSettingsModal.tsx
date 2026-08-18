import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Volume2, 
  Sliders, 
  Check, 
  AlertTriangle,
  Zap,
  Sparkles,
  ArrowRight,
  Send,
  CheckCheck
} from 'lucide-react';
import { AlertRule, AlertNotification, ItemType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOpportunity?: (itemId: string) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  onSelectOpportunity
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rules' | 'feed'>('rules');
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  // Form State for New Rule
  const [ruleName, setRuleName] = useState('');
  const [minScore, setMinScore] = useState(85);
  const [minProfit, setMinProfit] = useState(25);
  const [itemType, setItemType] = useState<'ALL' | ItemType>('ALL');
  const [region, setRegion] = useState('ALL');
  const [emailNotification, setEmailNotification] = useState(true);
  const [emailAddress, setEmailAddress] = useState('emreker1@gmail.com');
  const [inAppNotification, setInAppNotification] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);

  // Fetch Rules & Notifications
  const loadAlertData = async () => {
    try {
      const [rulesRes, notifRes] = await Promise.all([
        fetch('/api/alerts/rules'),
        fetch('/api/alerts/notifications')
      ]);
      const rulesData = await rulesRes.json();
      const notifData = await notifRes.json();

      if (rulesData.success) setRules(rulesData.rules);
      if (notifData.success) setNotifications(notifData.notifications);
    } catch (e) {
      console.error('Failed to load alerts:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAlertData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/alerts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ruleName || `Özel OS Alarmı (OS ≥ ${minScore})`,
          minScoreThreshold: minScore,
          minProfitThreshold: minProfit,
          itemType,
          region,
          emailNotification,
          emailAddress,
          inAppNotification,
          soundAlert,
          isActive: true
        })
      });
      const data = await res.json();
      if (data.success && data.rule) {
        setRules(prev => [data.rule, ...prev]);
        setIsCreating(false);
        setRuleName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRuleActive = async (rule: AlertRule) => {
    try {
      const res = await fetch(`/api/alerts/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !rule.isActive })
      });
      const data = await res.json();
      if (data.success && data.rule) {
        setRules(prev => prev.map(r => r.id === rule.id ? data.rule : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/rules/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRules(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/alerts/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/alerts/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await fetch('/api/alerts/notifications', { method: 'DELETE' });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestTrigger = async () => {
    setIsTesting(true);
    setTestSuccessMessage(null);
    try {
      const res = await fetch('/api/alerts/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minScore: 85 })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(prev => [...data.notifications, ...prev]);
        setTestSuccessMessage(
          language === 'tr' 
            ? `E-posta simülasyonu ve ${data.notifications.length} sistem bildirimi başarıyla tetiklendi!` 
            : `Email dispatch simulation and ${data.notifications.length} live alerts triggered!`
        );
        // Reload rule trigger count stats
        loadAlertData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#161618] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#19191c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
                <span>{t.alertSettingsTitle}</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount} yeni
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.alertSettingsSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Controls */}
        <div className="px-6 py-3 border-b border-white/5 bg-[#121214] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('rules'); setIsCreating(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.alertsTabRules} ({rules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t.alertsTabFeed} ({notifications.length})</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'rules' && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.alertsCreateBtn}</span>
              </button>
            )}

            <button
              onClick={handleTestTrigger}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3 h-3 text-orange-400 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{t.alertTestTriggerBtn}</span>
            </button>
          </div>
        </div>

        {/* Test Alert Success Feedback */}
        {testSuccessMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testSuccessMessage}</span>
            </div>
            <button onClick={() => setTestSuccessMessage(null)} className="text-slate-400 hover:text-white text-xs">
              &times;
            </button>
          </div>
        )}

        {/* TAB 1: RULES MANAGEMENT */}
        {activeTab === 'rules' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Create Rule Form */}
            {isCreating && (
              <form onSubmit={handleCreateRule} className="bg-[#0C0C0D] border border-orange-500/30 rounded-xl p-5 space-y-4 shadow-xl mb-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-white font-semibold text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>{t.alertsCreateBtn}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    İptal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.alertNameInput}</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Yüksek Karlı Amazon DE Fırsatları"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">
                      {t.alertScoreThresholdInput} <span className="text-orange-400 font-bold font-mono">≥ {minScore}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="50"
                        max="98"
                        step="1"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="flex-1 accent-orange-500"
                      />
                      <span className="px-2.5 py-1 bg-[#161618] border border-white/10 rounded font-mono font-bold text-orange-400 text-xs">
                        {minScore}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.alertMinProfitInput}</label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={minProfit}
                      onChange={(e) => setMinProfit(Number(e.target.value))}
                      className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.alertItemTypeInput}</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value as any)}
                      className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="ALL">Tümü (Fiziki / Yazılım / Hizmet)</option>
                      <option value="PHYSICAL">📦 Fiziki Ürün Arbitrajı</option>
                      <option value="SOFTWARE">💻 SaaS / Dijital Lisans</option>
                      <option value="SERVICE">🔧 Bölgesel Hizmet Boşluğu</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.alertRegionInput}</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="ALL">Global (Tüm Bölgeler)</option>
                      <option value="DE">Almanya (DE)</option>
                      <option value="US">Amerika (US)</option>
                      <option value="TR">Türkiye (TR)</option>
                      <option value="UK">İngiltere (UK)</option>
                      <option value="EU">Avrupa Birliği (EU)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.alertEmailAddressInput}</label>
                    <input
                      type="email"
                      required={emailNotification}
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 font-mono"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-white/5 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotification}
                      onChange={(e) => setEmailNotification(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t.alertEmailToggle}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inAppNotification}
                      onChange={(e) => setInAppNotification(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.alertInAppToggle}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soundAlert}
                      onChange={(e) => setSoundAlert(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.alertSoundToggle}</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer shadow-md shadow-orange-950/40"
                  >
                    {t.alertSaveRuleBtn}
                  </button>
                </div>
              </form>
            )}

            {/* List of Existing Rules */}
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-[#0C0C0D] border rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    rule.isActive ? 'border-white/10' : 'border-white/5 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-white font-semibold text-xs tracking-tight">
                        {rule.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        rule.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}>
                        {rule.isActive ? t.alertRuleActive : t.alertRulePassive}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span className="text-orange-400 font-bold">OS ≥ {rule.minScoreThreshold}</span>
                      {rule.minProfitThreshold ? <span>Min. Kar: ${rule.minProfitThreshold}</span> : null}
                      <span className="text-slate-500">•</span>
                      <span>Tür: {rule.itemType}</span>
                      <span className="text-slate-500">•</span>
                      <span>Bölge: {rule.region}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                      <span>{t.alertTriggerCount} <strong className="text-slate-300 font-mono">{rule.triggeredCount} kez</strong></span>
                      {rule.emailNotification && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Mail className="w-3 h-3 text-orange-400" />
                          <span>{rule.emailAddress}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleRuleActive(rule)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        rule.isActive
                          ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {rule.isActive ? 'Durdur' : 'Aktifleştir'}
                    </button>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title="Kuralı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE NOTIFICATION FEED */}
        {activeTab === 'feed' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs text-slate-400 font-mono">
                {notifications.length} bildirim kaydı
              </span>
              <div className="flex items-center gap-3 text-xs">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-orange-400 hover:text-orange-300 cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{t.alertMarkAllRead}</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.alertClearAllNotifs}</span>
                  </button>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>{t.alertNoNotifications}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Yeni fırsatlar tarandıkça veya skor eşiğini aştıkça burada listelenecektir.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`bg-[#0C0C0D] border rounded-xl p-3.5 transition-all flex items-start justify-between gap-3 ${
                      notif.read ? 'border-white/5 opacity-75' : 'border-orange-500/30 bg-orange-500/[0.02]'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                        )}
                        <h4 className="text-white font-medium text-xs">
                          {notif.itemTitle}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono font-bold">
                          OS: {notif.itemScore.toFixed(1)}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          +${notif.netProfitUsd.toFixed(2)} Net Kâr
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">{notif.corridor}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1 font-mono">
                        <span>Kural: {notif.ruleName}</span>
                        <span>•</span>
                        <span>{notif.timestamp}</span>
                        {notif.deliveredVia.includes('EMAIL') && (
                          <span className="text-orange-400 flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" /> E-posta iletildi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 cursor-pointer text-xs"
                          title="Okundu İşaretle"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onSelectOpportunity && (
                        <button
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            onSelectOpportunity(notif.itemId);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>İncele</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/5 bg-[#121214] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>SMTP / Push Daemon: Aktif</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-sans transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
