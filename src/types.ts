export type ItemType = 'PHYSICAL' | 'SOFTWARE' | 'SERVICE';

export interface MarketListing {
  platform_name: string; // e.g. 'Amazon_US', 'Trendyol', 'Amazon_DE', 'G2', 'GooglePlaces'
  region: string; // e.g. 'TR', 'DE', 'US', 'UK', 'LATAM', 'EU', 'Berlin/DE', 'Kadıköy/TR'
  price: number;
  currency: string;
  seller_name: string;
  is_authorized_seller: boolean;
  rank_or_bsr?: number;
  rating?: number;
  review_count?: number;
  shipping_time_days?: number;
  stock_status?: string;
  url?: string;
  action_label?: string; // e.g. 'Satın Al / Tedarik Et (Trendyol)', 'Listele & Sat (Amazon DE)'
}

export interface DemandSentimentLog {
  source_platform: string;
  search_volume: number; // Aylık Arama Hacmi
  negative_support_mentions: number; // Şikayet / Destek Açığı
  total_support_mentions: number;
  unmet_need_score: number; // 0 - 100
  vendor_count?: number; // Hizmet sağlayıcı sayısı
  avg_vendor_rating?: number; // Mevcut işletmelerin puanı (1 - 5)
}

export interface OpportunityItem {
  id: string;
  item_type: ItemType;
  title: string;
  brand_or_provider: string;
  identifier_code: string; // EAN, ASIN, SKU, Keyword
  category: string;
  image_url?: string;
  
  // Market listings
  source_market: MarketListing;
  target_market: MarketListing;

  // Arbitrage & Costs
  shipping_cost_usd: number;
  customs_cost_usd: number;
  marketplace_fee_rate: number; // e.g. 0.15 (15%)
  fx_rate: number; // Source currency to USD/target conversion

  // Demand & Sentiment
  sentiment: DemandSentimentLog;

  // Calculated Mathematical Metrics
  net_profit_usd: number; // PA
  profit_margin_pct: number;
  estimated_monthly_sales: number; // S_est
  monthly_potential_revenue_usd: number;
  suns_score?: number; // Software Unmet Need Score
  sogi_score?: number; // Service Opportunity Gap Index
  opportunity_score: number; // OS (0 - 100)

  // Risk & Brand Authorization Presence (Marka Resmi Satıcı Varlığı)
  authorized_reseller_exists: boolean;
  brand_authorized_presence?: {
    has_brand_store_in_target: boolean; // Hedef pazarda resmi marka mağazası var mı?
    target_market_status: 'RESMİ_SATICI_YOK' | 'YETKİLİ_DİSTRİBÜTÖR_YOK' | 'RESMİ_MAGAZA_VAR' | 'SERBEST_GİRİŞ';
    explanation: string;
    verified_at: string;
    distributor_gap_level: 'TAM_ACIK' | 'KISMEN_ACIK' | 'KORUMALI';
  };
  competition_level: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK';
  risk_level: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK';
  risk_factors: string[];
  tactical_playbook: string[];
  historical_price_trend: {
    month: string;
    source_price: number;
    target_price: number;
    net_profit: number;
  }[];

  // Scraper Provenance
  scraper_telemetry: {
    tor_node_ip: string;
    tor_country: string;
    last_scraped_at: string;
    playwright_fingerprint: string;
    confidence_score: number; // e.g. 98%
    is_live_scraped?: boolean;
  };
}

export interface CalculationParams {
  item_type: ItemType;
  target_price: number;
  source_price: number;
  marketplace_fee_rate: number;
  fx_rate: number;
  shipping_cost: number;
  customs_cost: number;
  bsr?: number;
  authorized_seller_exists: boolean;
  // Software params
  search_volume?: number;
  negative_mentions?: number;
  total_mentions?: number;
  official_support_gap?: number; // 0 to 1
  // Service params
  vendor_count?: number;
  avg_vendor_rating?: number;
}

export interface CalculationResult {
  net_profit_usd: number;
  profit_margin_pct: number;
  estimated_monthly_sales: number;
  suns_score: number;
  sogi_score: number;
  opportunity_score: number;
  breakdown: {
    norm_profit: number;
    norm_sales: number;
    auth_bonus: number;
    domain_score_norm: number;
    formula_latex: string;
  };
}

export interface TorScraperLog {
  id: string;
  timestamp: string;
  tor_ip: string;
  country: string;
  action: string;
  target_url: string;
  status: 'SUCCESS' | 'ROTATING' | 'RETRY' | 'CAPTCHA_BYPASSED';
  latency_ms: number;
}

export interface FilterState {
  category: string;
  itemType: string;
  region: string;
  noAuthorizedSellerOnly: boolean;
  minScore: number;
  searchQuery: string;
  sortBy: 'score_desc' | 'profit_desc' | 'sales_desc' | 'margin_desc';
}

export interface AlertRule {
  id: string;
  name: string;
  minScoreThreshold: number; // e.g. 85 or 90
  minProfitThreshold?: number; // e.g. $25
  itemType: 'ALL' | ItemType;
  region: string; // 'ALL' or specific
  emailNotification: boolean;
  emailAddress?: string;
  inAppNotification: boolean;
  soundAlert: boolean;
  isActive: boolean;
  createdAt: string;
  triggeredCount: number;
  lastTriggeredAt?: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  ruleName: string;
  itemId: string;
  itemTitle: string;
  itemScore: number;
  netProfitUsd: number;
  itemType: ItemType;
  corridor: string;
  timestamp: string;
  read: boolean;
  deliveredVia: ('EMAIL' | 'IN_APP')[];
}

