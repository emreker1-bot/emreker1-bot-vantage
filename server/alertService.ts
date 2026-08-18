import { AlertRule, AlertNotification, OpportunityItem } from '../src/types';

// In-Memory Storage for Alert Rules & Generated Notifications
let alertRules: AlertRule[] = [
  {
    id: 'rule-high-os',
    name: 'Yüksek Fırsat Skoru Alarmı (OS ≥ 85)',
    minScoreThreshold: 85,
    minProfitThreshold: 20,
    itemType: 'ALL',
    region: 'ALL',
    emailNotification: true,
    emailAddress: 'emreker1@gmail.com',
    inAppNotification: true,
    soundAlert: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    triggeredCount: 4,
    lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'rule-software-saas',
    name: 'SaaS / Dijital Lisans Arbitrajı (OS ≥ 80)',
    minScoreThreshold: 80,
    minProfitThreshold: 50,
    itemType: 'SOFTWARE',
    region: 'ALL',
    emailNotification: true,
    emailAddress: 'emreker1@gmail.com',
    inAppNotification: true,
    soundAlert: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    triggeredCount: 2,
    lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'rule-eu-corridor',
    name: 'Almanya & AB Koridoru Fırsatları (OS ≥ 88)',
    minScoreThreshold: 88,
    minProfitThreshold: 30,
    itemType: 'PHYSICAL',
    region: 'DE',
    emailNotification: true,
    emailAddress: 'emreker1@gmail.com',
    inAppNotification: true,
    soundAlert: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    triggeredCount: 3,
    lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }
];

let notifications: AlertNotification[] = [
  {
    id: 'notif-1',
    ruleId: 'rule-high-os',
    ruleName: 'Yüksek Fırsat Skoru Alarmı (OS ≥ 85)',
    itemId: 'opp-1',
    itemTitle: 'Philips Sonicare Yedek Başlık 8\'li Paket',
    itemScore: 92.4,
    netProfitUsd: 28.50,
    itemType: 'PHYSICAL',
    corridor: 'TR ➔ DE (Trendyol ➔ Amazon DE)',
    timestamp: '15 dk önce',
    read: false,
    deliveredVia: ['EMAIL', 'IN_APP'],
  },
  {
    id: 'notif-2',
    ruleId: 'rule-software-saas',
    ruleName: 'SaaS / Dijital Lisans Arbitrajı (OS ≥ 80)',
    itemId: 'opp-2',
    itemTitle: 'DevTools Pro IDE Suite Çoklu Kullanıcı Lisansı',
    itemScore: 89.1,
    netProfitUsd: 270.08,
    itemType: 'SOFTWARE',
    corridor: 'LATAM ➔ EU / US',
    timestamp: '2 saat önce',
    read: false,
    deliveredVia: ['EMAIL', 'IN_APP'],
  },
  {
    id: 'notif-3',
    ruleId: 'rule-eu-corridor',
    ruleName: 'Almanya & AB Koridoru Fırsatları (OS ≥ 88)',
    itemId: 'opp-3',
    itemTitle: 'Dyson V15 HEPA Filtre Seti (OEM)',
    itemScore: 88.6,
    netProfitUsd: 42.10,
    itemType: 'PHYSICAL',
    corridor: 'TR ➔ DE / EU',
    timestamp: '3 saat önce',
    read: true,
    deliveredVia: ['EMAIL', 'IN_APP'],
  }
];

export function getAlertRules(): AlertRule[] {
  return alertRules;
}

export function createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'triggeredCount'>): AlertRule {
  const newRule: AlertRule = {
    ...rule,
    id: `rule-${Date.now()}`,
    createdAt: new Date().toISOString(),
    triggeredCount: 0,
  };
  alertRules.unshift(newRule);
  return newRule;
}

export function updateAlertRule(id: string, updates: Partial<AlertRule>): AlertRule | null {
  const index = alertRules.findIndex(r => r.id === id);
  if (index === -1) return null;
  alertRules[index] = { ...alertRules[index], ...updates };
  return alertRules[index];
}

export function deleteAlertRule(id: string): boolean {
  const beforeLen = alertRules.length;
  alertRules = alertRules.filter(r => r.id !== id);
  return alertRules.length < beforeLen;
}

export function getNotifications(): AlertNotification[] {
  return notifications;
}

export function markNotificationAsRead(id: string): boolean {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    return true;
  }
  return false;
}

export function markAllNotificationsAsRead(): void {
  notifications.forEach(n => { n.read = true; });
}

export function clearNotifications(): void {
  notifications = [];
}

/**
 * Checks an incoming opportunity item against all active alert rules
 * and generates live notifications + simulated email dispatches.
 */
export function checkOpportunityAgainstRules(item: OpportunityItem): AlertNotification[] {
  const generated: AlertNotification[] = [];

  for (const rule of alertRules) {
    if (!rule.isActive) continue;

    // Check score threshold
    if (item.opportunity_score < rule.minScoreThreshold) continue;

    // Check min profit threshold if set
    if (rule.minProfitThreshold && item.net_profit_usd < rule.minProfitThreshold) continue;

    // Check item type match
    if (rule.itemType !== 'ALL' && item.item_type !== rule.itemType) continue;

    // Check region match if set
    if (rule.region !== 'ALL' && !item.target_market.region.toUpperCase().includes(rule.region.toUpperCase()) && !item.source_market.region.toUpperCase().includes(rule.region.toUpperCase())) {
      continue;
    }

    // Rule matched! Update rule stats
    rule.triggeredCount += 1;
    rule.lastTriggeredAt = new Date().toISOString();

    const delivered: ('EMAIL' | 'IN_APP')[] = [];
    if (rule.inAppNotification) delivered.push('IN_APP');
    if (rule.emailNotification) delivered.push('EMAIL');

    const notif: AlertNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      itemId: item.id,
      itemTitle: item.title,
      itemScore: item.opportunity_score,
      netProfitUsd: item.net_profit_usd,
      itemType: item.item_type,
      corridor: `${item.source_market.region} ➔ ${item.target_market.region}`,
      timestamp: 'Şimdi (Yeni)',
      read: false,
      deliveredVia: delivered,
    };

    notifications.unshift(notif);
    generated.push(notif);
  }

  return generated;
}
