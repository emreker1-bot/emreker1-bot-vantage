import { OpportunityItem, FilterState } from '../src/types';
import { INITIAL_OPPORTUNITIES } from '../src/data/seedData';
import { calculateFullOpportunityScore } from '../src/utils/mathEngine';

let items: OpportunityItem[] = [...INITIAL_OPPORTUNITIES];

export function getAllItems(filters?: Partial<FilterState>): OpportunityItem[] {
  let result = [...items];

  if (!filters) return result;

  if (filters.itemType && filters.itemType !== 'ALL') {
    result = result.filter(item => item.item_type === filters.itemType);
  }

  if (filters.category && filters.category !== 'ALL') {
    const cat = filters.category.toLowerCase().trim();
    result = result.filter(item => 
      item.category.toLowerCase() === cat ||
      item.category.toLowerCase().includes(cat) ||
      cat.includes(item.category.toLowerCase())
    );
  }

  if (filters.region && filters.region !== 'ALL') {
    const reg = filters.region.toLowerCase().trim();
    result = result.filter(item =>
      item.source_market.region.toLowerCase().includes(reg) ||
      item.target_market.region.toLowerCase().includes(reg) ||
      item.source_market.platform_name.toLowerCase().includes(reg) ||
      item.target_market.platform_name.toLowerCase().includes(reg)
    );
  }

  if (filters.noAuthorizedSellerOnly) {
    result = result.filter(item => 
      !item.authorized_reseller_exists || 
      (item.brand_authorized_presence && !item.brand_authorized_presence.has_brand_store_in_target)
    );
  }

  if (filters.minScore !== undefined && filters.minScore > 0) {
    result = result.filter(item => item.opportunity_score >= filters.minScore!);
  }

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.brand_or_provider.toLowerCase().includes(q) ||
      item.identifier_code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.item_type.toLowerCase().includes(q) ||
      item.source_market.platform_name.toLowerCase().includes(q) ||
      item.target_market.platform_name.toLowerCase().includes(q) ||
      item.source_market.region.toLowerCase().includes(q) ||
      item.target_market.region.toLowerCase().includes(q) ||
      (item.tactical_playbook && item.tactical_playbook.some(t => t.toLowerCase().includes(q))) ||
      (item.risk_factors && item.risk_factors.some(r => r.toLowerCase().includes(q)))
    );
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'score_desc':
        result.sort((a, b) => b.opportunity_score - a.opportunity_score);
        break;
      case 'profit_desc':
        result.sort((a, b) => b.net_profit_usd - a.net_profit_usd);
        break;
      case 'sales_desc':
        result.sort((a, b) => b.estimated_monthly_sales - a.estimated_monthly_sales);
        break;
      case 'margin_desc':
        result.sort((a, b) => b.profit_margin_pct - a.profit_margin_pct);
        break;
    }
  }

  return result;
}

export function getAvailableCategories(): string[] {
  const cats = new Set<string>();
  items.forEach(it => {
    if (it.category) cats.add(it.category);
  });
  return Array.from(cats);
}

export function getItemById(id: string): OpportunityItem | undefined {
  return items.find(item => item.id === id);
}

export function addItem(item: OpportunityItem): OpportunityItem {
  items.unshift(item);
  return item;
}

export function updateItem(id: string, updates: Partial<OpportunityItem>): OpportunityItem | null {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  return items[index];
}

export function deleteItem(id: string): boolean {
  const initLen = items.length;
  items = items.filter(item => item.id !== id);
  return items.length < initLen;
}

export function addBulkItems(newItems: OpportunityItem[]): OpportunityItem[] {
  const added: OpportunityItem[] = [];
  for (const it of newItems) {
    if (!items.some(existing => existing.id === it.id || (existing.title === it.title && existing.identifier_code === it.identifier_code))) {
      items.unshift(it);
      added.push(it);
    }
  }
  return added;
}

export function resetDatabase(): OpportunityItem[] {
  items = [...INITIAL_OPPORTUNITIES];
  return items;
}


export function getStatsSummary() {
  const totalItems = items.length;
  const avgScore =
    totalItems > 0
      ? Math.round((items.reduce((sum, item) => sum + item.opportunity_score, 0) / totalItems) * 10) / 10
      : 0;

  const totalMonthlyPotentialUSD = items.reduce(
    (sum, item) => sum + (item.monthly_potential_revenue_usd || 0),
    0
  );

  const highYieldCount = items.filter(i => i.opportunity_score >= 85).length;
  const noAuthorizedCount = items.filter(i => !i.authorized_reseller_exists).length;

  const physicalCount = items.filter(i => i.item_type === 'PHYSICAL').length;
  const softwareCount = items.filter(i => i.item_type === 'SOFTWARE').length;
  const serviceCount = items.filter(i => i.item_type === 'SERVICE').length;

  return {
    totalItems,
    avgScore,
    totalMonthlyPotentialUSD,
    highYieldCount,
    noAuthorizedCount,
    countsByType: {
      PHYSICAL: physicalCount,
      SOFTWARE: softwareCount,
      SERVICE: serviceCount,
    },
  };
}
