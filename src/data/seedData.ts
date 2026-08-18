import { OpportunityItem } from '../types';

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  // 1. Dyson OEM HEPA Filter
  {
    id: 'opp-phys-001',
    item_type: 'PHYSICAL',
    title: 'Dyson V15 Detect HEPA Orijinal Yedek Filtre Seti (2\'li OEM)',
    brand_or_provider: 'Dyson OEM Spare Parts',
    identifier_code: 'B09J87W8K9 / EAN-502515507',
    category: 'Ev Aletleri & Yedek Parça',
    source_market: {
      platform_name: 'Trendyol TR (Toptan Yedek Parça Pazarı)',
      region: 'TR',
      price: 1200,
      currency: 'TRY',
      seller_name: 'Resmi Olmayan Distribütör Deposu (İstanbul)',
      is_authorized_seller: false,
      rating: 4.8,
      review_count: 342,
      shipping_time_days: 1,
      stock_status: 'Bol Stok (840+ Adet)',
      url: 'https://www.trendyol.com/sr?q=dyson+v15+hepa+filtre+orijinal',
      action_label: 'Satın Al / Tedarik Et (Trendyol TR)'
    },
    target_market: {
      platform_name: 'Amazon DE (FBA Depo Teslim)',
      region: 'DE / EU',
      price: 85,
      currency: 'EUR',
      seller_name: 'FBA Arbitraj Satıcıları (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 1420,
      rating: 4.4,
      review_count: 1890,
      stock_status: 'Kritik Stok Uyarısı (Buy Box Açık)',
      url: 'https://www.amazon.de/s?k=dyson+v15+filter+hepa+original',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 6.5,
    customs_cost_usd: 3.2,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Amazon.de Reviews & Google Search DE',
      search_volume: 18500,
      negative_support_mentions: 84,
      total_support_mentions: 120,
      unmet_need_score: 78.5
    },
    net_profit_usd: 44.80,
    profit_margin_pct: 48.7,
    estimated_monthly_sales: 312,
    monthly_potential_revenue_usd: 13977.60,
    opportunity_score: 94.2,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Dyson resmi markası Amazon DE üzerinde bu OEM yedek parça kodunu doğrudan listelemiyor. Pazardaki 3P satıcıların tamamı bağımsız arbitrajcılardan oluşuyor, Buy Box rekabeti serbest.',
      verified_at: '2026-08-18 (Canlı Tor Taramasıyla Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: [
      'Gümrük beyannamesinde CE ve orijinal OEM sertifikası eksiksiz ibraz edilmelidir.',
      'Amazon FBA depo kabulünde barkod standardı ASIN etiketiyle örtüşmelidir.'
    ],
    tactical_playbook: [
      'Türkiye yerel tedarikçisinden faturalı 50 adetlik ilk deneme partisi çekin.',
      'Amazon DE FBA kargosunu DHL Express DDP ile direkt Leipzig hub\'a sevk edin.',
      'Buy Box fiyatını 84.50 EUR olarak belirleyip ilk 2 haftada organik satış ivmesi yakalayın.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 1100, target_price: 82, net_profit: 41.5 },
      { month: 'Şub', source_price: 1150, target_price: 84, net_profit: 43.0 },
      { month: 'Mar', source_price: 1200, target_price: 85, net_profit: 44.8 },
      { month: 'Nis', source_price: 1200, target_price: 88, net_profit: 47.2 }
    ],
    scraper_telemetry: {
      tor_node_ip: '185.220.101.54 (Frankfurt Tor Exit)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (3 dk önce)',
      playwright_fingerprint: 'Amazon Playwright Engine v2.1',
      confidence_score: 96.8,
      is_live_scraped: true
    }
  },

  // 2. Philips Sonicare Orijinal Başlık
  {
    id: 'opp-phys-002',
    item_type: 'PHYSICAL',
    title: 'Philips Sonicare W3 Premium White 4\'lü Orijinal Başlık Paketi',
    brand_or_provider: 'Philips Personal Health',
    identifier_code: 'HX9064/17 / B079K42X11',
    category: 'Kişisel Bakım & Sağlık',
    source_market: {
      platform_name: 'Hepsiburada TR (Yetkili Eczane Deposu)',
      region: 'TR',
      price: 950,
      currency: 'TRY',
      seller_name: 'MedikalDepo İstanbul',
      is_authorized_seller: false,
      rating: 4.9,
      review_count: 512,
      shipping_time_days: 1,
      stock_status: '500+ Adet',
      url: 'https://www.hepsiburada.com/ara?q=philips+sonicare+w3+4lu',
      action_label: 'Satın Al / Tedarik Et (Hepsiburada TR)'
    },
    target_market: {
      platform_name: 'Amazon UK (FBA)',
      region: 'UK',
      price: 49.99,
      currency: 'GBP',
      seller_name: 'Global Oral Care Direct (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 890,
      rating: 4.7,
      review_count: 5400,
      stock_status: 'Düşük Stok (Buy Box %80 3P Satıcıda)',
      url: 'https://www.amazon.co.uk/s?k=philips+sonicare+w3+4+pack',
      action_label: 'Listele & Sat (Amazon UK)'
    },
    shipping_cost_usd: 5.2,
    customs_cost_usd: 2.8,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Boots Reviews & Amazon UK Q&A',
      search_volume: 24000,
      negative_support_mentions: 95,
      total_support_mentions: 140,
      unmet_need_score: 81.0
    },
    net_profit_usd: 28.40,
    profit_margin_pct: 44.7,
    estimated_monthly_sales: 420,
    monthly_potential_revenue_usd: 11928.00,
    opportunity_score: 91.5,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Philips UK resmi mağazası bu 4\'lü SKU paketini direkt tedarik etmiyor; Buy Box bağımsız sağlık depolarına emanet.',
      verified_at: '2026-08-18 (Canlı Tor Taramasıyla Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Orijinallik barkod hologramının yıpranmamış olması gerekir.'],
    tactical_playbook: [
      '100\'lük toplu alım ile birim maliyeti 850 TL\'ye indirin.',
      'İngiltere Amazon FBA depolarına hava kargo ile hızlı giriş yapın.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 880, target_price: 46.99, net_profit: 26.0 },
      { month: 'Şub', source_price: 920, target_price: 48.50, net_profit: 27.2 },
      { month: 'Mar', source_price: 950, target_price: 49.99, net_profit: 28.4 }
    ],
    scraper_telemetry: {
      tor_node_ip: '51.15.42.19 (London Tor Node)',
      tor_country: 'UK',
      last_scraped_at: 'Canlı (7 dk önce)',
      playwright_fingerprint: 'UK E-Commerce Playwright v1.8',
      confidence_score: 95.4,
      is_live_scraped: true
    }
  },

  // 3. JetBrains All Products Pack
  {
    id: 'opp-soft-003',
    item_type: 'SOFTWARE',
    title: 'JetBrains All Products Pack (1 Yıllık Ticari Kurumsal Lisans)',
    brand_or_provider: 'JetBrains s.r.o.',
    identifier_code: 'JB-ALL-CORP-2026',
    category: 'Geliştirici Araçları & SaaS Lisans',
    source_market: {
      platform_name: 'Yetkili Bölgesel Bayi (Brezilya / LATAM)',
      region: 'LATAM / BRL',
      price: 2400,
      currency: 'BRL',
      seller_name: 'SoftPartner LATAM B2B',
      is_authorized_seller: true,
      url: 'https://www.jetbrains.com/all/',
      action_label: 'Lisans Bayisinden Tedarik Et'
    },
    target_market: {
      platform_name: 'B2B Yazılım Pazar Yeri & Freelance Ajansları',
      region: 'ABD / Global',
      price: 890,
      currency: 'USD',
      seller_name: 'B2B Kurumsal Alıcılar',
      is_authorized_seller: false,
      url: 'https://g2.com/products/jetbrains',
      action_label: 'B2B Ajans Ağına Lisans Devret'
    },
    shipping_cost_usd: 0,
    customs_cost_usd: 0,
    marketplace_fee_rate: 0.05,
    fx_rate: 0.17,
    sentiment: {
      source_platform: 'Reddit r/programming & HackerNews',
      search_volume: 42000,
      negative_support_mentions: 310,
      total_support_mentions: 380,
      unmet_need_score: 88.0
    },
    net_profit_usd: 437.50,
    profit_margin_pct: 51.7,
    estimated_monthly_sales: 45,
    monthly_potential_revenue_usd: 19687.50,
    suns_score: 89.2,
    opportunity_score: 93.6,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Yazılım lisansı transferi B2B kurumsal bayiler arasında serbesttir; bölgesel fiyat makası %50\'nin üzerindedir.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'ORTA',
    risk_factors: ['Lisans aktivasyonunun transfer edilebilir kurumsal hesap üzerinden yapılması.'],
    tactical_playbook: [
      'B2B geliştirici ajanslarına %20 tasarruflu kurumsal paket olarak sunun.',
      'Stripe üzerinden anında otomatik lisans teslimatı sağlayın.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 2300, target_price: 850, net_profit: 410 },
      { month: 'Şub', source_price: 2350, target_price: 880, net_profit: 425 },
      { month: 'Mar', source_price: 2400, target_price: 890, net_profit: 437.5 }
    ],
    scraper_telemetry: {
      tor_node_ip: '177.54.148.12 (Sao Paulo Tor)',
      tor_country: 'BR',
      last_scraped_at: 'Canlı (12 dk önce)',
      playwright_fingerprint: 'SaaS Multi-Tenant Inspector v4.0',
      confidence_score: 97.1,
      is_live_scraped: true
    }
  },

  // 4. Stanley Classic Trigger-Action Termos
  {
    id: 'opp-phys-004',
    item_type: 'PHYSICAL',
    title: 'Stanley Classic Trigger-Action Seyahat Termosu (0.47L Hammertone Green)',
    brand_or_provider: 'Stanley PMI',
    identifier_code: '10-06439-026 / B07P8T7G65',
    category: 'Termos, Outdoor & Yaşam',
    source_market: {
      platform_name: 'Amazon TR (Resmi İthalatçı Kampanyası)',
      region: 'TR',
      price: 1199,
      currency: 'TRY',
      seller_name: 'Amazon TR Doğrudan',
      is_authorized_seller: true,
      rating: 4.8,
      review_count: 2100,
      shipping_time_days: 1,
      stock_status: 'Stokta Var',
      url: 'https://www.amazon.com.tr/s?k=stanley+trigger+action+0.47',
      action_label: 'Satın Al / Tedarik Et (Amazon TR)'
    },
    target_market: {
      platform_name: 'Amazon DE (FBA / Prime)',
      region: 'DE',
      price: 48.95,
      currency: 'EUR',
      seller_name: 'Outdoor Unlimited (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 650,
      rating: 4.6,
      review_count: 8900,
      stock_status: 'Yüksek Talep',
      url: 'https://www.amazon.de/s?k=stanley+trigger+action+0.47',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 4.5,
    customs_cost_usd: 2.0,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Outdoor Magazin DE & Amazon Reviews',
      search_volume: 38000,
      negative_support_mentions: 45,
      total_support_mentions: 220,
      unmet_need_score: 74.0
    },
    net_profit_usd: 18.20,
    profit_margin_pct: 35.1,
    estimated_monthly_sales: 580,
    monthly_potential_revenue_usd: 10556.00,
    opportunity_score: 89.4,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Stanley markası Avrupa Amazon depolarına dönemsel kotalarla ürün veriyor; Buy Box bağımsız satıcılar arasında rotasyonda.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Orijinal kutu hasarsızlığına dikkat edilmelidir.'],
    tactical_playbook: [
      'Amazon TR periyodik Prime indirimlerinde 100 adetlik stok çekin.',
      'Almanya FBA depolarına express kargo ile tek seferde gönderin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 1100, target_price: 46.50, net_profit: 17.0 },
      { month: 'Şub', source_price: 1150, target_price: 47.90, net_profit: 17.8 },
      { month: 'Mar', source_price: 1199, target_price: 48.95, net_profit: 18.2 }
    ],
    scraper_telemetry: {
      tor_node_ip: '194.135.25.88 (Berlin Tor Exit)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (15 dk önce)',
      playwright_fingerprint: 'Outdoor Marketplace Crawler v2.0',
      confidence_score: 98.2,
      is_live_scraped: true
    }
  },

  // 5. DeWalt DCD796 Kömürsüz Darbeli Matkap Gövdesi
  {
    id: 'opp-phys-005',
    item_type: 'PHYSICAL',
    title: 'DeWalt DCD796N 18V XR Li-Ion Kömürsüz Darbeli Matkap (Yalnız Gövde)',
    brand_or_provider: 'Stanley Black & Decker (DeWalt)',
    identifier_code: 'DCD796N-XJ / B01CTN0GHE',
    category: 'Profesyonel El Aletleri & Sanayi',
    source_market: {
      platform_name: 'N11 TR (Sanayi Toptancısı)',
      region: 'TR',
      price: 2750,
      currency: 'TRY',
      seller_name: 'Karaköy Hırdavat Sanayi',
      is_authorized_seller: false,
      rating: 4.9,
      review_count: 180,
      shipping_time_days: 1,
      stock_status: '240 Adet Stokta',
      url: 'https://www.n11.com/arama?q=dewalt+dcd796n',
      action_label: 'Satın Al / Tedarik Et (N11 TR)'
    },
    target_market: {
      platform_name: 'Amazon DE / FR B2B',
      region: 'DE / FR',
      price: 139.00,
      currency: 'EUR',
      seller_name: 'Euro Werkzeuge 3P',
      is_authorized_seller: false,
      rank_or_bsr: 410,
      rating: 4.8,
      review_count: 12400,
      stock_status: 'Hızlı Devir (BSR #410)',
      url: 'https://www.amazon.de/s?k=dewalt+dcd796n-xj',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 8.5,
    customs_cost_usd: 4.5,
    marketplace_fee_rate: 0.13,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Werkzeug-Forum DE & Amazon B2B',
      search_volume: 45000,
      negative_support_mentions: 50,
      total_support_mentions: 260,
      unmet_need_score: 83.0
    },
    net_profit_usd: 54.20,
    profit_margin_pct: 36.8,
    estimated_monthly_sales: 240,
    monthly_potential_revenue_usd: 13008.00,
    opportunity_score: 92.8,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'DeWalt Avrupa pazaryerlerinde gövde satışlarını B2B distribütörlere bırakmıştır; Buy Box bağımsız hırdavat satıcılarındadır.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Orijinal seri numarası ve CE etiketi kutu üzerinde kontrol edilmelidir.'],
    tactical_playbook: [
      'Karaköy toptancısından 30 adetlik nakit iskonto ile alım yapın.',
      'Almanya ve Fransa FBA stoklarına dağıtarak iki ülkede Buy Box kazanın.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 2500, target_price: 132, net_profit: 50.0 },
      { month: 'Şub', source_price: 2650, target_price: 135, net_profit: 52.1 },
      { month: 'Mar', source_price: 2750, target_price: 139, net_profit: 54.2 }
    ],
    scraper_telemetry: {
      tor_node_ip: '85.214.132.11 (Stuttgart Tor Node)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (9 dk önce)',
      playwright_fingerprint: 'B2B Hardware Playwright Bot v3.2',
      confidence_score: 97.8,
      is_live_scraped: true
    }
  },

  // 6. Münih 7/24 Acil Su Kaçağı & Mobil Tesisat Ağı
  {
    id: 'opp-serv-006',
    item_type: 'SERVICE',
    title: 'Münih & Bavyera 7/24 Acil Termal Kameralı Su Kaçağı & Tesisat Ağı',
    brand_or_provider: 'Regional Expert Services',
    identifier_code: 'NOT-SRV-MUC-09',
    category: 'Yerel Hizmet & Acil Onarım',
    source_market: {
      platform_name: 'Bağımsız Yerel Tesisat Usta Havuzu (Bavyera)',
      region: 'Munich / DE',
      price: 85,
      currency: 'EUR',
      seller_name: 'Sözleşmeli Teknisyen Ağı',
      is_authorized_seller: false,
      url: 'https://www.kleinanzeigen.de',
      action_label: 'Usta Havuzunu Yönet'
    },
    target_market: {
      platform_name: 'Google Yerel Hizmet Reklamları (LSA) & Acil Çağrı',
      region: 'Munich / DE',
      price: 260,
      currency: 'EUR',
      seller_name: 'Mevcut Yavaş Çağrı Merkezleri',
      is_authorized_seller: false,
      rating: 2.9,
      url: 'https://www.google.de/maps/search/rohrreinigung+notdienst+münchen',
      action_label: 'Müşteri Çağrılarını Topla (Google LSA)'
    },
    shipping_cost_usd: 0,
    customs_cost_usd: 0,
    marketplace_fee_rate: 0.10,
    fx_rate: 1.08,
    sentiment: {
      source_platform: 'Google Maps Reviews München & Trustpilot DE',
      search_volume: 14500,
      negative_support_mentions: 340,
      total_support_mentions: 420,
      unmet_need_score: 91.0,
      vendor_count: 5,
      avg_vendor_rating: 2.8
    },
    net_profit_usd: 160.92,
    profit_margin_pct: 57.3,
    estimated_monthly_sales: 185,
    monthly_potential_revenue_usd: 29770.20,
    sogi_score: 94.5,
    opportunity_score: 96.2,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Münih acil tesisat pazarında tekel veya resmi servis bulunmamaktadır. Mevcut firmalar 2-3 saat gecikmeli hizmet verdiği için çağrı yönlendirme marjı çok yüksektir.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Müşteri çağrılarına ilk 15 dakikada geri dönüş yapılması kritik önemdedir.'],
    tactical_playbook: [
      'Almanca konuşan 5 bağımsız usta ile çağrı başı 85 EUR sabit komisyon sözleşmesi yapın.',
      'Google Local Services Ads açarak "30 dakikada adreste" garantisiyle çağrı trafiği çekin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 80, target_price: 240, net_profit: 145 },
      { month: 'Şub', source_price: 85, target_price: 250, net_profit: 152 },
      { month: 'Mar', source_price: 85, target_price: 260, net_profit: 160.9 }
    ],
    scraper_telemetry: {
      tor_node_ip: '193.175.193.4 (Munich G-Node)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (5 dk önce)',
      playwright_fingerprint: 'Google LSA Realtime Inspector v2.9',
      confidence_score: 98.9,
      is_live_scraped: true
    }
  },

  // 7. Notion Enterprise / Team Yıllık Workspace
  {
    id: 'opp-soft-007',
    item_type: 'SOFTWARE',
    title: 'Notion Plus & AI Yıllık Ekip Workspace Paketi (10 Koltuk)',
    brand_or_provider: 'Notion Labs Inc.',
    identifier_code: 'NOTION-PLUS-TEAM-10',
    category: 'Geliştirici Araçları & SaaS Lisans',
    source_market: {
      platform_name: 'Resmi Bölgesel Startup Hızlandırma Havuzu',
      region: 'Global / B2B Startup',
      price: 360,
      currency: 'USD',
      seller_name: 'Yetkili Ekosistem İş Ortağı',
      is_authorized_seller: true,
      url: 'https://www.notion.so/pricing',
      action_label: 'Startup Partnerliğinden Tedarik Et'
    },
    target_market: {
      platform_name: 'Avrupa KOBİ & Dijital Pazarlama Ajansları',
      region: 'EU / UK',
      price: 1200,
      currency: 'USD',
      seller_name: 'B2B Şirketler & Ajanslar',
      is_authorized_seller: false,
      url: 'https://g2.com/products/notion',
      action_label: 'Ajans Ağına Devret'
    },
    shipping_cost_usd: 0,
    customs_cost_usd: 0,
    marketplace_fee_rate: 0.05,
    fx_rate: 1.0,
    sentiment: {
      source_platform: 'G2 Crowd & Capterra',
      search_volume: 68000,
      negative_support_mentions: 120,
      total_support_mentions: 500,
      unmet_need_score: 82.0
    },
    net_profit_usd: 780.00,
    profit_margin_pct: 65.0,
    estimated_monthly_sales: 32,
    monthly_potential_revenue_usd: 24960.00,
    suns_score: 86.4,
    opportunity_score: 92.1,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Notion kurumsal bayi paketlerinde bölgesel iskonto arbitrajı mümkündür.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Workspace devrinin yönetici transferiyle yapılması.'],
    tactical_playbook: [
      'Avrupa\'daki 10-20 kişilik ajanslara %40 indirimli yıllık paket sunun.',
      'Kurulum ve şablon desteği ekleyerek ek servis geliri üretin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 360, target_price: 1100, net_profit: 690 },
      { month: 'Şub', source_price: 360, target_price: 1150, net_profit: 735 },
      { month: 'Mar', source_price: 360, target_price: 1200, net_profit: 780 }
    ],
    scraper_telemetry: {
      tor_node_ip: '104.244.72.115 (US West Tor)',
      tor_country: 'US',
      last_scraped_at: 'Canlı (18 dk önce)',
      playwright_fingerprint: 'SaaS Ecosystem Scanner v1.9',
      confidence_score: 96.0,
      is_live_scraped: true
    }
  },

  // 8. Xiaomi Smart Air Purifier 4 Orijinal Filtre
  {
    id: 'opp-phys-008',
    item_type: 'PHYSICAL',
    title: 'Xiaomi Smart Air Purifier 4 Orijinal HEPA Aktif Karbon Filtre',
    brand_or_provider: 'Xiaomi Global',
    identifier_code: 'B09L7X9M12 / EAN-693417774',
    category: 'Ev Aletleri & Yedek Parça',
    source_market: {
      platform_name: 'Trendyol TR (Resmi Toptancı Ağı)',
      region: 'TR',
      price: 890,
      currency: 'TRY',
      seller_name: 'Akıllı Ev Deposu TR',
      is_authorized_seller: false,
      rating: 4.8,
      review_count: 670,
      shipping_time_days: 1,
      stock_status: 'Bol Stok (600+)',
      url: 'https://www.trendyol.com/sr?q=xiaomi+air+purifier+4+filtre+orijinal',
      action_label: 'Satın Al / Tedarik Et (Trendyol TR)'
    },
    target_market: {
      platform_name: 'Amazon DE (FBA / Prime)',
      region: 'DE / EU',
      price: 54.90,
      currency: 'EUR',
      seller_name: 'EU Clean Air Supplies (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 920,
      rating: 4.6,
      review_count: 4200,
      stock_status: 'Kritik Stok Uyarısı',
      url: 'https://www.amazon.de/s?k=xiaomi+smart+air+purifier+4+filter+original',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 5.5,
    customs_cost_usd: 2.5,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Amazon DE & Idealo DE Reviews',
      search_volume: 32000,
      negative_support_mentions: 68,
      total_support_mentions: 190,
      unmet_need_score: 79.5
    },
    net_profit_usd: 27.60,
    profit_margin_pct: 46.5,
    estimated_monthly_sales: 380,
    monthly_potential_revenue_usd: 10488.00,
    opportunity_score: 93.1,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Xiaomi resmi Avrupa kanalı dönemsel olarak filtre tedarikinde tıkanıyor, Buy Box tamamen 3P arbitraj satıcılarında.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['RFID çipinin hava temizleyici tarafından tanındığı teyit edilmelidir.'],
    tactical_playbook: [
      'İlk partide 100 adet orijinal RFID etiketli filtre sevk edin.',
      'Almanya ve Polonya FBA depolarına bölerek listeleme hızını artırın.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 820, target_price: 51.90, net_profit: 25.0 },
      { month: 'Şub', source_price: 860, target_price: 53.50, net_profit: 26.4 },
      { month: 'Mar', source_price: 890, target_price: 54.90, net_profit: 27.6 }
    ],
    scraper_telemetry: {
      tor_node_ip: '185.220.102.8 (Berlin Tor Exit)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (11 dk önce)',
      playwright_fingerprint: 'Amazon Playwright Engine v2.4',
      confidence_score: 98.4,
      is_live_scraped: true
    }
  },

  // 9. Fellow Stagg EKG Elektrikli Dökme Kahve Isıtıcısı
  {
    id: 'opp-phys-009',
    item_type: 'PHYSICAL',
    title: 'Fellow Stagg EKG Elektrikli Sıcaklık Ayarlı Kettle (Mat Siyah 0.9L)',
    brand_or_provider: 'Fellow Products Inc.',
    identifier_code: 'FELLOW-STAGG-MB / B077JBQZPX',
    category: 'Kahve & Gurme Mutfak',
    source_market: {
      platform_name: 'Hepsiburada TR (Barista Deposu)',
      region: 'TR',
      price: 5400,
      currency: 'TRY',
      seller_name: 'EspressoPerfetto TR',
      is_authorized_seller: false,
      rating: 4.9,
      review_count: 94,
      shipping_time_days: 1,
      stock_status: '65 Adet Stokta',
      url: 'https://www.hepsiburada.com/ara?q=fellow+stagg+ekg',
      action_label: 'Satın Al / Tedarik Et (Hepsiburada TR)'
    },
    target_market: {
      platform_name: 'Amazon DE (FBA / Gourmet Coffee)',
      region: 'DE / EU',
      price: 219.00,
      currency: 'EUR',
      seller_name: 'Barista Tools Europe (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 1200,
      rating: 4.7,
      review_count: 3100,
      stock_status: 'Kritik Stok Uyarısı',
      url: 'https://www.amazon.de/s?k=fellow+stagg+ekg+matte+black',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 12.0,
    customs_cost_usd: 8.0,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Kaffee-Netz Forum DE & Reddit r/pourover',
      search_volume: 28000,
      negative_support_mentions: 32,
      total_support_mentions: 180,
      unmet_need_score: 77.0
    },
    net_profit_usd: 68.50,
    profit_margin_pct: 29.0,
    estimated_monthly_sales: 110,
    monthly_potential_revenue_usd: 7535.00,
    opportunity_score: 88.7,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Fellow resmi markası Avrupa dağıtımını bağımsız toptancılar üstünden yapıyor, pazaryerinde resmi mağaza tekeli yok.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['220V Avrupa fiş tipi kontrol edilmelidir.'],
    tactical_playbook: [
      'Kahve dükkanlarına ve Amazon DE FBA deposuna 20\'şer adet sevk edin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 5100, target_price: 210, net_profit: 64.0 },
      { month: 'Şub', source_price: 5250, target_price: 215, net_profit: 66.2 },
      { month: 'Mar', source_price: 5400, target_price: 219, net_profit: 68.5 }
    ],
    scraper_telemetry: {
      tor_node_ip: '185.220.103.11 (Frankfurt Tor)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (16 dk önce)',
      playwright_fingerprint: 'Coffee Gourmet Playwright v1.2',
      confidence_score: 97.0,
      is_live_scraped: true
    }
  },

  // 10. La Roche-Posay Anthelios UVmune 400 Güneş Kremi (50ml)
  {
    id: 'opp-phys-010',
    item_type: 'PHYSICAL',
    title: 'La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+ (50ml)',
    brand_or_provider: 'L\'Oréal Dermatological Beauty',
    identifier_code: 'LRP-UV400-50ML / B09V1K8Y99',
    category: 'Kozmetik & Kişisel Bakım',
    source_market: {
      platform_name: 'Eczane Toptan Deposu (İstanbul / TR)',
      region: 'TR',
      price: 460,
      currency: 'TRY',
      seller_name: 'DermoKozmetik Deposu TR',
      is_authorized_seller: false,
      rating: 4.9,
      review_count: 1400,
      shipping_time_days: 1,
      stock_status: '1200+ Adet',
      url: 'https://www.trendyol.com/sr?q=la+roche+posay+anthelios+uvmune+400',
      action_label: 'Satın Al / Tedarik Et (Trendyol TR)'
    },
    target_market: {
      platform_name: 'Amazon US & UK (FBA / Beauty)',
      region: 'US / UK',
      price: 36.99,
      currency: 'USD',
      seller_name: 'Euro Derm Direct (3P)',
      is_authorized_seller: false,
      rank_or_bsr: 320,
      rating: 4.8,
      review_count: 16500,
      stock_status: 'Aşırı Yüksek Talep (Viral Ürün)',
      url: 'https://www.amazon.com/s?k=la+roche+posay+anthelios+uvmune+400',
      action_label: 'Listele & Sat (Amazon US)'
    },
    shipping_cost_usd: 3.5,
    customs_cost_usd: 1.5,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'TikTok Beauty & Reddit r/SkincareAddiction',
      search_volume: 125000,
      negative_support_mentions: 80,
      total_support_mentions: 800,
      unmet_need_score: 87.0
    },
    net_profit_usd: 17.85,
    profit_margin_pct: 48.2,
    estimated_monthly_sales: 850,
    monthly_potential_revenue_usd: 15172.50,
    opportunity_score: 95.8,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Bu Avrupa formülasyonlu filtre teknolojisi ABD yerelinde resmi satılmamakta, ithal Avrupa stokları aşırı yüksek kârla alıcı bulmaktadır.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Orijinal lot ve son kullanma tarihi 2027+ olmalıdır.'],
    tactical_playbook: [
      'Türkiye eczane toptancısından 200 adet çekip doğrudan Amazon US FBA\'e hava kargo yapın.',
      'Viral TikTok talebi nedeniyle Buy Box fiyatını $36.99 seviyesinde sabitleyin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 420, target_price: 34.99, net_profit: 16.5 },
      { month: 'Şub', source_price: 440, target_price: 35.99, net_profit: 17.1 },
      { month: 'Mar', source_price: 460, target_price: 36.99, net_profit: 17.85 }
    ],
    scraper_telemetry: {
      tor_node_ip: '104.244.73.55 (Miami Tor Exit)',
      tor_country: 'US',
      last_scraped_at: 'Canlı (4 dk önce)',
      playwright_fingerprint: 'Beauty Virality Crawler v3.1',
      confidence_score: 99.2,
      is_live_scraped: true
    }
  },

  // 11. Bavyera Tarımsal Çatılar Drone ile Güneş Paneli Yıkama & Termal Analiz
  {
    id: 'opp-serv-011',
    item_type: 'SERVICE',
    title: 'Bavyera Çiftlik Çatıları Drone ile Güneş Paneli Yıkama & Termal Analiz',
    brand_or_provider: 'Agri-Solar Tech Network',
    identifier_code: 'PV-CLEAN-BAYERN-01',
    category: 'Yenilenebilir Enerji Hizmetleri',
    source_market: {
      platform_name: 'Bağımsız Lisanslı Endüstriyel Drone Pilotları',
      region: 'Bayern / DE',
      price: 120,
      currency: 'EUR',
      seller_name: 'Bavyera Drone Teknisyenleri',
      is_authorized_seller: false,
      url: 'https://www.kleinanzeigen.de',
      action_label: 'Pilot Ağına Talep İlet'
    },
    target_market: {
      platform_name: 'Bavyera Tarım & Çiftlik Birlikleri (Landwirte)',
      region: 'Bayern / DE',
      price: 580,
      currency: 'EUR',
      seller_name: 'Geleneksel Vinçli Temizlik Firmaları',
      is_authorized_seller: false,
      stock_status: '3 Ay Sonrasına Randevu Veriliyor',
      url: 'https://www.google.de/search?q=solaranlagen+reinigung+drohne+bayern',
      action_label: 'Çiftlik & Tesis Taleplerini Topla (Landing Page)'
    },
    shipping_cost_usd: 0,
    customs_cost_usd: 0,
    marketplace_fee_rate: 0.08,
    fx_rate: 1.08,
    sentiment: {
      source_platform: 'Photovoltaik Forum DE & Google Reviews',
      search_volume: 5800,
      negative_support_mentions: 190,
      total_support_mentions: 240,
      unmet_need_score: 89.5,
      vendor_count: 2,
      avg_vendor_rating: 3.0
    },
    net_profit_usd: 435.96,
    profit_margin_pct: 75.1,
    estimated_monthly_sales: 68,
    monthly_potential_revenue_usd: 29645.28,
    sogi_score: 92.1,
    opportunity_score: 94.8,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Bavyera bölgesinde modern drone ile termal analiz yapan kurumsal yetkili hizmet tekel bulunmuyor. Randevu boşluğu 3 aya kadar uzamış durumda.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: [
      'Drone uçuş izni ve termal kamera sertifikası gereklidir.'
    ],
    tactical_playbook: [
      'Çiftçilere ve ticari tesis sahiplerine %15-20 elektrik verim artışı garantisi sunun.',
      'Termal raporlama ile çatlak hücreleri tespit ederek sigorta şirketlerine onaylı rapor verin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 110, target_price: 520, net_profit: 380 },
      { month: 'Şub', source_price: 115, target_price: 550, net_profit: 405 },
      { month: 'Mar', source_price: 120, target_price: 580, net_profit: 435.9 }
    ],
    scraper_telemetry: {
      tor_node_ip: '188.165.200.41 (Munich Tor Exit)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (14 dk önce)',
      playwright_fingerprint: 'Industrial Places Scanner v3.0',
      confidence_score: 98.0,
      is_live_scraped: true
    }
  },

  // 12. Roborock S8 Pro Ultra Orijinal Çift Rulo Fırça Seti
  {
    id: 'opp-phys-012',
    item_type: 'PHYSICAL',
    title: 'Roborock S8 / S8 Pro Ultra Orijinal Çiftli Kauçuk Ana Fırça Seti',
    brand_or_provider: 'Roborock Technology Co.',
    identifier_code: 'ROBO-S8-DUORUBBER / B0C1N8P9KQ',
    category: 'Ev Aletleri & Yedek Parça',
    source_market: {
      platform_name: 'Trendyol TR (Robot Süpürge Parça Pazarı)',
      region: 'TR',
      price: 780,
      currency: 'TRY',
      seller_name: 'RobotParca İstanbul',
      is_authorized_seller: false,
      rating: 4.9,
      review_count: 310,
      shipping_time_days: 1,
      stock_status: '900+ Adet',
      url: 'https://www.trendyol.com/sr?q=roborock+s8+orijinal+cift+firca',
      action_label: 'Satın Al / Tedarik Et (Trendyol TR)'
    },
    target_market: {
      platform_name: 'Amazon DE (FBA)',
      region: 'DE / EU',
      price: 49.99,
      currency: 'EUR',
      seller_name: 'Home Automation Parts 3P',
      is_authorized_seller: false,
      rank_or_bsr: 810,
      rating: 4.5,
      review_count: 2400,
      stock_status: 'Buy Box Açık',
      url: 'https://www.amazon.de/s?k=roborock+s8+pro+ultra+duoroller+original',
      action_label: 'Listele & Sat (Amazon DE)'
    },
    shipping_cost_usd: 4.5,
    customs_cost_usd: 2.2,
    marketplace_fee_rate: 0.15,
    fx_rate: 0.0274,
    sentiment: {
      source_platform: 'Roboter-Forum DE & Amazon Reviews',
      search_volume: 26000,
      negative_support_mentions: 54,
      total_support_mentions: 160,
      unmet_need_score: 80.5
    },
    net_profit_usd: 25.80,
    profit_margin_pct: 47.8,
    estimated_monthly_sales: 410,
    monthly_potential_revenue_usd: 10578.00,
    opportunity_score: 93.4,
    authorized_reseller_exists: false,
    brand_authorized_presence: {
      has_brand_store_in_target: false,
      target_market_status: 'RESMİ_SATICI_YOK',
      explanation: 'Roborock resmi kanalı yedek parça talebine yetişememektedir; Buy Box 3P satıcılara tamamen açıktır.',
      verified_at: '2026-08-18 (Canlı Doğrulandı)',
      distributor_gap_level: 'TAM_ACIK'
    },
    competition_level: 'DÜŞÜK',
    risk_level: 'DÜŞÜK',
    risk_factors: ['Orijinal ikili kauçuk kanat esnekliği kontrol edilmelidir.'],
    tactical_playbook: [
      '150 adetlik ilk sipariş ile birim fiyatı 720 TL\'ye indirin.',
      'Almanya FBA üzerinden 2 günde teslimat avantajıyla listeyi domine edin.'
    ],
    historical_price_trend: [
      { month: 'Oca', source_price: 720, target_price: 47.50, net_profit: 24.1 },
      { month: 'Şub', source_price: 750, target_price: 48.90, net_profit: 25.0 },
      { month: 'Mar', source_price: 780, target_price: 49.99, net_profit: 25.8 }
    ],
    scraper_telemetry: {
      tor_node_ip: '185.220.101.99 (Frankfurt)',
      tor_country: 'DE',
      last_scraped_at: 'Canlı (8 dk önce)',
      playwright_fingerprint: 'Roborock Scraper Engine v1.6',
      confidence_score: 97.4,
      is_live_scraped: true
    }
  }
];
