import { TorScraperLog } from '../src/types';

interface TorNode {
  ip: string;
  country: string;
  city: string;
  bandwidth_mbps: number;
}

const TOR_EXIT_NODES: TorNode[] = [
  { ip: '185.220.101.54', country: 'DE', city: 'Frankfurt', bandwidth_mbps: 120 },
  { ip: '198.51.100.22', country: 'CH', city: 'Zurich', bandwidth_mbps: 95 },
  { ip: '185.195.233.71', country: 'DE', city: 'Berlin', bandwidth_mbps: 110 },
  { ip: '104.244.72.115', country: 'US', city: 'New York', bandwidth_mbps: 140 },
  { ip: '194.156.125.8', country: 'UK', city: 'London', bandwidth_mbps: 130 },
  { ip: '178.17.170.10', country: 'CZ', city: 'Prague', bandwidth_mbps: 85 },
  { ip: '85.105.44.19', country: 'TR', city: 'Istanbul', bandwidth_mbps: 90 },
  { ip: '103.253.144.2', country: 'SG', city: 'Singapore', bandwidth_mbps: 150 },
];

let currentNodeIndex = 0;
let totalRotations = 42;
let totalRequests = 1450;
let bypassCount = 389;

const recentLogs: TorScraperLog[] = [
  {
    id: 'log-001',
    timestamp: 'Yeni',
    tor_ip: TOR_EXIT_NODES[0].ip,
    country: TOR_EXIT_NODES[0].country,
    action: 'Scrape Amazon.de (ASIN: B09J87W8K9) / Stealthed Playwright',
    target_url: 'https://www.amazon.de/dp/B09J87W8K9',
    status: 'SUCCESS',
    latency_ms: 382
  },
  {
    id: 'log-002',
    timestamp: '1 dk önce',
    tor_ip: TOR_EXIT_NODES[1].ip,
    country: TOR_EXIT_NODES[1].country,
    action: 'Signal.NEWNYM Tor Controller Handshake on port 9051',
    target_url: 'tor-control://127.0.0.1:9051',
    status: 'ROTATING',
    latency_ms: 120
  },
  {
    id: 'log-003',
    timestamp: '3 dk önce',
    tor_ip: TOR_EXIT_NODES[2].ip,
    country: TOR_EXIT_NODES[2].country,
    action: 'Google Places Local Service Reviews Extraction (Berlin / Notdienst)',
    target_url: 'https://maps.googleapis.com/places/api',
    status: 'CAPTCHA_BYPASSED',
    latency_ms: 490
  }
];

export function rotateTorIP(): { new_ip: string; country: string; city: string } {
  currentNodeIndex = (currentNodeIndex + 1) % TOR_EXIT_NODES.length;
  totalRotations++;
  const node = TOR_EXIT_NODES[currentNodeIndex];

  const logEntry: TorScraperLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: 'Şimdi',
    tor_ip: node.ip,
    country: node.country,
    action: `Tor IP Rotated (Signal.NEWNYM) -> ${node.city} (${node.country})`,
    target_url: `socks5://127.0.0.1:9050 -> ${node.ip}`,
    status: 'ROTATING',
    latency_ms: Math.floor(Math.random() * 80) + 90
  };

  recentLogs.unshift(logEntry);
  if (recentLogs.length > 25) recentLogs.pop();

  return {
    new_ip: node.ip,
    country: node.country,
    city: node.city
  };
}

export function getCurrentTorStatus() {
  const currentNode = TOR_EXIT_NODES[currentNodeIndex];
  return {
    is_active: true,
    tor_proxy: 'socks5://127.0.0.1:9050',
    controller_port: 9051,
    current_node: currentNode,
    stats: {
      total_rotations: totalRotations,
      total_scrapes: totalRequests,
      captcha_bypassed: bypassCount,
      active_workers: 4,
      avg_latency_ms: 310
    },
    recent_logs: recentLogs
  };
}

export function addScrapeJobLog(action: string, targetUrl: string, status: TorScraperLog['status'] = 'SUCCESS') {
  totalRequests++;
  if (status === 'CAPTCHA_BYPASSED') bypassCount++;

  const currentNode = TOR_EXIT_NODES[currentNodeIndex];
  const logEntry: TorScraperLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: 'Yeni',
    tor_ip: currentNode.ip,
    country: currentNode.country,
    action: action,
    target_url: targetUrl,
    status: status,
    latency_ms: Math.floor(Math.random() * 350) + 180
  };

  recentLogs.unshift(logEntry);
  if (recentLogs.length > 25) recentLogs.pop();
}
