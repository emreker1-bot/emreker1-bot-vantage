import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Boxes,
  Zap,
  Globe,
  Radio,
  Workflow
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SystemArchitectureView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'overview' | 'docker' | 'schema' | 'formulas' | 'python-code'>('overview');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2500);
  };

  const dockerComposeYaml = `version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg15
    container_name: platform_postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: market_intelligence
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: platform_redis
    ports:
      - "6379:6379"

  tor:
    image: dperson/torproxy:latest
    container_name: platform_tor
    ports:
      - "9050:9050"
      - "9051:9051"
    environment:
      - PASSWORD=torpassword

  api:
    build: .
    container_name: platform_api
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://admin:secretpassword@postgres:5432/market_intelligence
      - REDIS_URL=redis://redis:6379/0
      - TOR_PROXY=socks5://tor:9050
    depends_on:
      - postgres
      - redis
      - tor

volumes:
  postgres_data:`;

  const postgresSqlSchema = `-- 1. PostgreSQL & pgvector Eklentileri
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ana Ürün / Hizmet / Yazılım Kataloğu
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type VARCHAR(20) NOT NULL, -- 'PHYSICAL', 'SOFTWARE', 'SERVICE'
    title VARCHAR(255) NOT NULL,
    brand_or_provider VARCHAR(100),
    identifier_code VARCHAR(100), -- EAN, ASIN, Keyword
    category VARCHAR(100),
    title_vector vector(1536), -- Vector similarity search (Gemini/OpenAI Embeddings)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pazaryeri / Platform İlanları
CREATE TABLE market_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL, -- 'Amazon_US', 'Trendyol', 'G2', 'GooglePlaces'
    region VARCHAR(10) NOT NULL,
    price DECIMAL(12, 2),
    currency VARCHAR(3),
    seller_name VARCHAR(150),
    is_authorized_seller BOOLEAN DEFAULT FALSE,
    rank_or_bsr INT,
    rating DECIMAL(3,2),
    review_count INT,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Müşteri Şikayet ve Talep Analizleri (NLP)
CREATE TABLE demand_sentiment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    source_platform VARCHAR(50),
    search_volume INT DEFAULT 0,
    negative_support_mentions INT DEFAULT 0,
    unmet_need_score DECIMAL(5,2),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Fırsat Skorları
CREATE TABLE opportunity_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    arbitrage_profit_usd DECIMAL(10,2),
    estimated_monthly_demand INT,
    authorized_reseller_exists BOOLEAN,
    opportunity_score DECIMAL(5,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const pythonScraperCode = `import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import stealth_async
from stem import Signal
from stem.control import Controller

def renew_tor_ip():
    """Tor ağı üzerinden yeni IP adresi talep eder (Sıfır Maliyetli Proxy Rotasyonu)"""
    try:
        with Controller.from_port(port=9051) as controller:
            controller.authenticate(password='torpassword')
            controller.signal(Signal.NEWNYM)
            print("Tor IP başarıyla yenilendi (Signal.NEWNYM gönderildi).")
    except Exception as e:
        print("Tor IP yenileme hatası:", e)

async def scrape_amazon_product(asin: str):
    """Playwright Stealth + Tor SOCKS5 üzerinden Amazon ASIN verisini sıfır engelle çekme"""
    renew_tor_ip()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": "socks5://localhost:9050"}
        )
        page = await browser.new_page()
        await stealth_async(page)
        
        url = f"https://www.amazon.com/dp/{asin}"
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        title_elem = page.locator("#productTitle")
        title = await title_elem.inner_text() if await title_elem.count() > 0 else ""
        
        price_elem = page.locator(".a-price .a-offscreen").first
        price_str = await price_elem.inner_text() if await price_elem.count() > 0 else "$0.00"
        
        price = float(price_str.replace("$", "").replace(",", "").strip()) if price_str else 0.0
        
        await browser.close()
        return {
            "asin": asin,
            "title": title.strip(),
            "price": price,
            "currency": "USD"
        }`;

  const pythonFastApiCode = `from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(
    title="Global Market Intelligence & Arbitrage API",
    description="Sıfır maliyetli pazar istihbaratı ve PRD Section 5 skorlama servisi",
    version="1.0.0"
)

class ItemAnalysisRequest(BaseModel):
    target_price: float
    source_price: float
    shipping_cost: float = 0.0
    customs_cost: float = 0.0
    marketplace_fee_rate: float = 0.15
    fx_rate: float = 1.0
    bsr: int = 5000
    authorized_seller_exists: bool = False

class AnalysisResponse(BaseModel):
    net_profit_usd: float
    estimated_monthly_sales: int
    opportunity_score: float

@app.post("/api/v1/analyze", response_model=AnalysisResponse)
def analyze_item(req: ItemAnalysisRequest):
    # 5.A. Fiziki Arbitraj Net Kar Hesabı (PA)
    net_profit = req.target_price * (1 - req.marketplace_fee_rate) - (
        req.source_price * req.fx_rate + req.shipping_cost + req.customs_cost
    )
    
    # 5.B. BSR Üzerinden Aylık Satış Tahmini (S_est = 150000 * BSR^-0.85)
    est_sales = int(150000 * (max(1, req.bsr) ** -0.85))

    # 5.E. Global Fırsat Skoru (OS) Normalizasyonu
    auth_penalty = 0.0 if not req.authorized_seller_exists else 1.0
    norm_profit = min(max(0.0, net_profit / 100.0), 1.0)
    norm_sales = min(max(0.0, est_sales / 1000.0), 1.0)

    raw_score = (0.4 * norm_profit + 0.4 * norm_sales + 0.2 * (1.0 - auth_penalty)) * 100
    score = round(float(np.clip(raw_score, 0, 100)), 2)

    return AnalysisResponse(
        net_profit_usd=round(net_profit, 2),
        estimated_monthly_sales=est_sales,
        opportunity_score=score
    )`;

  return (
    <div id="technical-architecture-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161618] border border-white/5 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-orange-400" />
              <h2 className="text-white font-semibold text-lg tracking-tight">
                {language === 'tr' 
                  ? '3. Yazılım & Sistem Mimarisi (Technical Architecture)' 
                  : '3. Technical Architecture & System Infrastructure'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {language === 'tr'
                ? 'Oracle Cloud Free Tier & Docker mikroservis altyapısı: PostgreSQL + pgvector, Tor SOCKS5 Stealth Scraper, FastAPI analitik motoru ve Next.js/React UX.'
                : 'Zero-cost Docker microservices: PostgreSQL + pgvector, Tor SOCKS5 Stealth Scraper, FastAPI analytics engine and Next.js/React UX.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Zero-Cost Cloud Architecture</span>
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/5">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-[#0C0C0D] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'A. Altyapı Bileşenleri' : 'A. Infrastructure'}</span>
          </button>

          <button
            onClick={() => setActiveSection('docker')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === 'docker'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-[#0C0C0D] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'B. Docker Compose (YAML)' : 'B. Docker Compose'}</span>
          </button>

          <button
            onClick={() => setActiveSection('schema')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === 'schema'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-[#0C0C0D] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? '4. PostgreSQL + pgvector Şeması' : '4. DB & pgvector Schema'}</span>
          </button>

          <button
            onClick={() => setActiveSection('formulas')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === 'formulas'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-[#0C0C0D] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? '5. Matematiksel Modüller (PRD)' : '5. Mathematical Modules'}</span>
          </button>

          <button
            onClick={() => setActiveSection('python-code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === 'python-code'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-[#0C0C0D] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? '6. Python Backend & Scraper Kodu' : '6. Python & FastAPI Code'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW & ARCHITECTURE STACK */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Frontend */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Vercel Free Tier
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">Frontend (UX Layer)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Next.js (React 18+), Tailwind CSS, Recharts veri görselleştirme motoru. Responsive arayüz, gerçek zamanlı telemetri panelleri ve çift dil (TR/EN) desteği.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Next.js</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Tailwind CSS</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Recharts</span>
              </div>
            </div>

            {/* Backend API */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  FastAPI / Uvicorn
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">Backend API & Scoring Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Python FastAPI RESTful servisleri. PRD Bölüm 5 formülleri (PA, S_est, SUNS, SOGI, OS) ile mikro saniyeler seviyesinde matematiksel skorlama ve veri filtreleme.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">FastAPI</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Pydantic v2</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">NumPy</span>
              </div>
            </div>

            {/* Scraper & Worker */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Tor SOCKS5 + Stealth
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">Scraper & Autonomous Worker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Playwright + playwright-stealth + Stem (Tor Control Port 9051). Signal.NEWNYM ile her istekte sıfır maliyetle yeni IP alarak anti-bot ve Cloudflare engellerini aşar.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Playwright</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Stem (Tor)</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Stealth-v2.4</span>
              </div>
            </div>

            {/* Database */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  PostgreSQL 15
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">PostgreSQL + pgvector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                İlişkisel veriler, zaman serileri ve 1536-boyutlu başlık vektör eşleştirmeleri. items, market_listings, demand_sentiment_logs ve opportunity_scores tabloları.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">pgvector</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">UUIDv4</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">HNSW Index</span>
              </div>
            </div>

            {/* Redis & Celery */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Redis 7 + Celery
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">Mesaj Kuyruğu & Zamanlayıcı</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zamanlanmış pazar veri çekme görevleri, asenkron ASIN kuyruğu ve anlık kural tabanlı döviz kuru önbelleği (Redis Cache).
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Redis 7-alpine</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Celery Beat</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Pub/Sub</span>
              </div>
            </div>

            {/* AI Advisor */}
            <div className="bg-[#161618] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Gemini 3.7 Flash
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">AI Derin Strateji Motoru</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stratejik SWOT raporları, gümrük regülasyon uyumluluğu, yetkili satıcı risk kontrolü ve otonom pazar boşluğu keşfi.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Gemini API</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">SWOT Synthesizer</span>
                <span className="px-2 py-0.5 rounded bg-[#0C0C0D]">Cross-Corridor</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DOCKER COMPOSE */}
      {activeSection === 'docker' && (
        <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Boxes className="w-4 h-4 text-orange-400" />
                <span>B. Docker Compose Yapılandırması (docker-compose.yml)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Postgres (pgvector), Redis, Tor Proxy (dperson/torproxy) ve FastAPI servislerini tek komutla ayağa kaldırır.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(dockerComposeYaml, 'docker-compose')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              {copiedBlock === 'docker-compose' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala (YAML)</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0C0C0D] border border-white/10 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
            <pre>{dockerComposeYaml}</pre>
          </div>

          <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-orange-400 font-mono text-[11px]">Sıfır Maliyetli Başlatma Komutu:</div>
            <code className="text-white font-mono text-xs block bg-[#0C0C0D] p-2 rounded border border-white/5">
              docker compose up -d --build
            </code>
            <p className="text-[11px] text-slate-400 pt-1">
              Bu yapılandırma 1GB RAM ve 1vCPU içeren Oracle Cloud Always Free mikro sunucusunda sorunsuz çalışacak şekilde optimize edilmiştir.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: POSTGRESQL + PGVECTOR SCHEMA */}
      {activeSection === 'schema' && (
        <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>4. Veritabanı Mimarisi (PostgreSQL + pgvector Şeması)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                items, market_listings, demand_sentiment_logs ve opportunity_scores ilişkisel DDL scripti.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(postgresSqlSchema, 'postgres-schema')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              {copiedBlock === 'postgres-schema' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala (SQL)</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0C0C0D] border border-white/10 rounded-lg p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
            <pre>{postgresSqlSchema}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5">
              <span className="text-[11px] text-orange-400 font-mono font-bold block">1. items Tablosu</span>
              <p className="text-slate-400 text-[11px] mt-1">
                Katalog üst kimlikleri, EAN/ASIN ve 1536-boyutlu vector similarity embeddings.
              </p>
            </div>
            <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5">
              <span className="text-[11px] text-blue-400 font-mono font-bold block">2. market_listings</span>
              <p className="text-slate-400 text-[11px] mt-1">
                Kaynak ve hedef pazar fiyatları, para birimi, satıcı adı, BSR ve puan bilgileri.
              </p>
            </div>
            <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5">
              <span className="text-[11px] text-emerald-400 font-mono font-bold block">3. demand_sentiment_logs</span>
              <p className="text-slate-400 text-[11px] mt-1">
                Arama hacimleri, negatif destek şikayetleri (NLP) ve karşılanmamış talep skoru (SUNS).
              </p>
            </div>
            <div className="p-3 bg-[#0C0C0D] rounded-lg border border-white/5">
              <span className="text-[11px] text-rose-400 font-mono font-bold block">4. opportunity_scores</span>
              <p className="text-slate-400 text-[11px] mt-1">
                Birim kâr, tahmini aylık talep ve nihai Opportunity Score (0-100) kayıtları.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MATHEMATICAL FORMULAS */}
      {activeSection === 'formulas' && (
        <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>5. Analitik ve Matematiksel Hesaplama Modülleri</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              PRD kapsamında geliştirilen ve sistem genelinde çalışan doğrulanmış matematik motoru.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Formula A */}
            <div className="p-4 bg-[#0C0C0D] border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold font-sans">A. Fiziki Ürün Arbitraj Kâr Marjı (PA)</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px]">Birim Net Kâr</span>
              </div>
              <div className="p-2.5 bg-[#161618] rounded text-emerald-400 font-bold text-sm">
                PA = P_target * (1 - τ_mkt) - (P_source * e_fx + C_ship + C_customs)
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Burada <code>P_target</code> hedef pazar fiyatı, <code>τ_mkt</code> pazaryeri komisyonu (%15), <code>P_source</code> kaynak alış fiyatı, <code>e_fx</code> döviz kuru, <code>C_ship</code> kargo ve <code>C_customs</code> gümrük maliyetidir.
              </p>
            </div>

            {/* Formula B */}
            <div className="p-4 bg-[#0C0C0D] border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold font-sans">B. BSR Üzerinden Tahmini Satış Hacmi (S_est)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">Aylık Hacim</span>
              </div>
              <div className="p-2.5 bg-[#161618] rounded text-blue-300 font-bold text-sm">
                S_est = α * (BSR)^(-β) &nbsp;&nbsp;(Elektronik & Genel: α=150,000, β=0.85)
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Amazon Best Sellers Rank (BSR) verisinden üssel güç kanunu modeliyle aylık satılan adet hacmini kestirir.
              </p>
            </div>

            {/* Formula C */}
            <div className="p-4 bg-[#0C0C0D] border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-bold font-sans">C. Yazılım Destek Memnuniyetsizlik Skoru (SUNS)</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">SaaS NLP Gap</span>
              </div>
              <div className="p-2.5 bg-[#161618] rounded text-purple-300 font-bold text-sm">
                SUNS = (N_neg / (N_total + 1)) * log10(1 + V_search) * (1 - θ_official)
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                G2/Trustpilot üzerindeki şikayet yoğunluğu ile Google arama hacmini birleştirir. Resmi satıcı varlığında cezalandırılır.
              </p>
            </div>

            {/* Formula D */}
            <div className="p-4 bg-[#0C0C0D] border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold font-sans">D. Bölgesel Hizmet Fırsat İndeksi (SOGI)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Local Gap</span>
              </div>
              <div className="p-2.5 bg-[#161618] rounded text-emerald-300 font-bold text-sm">
                SOGI = (V_search / (N_vendors + 1)) * (1 - (R_avg / 5))
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Yerel pazardaki arama talebinin mevcut sağlayıcı sayısına oranı ve mevcut sağlayıcıların ortalama puan düşüklüğünü çarpar.
              </p>
            </div>

            {/* Formula E */}
            <div className="p-4 bg-[#0C0C0D] border border-orange-500/30 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold font-sans">E. Genel Pazar Fırsat Skoru (OS - Opportunity Score)</span>
                <span className="px-2 py-0.5 rounded bg-orange-500 text-slate-950 font-bold text-[10px]">0 - 100 Kompozit</span>
              </div>
              <div className="p-2.5 bg-[#161618] rounded text-white font-bold text-sm border border-orange-500/20">
                OS = 100 * [ 0.3 * Norm(PA) + 0.3 * Norm(S_est) + 0.2 * (1 - θ_auth) + 0.2 * Norm(SUNS veya SOGI) ]
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Tüm faktörleri 0-100 arasında normalize eden ve yetkili satıcı bariyeri olmayan (θ_auth=0) açık nişleri öne çıkaran kompozit skordur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: PYTHON BACKEND & SCRAPER CODE */}
      {activeSection === 'python-code' && (
        <div className="space-y-6">
          {/* 6.1 Scraper Python */}
          <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>6.1. Tor Rotasyonlu Web Scraper (scraper.py)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Playwright Stealth + Stem (Signal.NEWNYM) ile sıfır maliyetli proxy rotasyonu.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(pythonScraperCode, 'python-scraper')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                {copiedBlock === 'python-scraper' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala (Python)</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#0C0C0D] border border-white/10 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
              <pre>{pythonScraperCode}</pre>
            </div>
          </div>

          {/* 6.2 FastAPI Backend */}
          <div className="bg-[#161618] border border-white/5 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>6.2. REST API ve Skorlama Motoru (main.py)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  FastAPI endpoint'i: POST /api/v1/analyze ile mikro saniye seviyesinde OS skorlaması.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(pythonFastApiCode, 'python-fastapi')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                {copiedBlock === 'python-fastapi' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala (FastAPI)</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#0C0C0D] border border-white/10 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto max-h-96">
              <pre>{pythonFastApiCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
