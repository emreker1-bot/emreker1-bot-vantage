import { CalculationParams, CalculationResult, ItemType } from '../types';

/**
 * Global Opportunity Mathematical Scoring Engine
 * PRD Section 5 Implementations
 */

// Alpha and Beta constants for BSR sales estimation (Electronics/General benchmark)
const DEFAULT_ALPHA = 150000;
const DEFAULT_BETA = 0.85;

/**
 * 5.A. Physical Product Arbitrage Profit (PA)
 * PA = P_target * (1 - tau_mkt) - (P_source * e_fx + C_ship + C_customs)
 */
export function calculatePhysicalArbitrage(
  targetPrice: number,
  marketplaceFeeRate: number,
  sourcePrice: number,
  fxRate: number,
  shippingCost: number,
  customsCost: number
): number {
  const effectiveRevenue = targetPrice * (1 - marketplaceFeeRate);
  const totalCost = sourcePrice * fxRate + shippingCost + customsCost;
  return Math.round((effectiveRevenue - totalCost) * 100) / 100;
}

/**
 * 5.B. Estimated Monthly Sales Volume via BSR (S_est)
 * S_est = alpha * (BSR)^(-beta)
 */
export function estimateMonthlySalesFromBSR(
  bsr: number,
  alpha = DEFAULT_ALPHA,
  beta = DEFAULT_BETA
): number {
  if (!bsr || bsr <= 0) return 0;
  const sales = alpha * Math.pow(bsr, -beta);
  return Math.max(1, Math.round(sales));
}

/**
 * 5.C. Software Support Dissatisfaction Score (SUNS)
 * SUNS = (N_neg / (N_total + 1)) * log10(1 + V_search) * (1 - theta_official)
 */
export function calculateSoftwareUnmetNeed(
  negativeMentions: number,
  totalMentions: number,
  searchVolume: number,
  officialResellerExists: boolean
): number {
  const complaintRatio = negativeMentions / (Math.max(0, totalMentions) + 1);
  const logSearch = Math.log10(1 + Math.max(0, searchVolume));
  const officialFactor = officialResellerExists ? 0.2 : 1.0;
  const rawScore = complaintRatio * logSearch * officialFactor * 25;
  return Math.round(Math.min(100, Math.max(0, rawScore)) * 100) / 100;
}

/**
 * 5.D. Regional Service Opportunity Gap Index (SOGI)
 * SOGI = (V_search / (N_vendors + 1)) * (1 - (R_avg / 5))
 */
export function calculateServiceOpportunityGap(
  searchVolume: number,
  vendorCount: number,
  avgRating: number
): number {
  const supplyRatio = searchVolume / (Math.max(0, vendorCount) + 1);
  const qualityGap = 1 - Math.min(5, Math.max(0, avgRating)) / 5;
  const rawScore = (supplyRatio / 15) * qualityGap;
  return Math.round(Math.min(100, Math.max(0, rawScore)) * 100) / 100;
}

/**
 * 5.E. Global Opportunity Score (OS)
 * OS = 100 * [ 0.3 * Norm(PA) + 0.3 * Norm(S_est) + 0.2 * (1 - theta_auth) + 0.2 * Norm(SUNS veya SOGI) ]
 */
export function calculateFullOpportunityScore(params: CalculationParams): CalculationResult {
  const {
    item_type,
    target_price,
    source_price,
    marketplace_fee_rate,
    fx_rate,
    shipping_cost,
    customs_cost,
    bsr = 5000,
    authorized_seller_exists,
    search_volume = 1000,
    negative_mentions = 40,
    total_mentions = 100,
    vendor_count = 3,
    avg_vendor_rating = 2.8,
  } = params;

  // 1. Calculate Net Profit (PA)
  let netProfit = 0;
  if (item_type === 'PHYSICAL') {
    netProfit = calculatePhysicalArbitrage(
      target_price,
      marketplace_fee_rate,
      source_price,
      fx_rate,
      shipping_cost,
      customs_cost
    );
  } else if (item_type === 'SOFTWARE') {
    // Software has negligible physical shipping/customs, standard digital platform fees
    netProfit = calculatePhysicalArbitrage(
      target_price,
      marketplace_fee_rate,
      source_price,
      fx_rate,
      shipping_cost,
      customs_cost
    );
  } else {
    // Service: revenue per booking/lead margin
    netProfit = Math.round((target_price - source_price) * (1 - marketplace_fee_rate) * 100) / 100;
  }

  // Profit Margin %
  const totalCost = source_price * fx_rate + shipping_cost + customs_cost;
  const profitMarginPct =
    target_price > 0
      ? Math.round((netProfit / target_price) * 1000) / 10
      : 0;

  // 2. Estimate Sales / Demand Volume (S_est)
  let estSales = 0;
  if (item_type === 'PHYSICAL') {
    estSales = estimateMonthlySalesFromBSR(bsr);
  } else if (item_type === 'SOFTWARE') {
    estSales = Math.max(10, Math.round(search_volume * 0.08));
  } else {
    estSales = Math.max(5, Math.round(search_volume * 0.04));
  }

  // 3. Domain Specific Gap Index (SUNS vs SOGI)
  const sunsScore = calculateSoftwareUnmetNeed(
    negative_mentions,
    total_mentions,
    search_volume,
    authorized_seller_exists
  );
  const sogiScore = calculateServiceOpportunityGap(
    search_volume,
    vendor_count,
    avg_vendor_rating
  );

  // Normalizations for composite scoring (Scale 0.0 to 1.0)
  const normProfit = Math.min(1.0, Math.max(0.0, netProfit / 80.0));
  const normSales = Math.min(1.0, Math.max(0.0, estSales / 800.0));
  const authBonus = authorized_seller_exists ? 0.0 : 1.0;

  let domainScoreNorm = 0.5;
  if (item_type === 'SOFTWARE') {
    domainScoreNorm = Math.min(1.0, sunsScore / 100.0);
  } else if (item_type === 'SERVICE') {
    domainScoreNorm = Math.min(1.0, sogiScore / 100.0);
  } else {
    // For physical: Margin quality + low BSR bonus
    domainScoreNorm = Math.min(1.0, Math.max(0.1, profitMarginPct / 50.0));
  }

  // Composite OS Formula
  const rawScore =
    (0.3 * normProfit + 0.3 * normSales + 0.2 * authBonus + 0.2 * domainScoreNorm) * 100;
  const opportunityScore = Math.round(Math.min(99.4, Math.max(5.0, rawScore)) * 10) / 10;

  return {
    net_profit_usd: netProfit,
    profit_margin_pct: profitMarginPct,
    estimated_monthly_sales: estSales,
    suns_score: sunsScore,
    sogi_score: sogiScore,
    opportunity_score: opportunityScore,
    breakdown: {
      norm_profit: Math.round(normProfit * 100) / 100,
      norm_sales: Math.round(normSales * 100) / 100,
      auth_bonus: authBonus,
      domain_score_norm: Math.round(domainScoreNorm * 100) / 100,
      formula_latex: `OS = 100 \\times [0.3(${normProfit.toFixed(2)}) + 0.3(${normSales.toFixed(2)}) + 0.2(${authBonus}) + 0.2(${domainScoreNorm.toFixed(2)})] = ${opportunityScore}`,
    },
  };
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (currency === 'USD' || currency === '$') return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === 'EUR' || currency === '€') return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === 'TRY' || currency === '₺') return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === 'GBP' || currency === '£') return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${amount.toFixed(2)} ${currency}`;
}
