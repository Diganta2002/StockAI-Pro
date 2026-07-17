/* ============================================================
   StockAI Pro — app.js
   Comprehensive JavaScript for all interactions & AI features
   ============================================================ */

// ================================================================
// DATA LAYER — Simulated live market data
// ================================================================
const STOCK_DB = {
  TCS: { name: 'Tata Consultancy Services', price: 3842.15, change: +1.34, sector: 'IT', pe: 28.4, mcap: 'large', volume: '12.3M', roe: 45.2, debt: 0.1, dividend: 1.8, signal: 'buy' },
  INFY: { name: 'Infosys Ltd', price: 1672.80, change: -0.82, sector: 'IT', pe: 24.1, mcap: 'large', volume: '18.7M', roe: 32.1, debt: 0.0, dividend: 2.3, signal: 'hold' },
  RELIANCE: { name: 'Reliance Industries', price: 2918.40, change: +0.67, sector: 'Energy', pe: 23.5, mcap: 'large', volume: '22.1M', roe: 12.8, debt: 0.4, dividend: 0.6, signal: 'buy' },
  HDFCBANK: { name: 'HDFC Bank Ltd', price: 1784.25, change: +2.14, sector: 'Banking', pe: 18.9, mcap: 'large', volume: '15.4M', roe: 17.5, debt: 6.8, dividend: 1.3, signal: 'buy' },
  WIPRO: { name: 'Wipro Ltd', price: 568.30, change: -1.23, sector: 'IT', pe: 21.7, mcap: 'large', volume: '9.8M', roe: 18.9, debt: 0.2, dividend: 1.1, signal: 'hold' },
  AXISBANK: { name: 'Axis Bank Ltd', price: 1092.55, change: +3.21, sector: 'Banking', pe: 14.3, mcap: 'large', volume: '11.2M', roe: 15.4, debt: 7.2, dividend: 0.9, signal: 'buy' },
  SUNPHARMA: { name: 'Sun Pharmaceutical', price: 1623.70, change: +1.88, sector: 'Pharma', pe: 31.5, mcap: 'large', volume: '6.4M', roe: 22.3, debt: 0.1, dividend: 0.5, signal: 'watch' },
  MARUTI: { name: 'Maruti Suzuki India', price: 12480.00, change: +0.94, sector: 'Auto', pe: 26.8, mcap: 'large', volume: '4.2M', roe: 18.6, debt: 0.0, dividend: 1.2, signal: 'buy' },
  ITC: { name: 'ITC Ltd', price: 481.20, change: -0.34, sector: 'FMCG', pe: 26.1, mcap: 'large', volume: '28.6M', roe: 29.7, debt: 0.0, dividend: 3.7, signal: 'hold' },
  BAJFINANCE: { name: 'Bajaj Finance Ltd', price: 8124.50, change: +2.56, sector: 'Banking', pe: 32.4, mcap: 'large', volume: '5.1M', roe: 21.8, debt: 4.1, dividend: 0.5, signal: 'watch' },
  TATASTEEL: { name: 'Tata Steel Ltd', price: 168.45, change: -2.15, sector: 'Metal', pe: 9.7, mcap: 'large', volume: '44.3M', roe: 15.2, debt: 1.8, dividend: 2.1, signal: 'hold' },
  POWERGRID: { name: 'Power Grid Corp', price: 334.80, change: +0.89, sector: 'Energy', pe: 17.2, mcap: 'large', volume: '20.1M', roe: 20.8, debt: 1.9, dividend: 4.1, signal: 'buy' },
  CDSL: { name: 'Central Depository Services', price: 2180.60, change: +4.31, sector: 'Finance', pe: 62.4, mcap: 'mid', volume: '2.8M', roe: 38.4, debt: 0.0, dividend: 1.9, signal: 'watch' },
  TRENT: { name: 'Trent Ltd', price: 6840.25, change: +5.12, sector: 'Retail', pe: 182.6, mcap: 'mid', volume: '1.2M', roe: 22.1, debt: 0.3, dividend: 0.3, signal: 'watch' },
  NYKAA: { name: 'FSN E-Commerce (Nykaa)', price: 184.20, change: -3.44, sector: 'Retail', pe: 310.5, mcap: 'mid', volume: '8.7M', roe: 5.8, debt: 0.2, dividend: 0.0, signal: 'sell' }
};

const INDICES = [
  { name: 'NIFTY 50', symbol: 'NIFTY', value: 24832.15, change: +1.24, pct: '+1.24%', trend: [24200, 24310, 24280, 24450, 24620, 24580, 24710, 24780, 24832] },
  { name: 'SENSEX', symbol: 'SENSEX', value: 81674.40, change: +1.19, pct: '+1.19%', trend: [80200, 80450, 80380, 80720, 81100, 81050, 81350, 81520, 81674] },
  { name: 'NIFTY BANK', symbol: 'BANKNIFTY', value: 52840.30, change: +1.87, pct: '+1.87%', trend: [51800, 52000, 51950, 52200, 52480, 52420, 52630, 52750, 52840] },
  { name: 'NIFTY IT', symbol: 'NIFTYIT', value: 38210.80, change: -0.43, pct: '-0.43%', trend: [38600, 38500, 38450, 38350, 38280, 38220, 38190, 38240, 38211] },
  { name: 'NIFTY MIDCAP', symbol: 'MIDCAP', value: 54120.65, change: +0.78, pct: '+0.78%', trend: [53700, 53750, 53820, 53880, 53960, 54010, 54070, 54100, 54121] },
  { name: 'NIFTY PHARMA', symbol: 'PHARMA', value: 21384.20, change: +1.12, pct: '+1.12%', trend: [21100, 21150, 21200, 21220, 21280, 21320, 21350, 21370, 21384] }
];

const SECTORS = [
  { name: 'Banking', change: +2.14, stocks: 38 },
  { name: 'IT', change: -0.43, stocks: 22 },
  { name: 'Auto', change: +0.94, stocks: 15 },
  { name: 'Pharma', change: +1.88, stocks: 31 },
  { name: 'FMCG', change: -0.21, stocks: 16 },
  { name: 'Energy', change: +1.24, stocks: 11 },
  { name: 'Metals', change: -1.54, stocks: 14 },
  { name: 'Realty', change: +3.12, stocks: 9 },
  { name: 'Telecom', change: +0.67, stocks: 6 },
  { name: 'Infra', change: +1.03, stocks: 19 },
  { name: 'Consumer', change: -0.82, stocks: 21 },
  { name: 'Defence', change: +2.54, stocks: 8 }
];

const NEWS = [
  { source: 'Economic Times', time: '15 min ago', headline: 'RBI holds repo rate steady at 6.5% amid easing inflation concerns', summary: 'The Reserve Bank of India maintained its benchmark interest rate, signaling a cautious stance as inflation trends lower but global uncertainties persist.', sentiment: 'bullish', tags: ['RBI', 'Inflation', 'Banking'] },
  { source: 'Moneycontrol', time: '42 min ago', headline: 'TCS bags ₹8,000 crore deal with UK-based financial services firm', summary: 'Tata Consultancy Services announced a major multi-year digital transformation contract, boosting investor confidence in the IT giant.', sentiment: 'bullish', tags: ['TCS', 'IT Sector', 'Deal'] },
  { source: 'Business Standard', time: '1h ago', headline: 'FIIs pump ₹6,240 crore into Indian equities — second consecutive week of inflows', summary: 'Foreign institutional investors continued to show confidence in Indian markets amid favorable macroeconomic conditions and strong corporate earnings.', sentiment: 'bullish', tags: ['FII', 'Capital Flows', 'Equity'] },
  { source: 'LiveMint', time: '2h ago', headline: 'Crude oil slips below $78 — positive signal for India\'s current account', summary: 'International crude oil prices fell sharply on demand concerns from China, potentially easing India\'s import bill and helping the rupee stabilize.', sentiment: 'neutral', tags: ['Crude Oil', 'Rupee', 'Macro'] },
  { source: 'NDTV Profit', time: '3h ago', headline: 'Midcap, smallcap indices outperform Nifty 50 for fifth straight session', summary: 'Broader market indices continued their strong run amid robust domestic retail participation and positive earnings outlook for mid-size companies.', sentiment: 'bullish', tags: ['Midcap', 'Smallcap', 'Rally'] },
  { source: 'Reuters India', time: '4h ago', headline: 'US Fed minutes signal potential rate cut in September — global markets rally', summary: 'Minutes from the latest Federal Reserve meeting suggest policymakers are increasingly open to cutting rates this year, lifting risk assets globally.', sentiment: 'bullish', tags: ['US Fed', 'Global Markets', 'Rate Cut'] },
  { source: 'PTI', time: '5h ago', headline: 'India\'s manufacturing PMI hits 3-month high at 58.4 in June', summary: 'The Purchasing Managers\' Index for Indian manufacturing rose to its highest level in three months, indicating strong industrial activity and demand.', sentiment: 'bullish', tags: ['PMI', 'Manufacturing', 'Growth'] },
  { source: 'Bloomberg Quint', time: '6h ago', headline: 'Nykaa Q1FY27 results disappoint — revenue misses estimates by 8%', summary: 'FSN E-Commerce Ventures reported quarterly revenue below analyst estimates, leading to a sharp drop in the stock amid concerns over profitability timeline.', sentiment: 'bearish', tags: ['Nykaa', 'Results', 'Retail'] },
  { source: 'Zee Business', time: '8h ago', headline: 'Gold prices surge to ₹76,500/10g — safe-haven demand spikes', summary: 'Bullion rallied sharply as geopolitical tensions and currency volatility drove investors toward traditional safe-haven assets.', sentiment: 'neutral', tags: ['Gold', 'Commodities', 'Safe Haven'] }
];

const AI_RESPONSES = {
  greetings: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'],
  market: {
    keywords: ['market', 'nifty', 'sensex', 'today', 'outlook', 'trend'],
    response: `📊 **Market Snapshot (Today):**\n\n🟢 NIFTY 50: 24,832 (+1.24%)\n🟢 SENSEX: 81,674 (+1.19%)\n🟢 BANK NIFTY: 52,840 (+1.87%)\n🔴 NIFTY IT: 38,211 (-0.43%)\n\n**AI Outlook:** Markets are showing bullish momentum driven by:\n• Strong FII inflows (₹6,240 Cr this week)\n• RBI's steady policy stance\n• Positive global cues from US Fed\n• Robust domestic demand indicators\n\nKey support for NIFTY is at 24,400; resistance at 25,200.`
  },
  pe: {
    keywords: ['pe ratio', 'price to earnings', 'pe', 'what is pe'],
    response: `📘 **P/E Ratio Explained:**\n\nThe **Price-to-Earnings (P/E) ratio** measures how much investors pay for every ₹1 of a company's earnings.\n\n**Formula:** P/E = Stock Price ÷ Earnings Per Share (EPS)\n\n🔵 **Low P/E (<15):** Potentially undervalued, or slow growth expected\n🟡 **Moderate P/E (15–30):** Fairly valued for most sectors\n🔴 **High P/E (>30):** High growth expected or possibly overvalued\n\n**Example:** TCS at P/E 28.4 vs. sector average 25 → slightly premium but justified by consistent earnings growth.`
  },
  tcs: {
    keywords: ['tcs', 'tata consultancy', 'analyze tcs', 'tcs stock'],
    response: `🔍 **TCS (Tata Consultancy Services) — AI Analysis:**\n\n**Current Price:** ₹3,842 (+1.34%)\n**AI Signal:** 🟢 Strong Buy\n\n📊 **Key Metrics:**\n• P/E: 28.4 (vs IT avg 25.8)\n• ROE: 45.2% — Excellent\n• Dividend Yield: 1.8%\n• Debt-to-Equity: 0.1 (Near-debt-free)\n\n✅ **Strengths:** Massive deal wins (₹8,000 Cr new contract), margin improvement, strong cash generation, leader in AI/cloud services\n\n⚠️ **Risks:** INR appreciation, attrition pressure, global IT spend slowdown\n\n🎯 **AI Target:** ₹4,200 (12-month horizon, +9.3% upside)`
  },
  risk: {
    keywords: ['risk', 'portfolio risk', 'reduce risk', 'diversify', 'safe'],
    response: `🛡️ **How to Reduce Portfolio Risk:**\n\n**1. Diversify Across Sectors**\nDon't put more than 20% in any single sector. Mix IT, Banking, FMCG, Pharma.\n\n**2. The 5% Rule**\nLimit individual stock exposure to max 5–10% of portfolio.\n\n**3. Add Defensive Stocks**\nFMCG (ITC, HUL) and Pharma stocks tend to hold up in downturns.\n\n**4. Maintain Cash Buffer**\nKeep 10–15% cash for averaging down or new opportunities.\n\n**5. Use Stop-Losses**\nSet stop-loss at 8–12% below your buy price.\n\n**6. Balance Large & Mid Cap**\n70% large cap + 30% mid cap = Good risk-reward balance.`
  },
  buy: {
    keywords: ['best stocks', 'buy today', 'which stock', 'recommend', 'top picks', 'investment ideas'],
    response: `🎯 **AI Top Picks — July 2026:**\n\n**Strong Buy:**\n1. 🟢 **HDFC Bank** (₹1,784) — Banking leader, rate cut beneficiary\n2. 🟢 **TCS** (₹3,842) — Mega deal wins, margin expansion\n3. 🟢 **Reliance** (₹2,918) — Jio growth, retail momentum\n4. 🟢 **Maruti Suzuki** (₹12,480) — EV transition, record volumes\n5. 🟢 **Power Grid** (₹334) — Green energy capex play\n\n**Watchlist:**\n• Sun Pharma — FDA clearances upcoming\n• Bajaj Finance — Awaiting loan growth acceleration\n\n⚠️ *This is AI-generated educational content, not financial advice. Please consult a SEBI-registered advisor.*`
  },
  candle: {
    keywords: ['candlestick', 'candle', 'patterns', 'chart patterns', 'technical'],
    response: `📊 **Candlestick Patterns — Quick Guide:**\n\n**Bullish Patterns:**\n🟢 **Hammer** — Bullish reversal at bottom\n🟢 **Morning Star** — 3-day reversal signal\n🟢 **Bullish Engulfing** — Strong buy signal\n🟢 **Doji** — Indecision (watch for breakout)\n\n**Bearish Patterns:**\n🔴 **Shooting Star** — Bearish reversal at top\n🔴 **Evening Star** — 3-day bearish reversal\n🔴 **Bearish Engulfing** — Strong sell signal\n\n💡 **Key Rule:** Never trade a pattern in isolation. Always confirm with volume and atleast one other indicator (RSI, MACD).`
  },
  outlook2026: {
    keywords: ['2026', 'market outlook', 'year outlook', 'forecast', 'prediction'],
    response: `🔭 **Indian Market Outlook — 2026:**\n\n**Macro Tailwinds:**\n✅ GDP growth target: 7.2% (IMF)\n✅ FII flows remain positive — India premium story intact\n✅ Capex super-cycle: ₹11.1 lakh crore government spending\n✅ US Fed rate cuts → EM inflows expected\n\n**Opportunities:**\n• Defence & Infra — PSU stocks likely to outperform\n• Financial Services — Credit growth revival\n• Healthcare — Aging demographics + export pharma\n• Renewables — Green energy transition accelerating\n\n**Risks to Watch:**\n⚠️ Geopolitical tensions (Middle East, Taiwan Strait)\n⚠️ INR depreciation if oil spikes\n⚠️ Domestic election outcomes\n\n🎯 **AI NIFTY Target FY27:** 27,000–28,500`
  }
};

// ================================================================
// PORTFOLIO STATE
// ================================================================
let portfolio = JSON.parse(localStorage.getItem('sai_portfolio') || '[]');

// ================================================================
// UTILITIES
// ================================================================
function rand(min, max) { return +(Math.random() * (max - min) + min).toFixed(2); }
function formatINR(n) { return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function formatVol(v) { return v; }

// ================================================================
// CHART DRAWING — Lightweight Canvas Charts
// ================================================================
function drawLineChart(canvas, data, positive = true) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 20) - 10
  }));

  // Gradient fill
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  if (positive) {
    grd.addColorStop(0, 'rgba(0,245,160,0.25)');
    grd.addColorStop(1, 'rgba(0,245,160,0)');
  } else {
    grd.addColorStop(0, 'rgba(239,68,68,0.25)');
    grd.addColorStop(1, 'rgba(239,68,68,0)');
  }

  ctx.beginPath();
  ctx.moveTo(pts[0].x, h);
  ctx.lineTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = grd;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = positive ? '#00f5a0' : '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Dot at last point
  const last = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = positive ? '#00f5a0' : '#ef4444';
  ctx.fill();
}

function generateSeries(base, points = 20, volatility = 0.015) {
  const series = [base];
  for (let i = 1; i < points; i++) {
    const prev = series[i - 1];
    series.push(+(prev * (1 + (Math.random() - 0.48) * volatility)).toFixed(2));
  }
  return series;
}

// ================================================================
// HERO CHART
// ================================================================
function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const data = INDICES[0].trend;
  drawLineChart(canvas, data, true);
}

// ================================================================
// TICKER
// ================================================================
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const items = Object.entries(STOCK_DB).map(([sym, d]) => ({
    sym,
    price: d.price + rand(-15, 15),
    change: d.change + rand(-0.3, 0.3)
  }));

  const html = [...items, ...items].map(it => `
    <div class="ticker-item">
      <span class="ticker-name">${it.sym}</span>
      <span class="ticker-price">${formatINR(it.price)}</span>
      <span class="ticker-change ${it.change >= 0 ? 'up' : 'down'}">${it.change >= 0 ? '+' : ''}${it.change.toFixed(2)}%</span>
    </div>
  `).join('');
  track.innerHTML = html;
}

// ================================================================
// INDICES GRID
// ================================================================
function buildIndices() {
  const container = document.getElementById('indicesGrid');
  if (!container) return;
  container.innerHTML = INDICES.map((idx, i) => {
    const pos = idx.change >= 0;
    return `
      <div class="index-card ${pos ? '' : 'negative'}" onclick="showIndexDetail('${idx.symbol}')">
        <div class="index-name">${idx.name}</div>
        <div class="index-value">${idx.value.toLocaleString('en-IN')}</div>
        <div class="index-change ${pos ? 'up' : 'down'}">${pos ? '▲' : '▼'} ${Math.abs(idx.change)}% today</div>
        <canvas class="index-mini-chart" id="miniChart${i}" width="200" height="40"></canvas>
      </div>`;
  }).join('');

  INDICES.forEach((idx, i) => {
    const c = document.getElementById(`miniChart${i}`);
    if (c) drawLineChart(c, idx.trend, idx.change >= 0);
  });
}

// ================================================================
// GAINERS / LOSERS
// ================================================================
function buildGainersLosers() {
  const stocks = Object.entries(STOCK_DB);
  const sorted = stocks.sort((a, b) => b[1].change - a[1].change);

  const gainers = sorted.filter(([, d]) => d.change > 0).slice(0, 6);
  const losers = sorted.filter(([, d]) => d.change < 0).sort((a, b) => a[1].change - b[1].change).slice(0, 6);

  function rows(list, color) {
    return list.map(([sym, d]) => `
      <tr onclick="openStockModal('${sym}')">
        <td><span class="stock-name">${sym}</span></td>
        <td>${formatINR(d.price)}</td>
        <td class="${color}">${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}%</td>
        <td>${d.volume}</td>
      </tr>
    `).join('');
  }

  const gainersBody = document.querySelector('#gainersTable tbody');
  const losersBody = document.querySelector('#losersTable tbody');
  if (gainersBody) gainersBody.innerHTML = rows(gainers, 'up-text');
  if (losersBody) losersBody.innerHTML = rows(losers, 'down-text');
}

function buildAllFundsTable() {
  const container = document.querySelector('#allFundsTable tbody');
  if (!container) return;

  const stocks = Object.entries(STOCK_DB);
  container.innerHTML = stocks.map(([sym, d]) => {
    const isPositive = d.change >= 0;
    return `
      <tr>
        <td>
          <div style="display: flex; flex-direction: column; cursor: pointer;" onclick="openStockModal('${sym}')">
            <span class="stock-name" style="font-weight: 700; color: var(--accent-green);">${sym}</span>
            <span style="font-size: 0.72rem; color: var(--text-secondary);">${d.name}</span>
          </div>
        </td>
        <td style="text-transform: capitalize;">${d.sector}</td>
        <td style="font-weight: 600;">${formatINR(d.price)}</td>
        <td class="${isPositive ? 'up-text' : 'down-text'}" style="font-weight: 600;">
          ${isPositive ? '+' : ''}${d.change.toFixed(2)}%
        </td>
        <td style="color: var(--positive); font-weight: 600;">${d.roe}%</td>
        <td>${d.pe}%</td>
        <td>
          <span class="signal-badge signal-${d.signal}">${signalLabel(d.signal)}</span>
        </td>
        <td>
          <button class="btn-primary" style="padding: 6px 14px; font-size: 0.75rem; font-weight: 700; border-radius: var(--radius-sm);" onclick="openQuickBuyModal('${sym}')">Buy</button>
        </td>
      </tr>
    `;
  }).join('');
}

function buildFundsCardGrid() {
  const container = document.getElementById('fundsCardGrid');
  if (!container) return;

  const stocks = Object.entries(STOCK_DB);
  container.innerHTML = stocks.map(([sym, d]) => {
    const isPositive = d.change >= 0;
    const changeClass = isPositive ? 'up-text' : 'down-text';
    const changeSign = isPositive ? '+' : '';
    return `
      <div class="fund-card" onclick="openStockModal('${sym}')">
        <div class="fund-card-header">
          <div class="fund-card-symbol">${sym}</div>
          <span class="signal-badge signal-${d.signal}" style="font-size: 0.65rem; padding: 3px 8px;">${signalLabel(d.signal)}</span>
        </div>
        <div class="fund-card-name">${d.name}</div>
        <div class="fund-card-sector">${d.sector}</div>
        <div class="fund-card-price-row">
          <span class="fund-card-price">${formatINR(d.price)}</span>
          <span class="fund-card-change ${changeClass}">${changeSign}${d.change.toFixed(2)}%</span>
        </div>
        <div class="fund-card-metrics">
          <div class="fund-card-metric">
            <span class="fund-card-metric-label">3Y Return</span>
            <span class="fund-card-metric-value" style="color: var(--positive);">${d.roe}%</span>
          </div>
          <div class="fund-card-metric">
            <span class="fund-card-metric-label">Exp. Ratio</span>
            <span class="fund-card-metric-value">${d.pe}%</span>
          </div>
          <div class="fund-card-metric">
            <span class="fund-card-metric-label">Dividend</span>
            <span class="fund-card-metric-value">${d.dividend}%</span>
          </div>
        </div>
        <button class="btn-primary fund-card-buy" onclick="event.stopPropagation(); openQuickBuyModal('${sym}')">Invest Now</button>
      </div>
    `;
  }).join('');
}

window.openQuickBuyModal = function (sym) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    alert('Please sign in first to invest and track your portfolio!');
    window.openAuthModal();
    return;
  }

  const fund = STOCK_DB[sym];
  if (!fund) return;

  document.getElementById('quickBuyFundName').textContent = `${fund.name} (${sym})`;
  document.getElementById('quickBuyNAV').textContent = formatINR(fund.price);

  document.getElementById('quickBuyModal').dataset.sym = sym;
  document.getElementById('quickBuyQty').value = 10;

  updateQuickBuyTotal();

  document.getElementById('quickBuyModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeQuickBuyModal = function () {
  document.getElementById('quickBuyModal').classList.remove('active');
  document.body.style.overflow = '';
}

window.updateQuickBuyTotal = function () {
  const sym = document.getElementById('quickBuyModal').dataset.sym;
  const fund = STOCK_DB[sym];
  if (!fund) return;

  const qty = parseInt(document.getElementById('quickBuyQty').value) || 0;
  const total = qty * fund.price;
  document.getElementById('quickBuyTotal').textContent = formatINR(total);
}

window.submitQuickBuy = async function () {
  const sym = document.getElementById('quickBuyModal').dataset.sym;
  const fund = STOCK_DB[sym];
  if (!fund) return;

  const qty = parseInt(document.getElementById('quickBuyQty').value);
  if (!qty || qty <= 0) {
    alert('Please enter a valid quantity.');
    return;
  }

  const price = fund.price;
  const token = localStorage.getItem('auth_token');
  const name = fund.name;
  const sector = fund.sector;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/portfolio/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fund_id: sym,
        fund_name: name,
        amount: qty * price,
        purchase_nav: price,
        category: sector,
        return3Y: fund.roe + '%'
      })
    });

    if (res.ok) {
      loadPortfolioFromBackend();
      closeQuickBuyModal();
      alert(`Successfully invested in ${name}! Added to your portfolio.`);
    } else {
      const errData = await res.json();
      alert(errData.detail || 'Failed to add investment to portfolio.');
    }
  } catch (err) {
    console.warn("Backend offline, adding to local simulated portfolio", err);
    portfolio.push({
      id: 'mock_' + Date.now(),
      sym: sym,
      qty: qty,
      avgPrice: price,
      ltp: price
    });
    localStorage.setItem('sai_portfolio', JSON.stringify(portfolio));
    renderPortfolio();
    closeQuickBuyModal();
    alert(`Successfully invested in ${name} (Demo Mode)! Added to your portfolio.`);
  }
}

// ================================================================
// AI PICKS
// ================================================================
const AI_PICKS = Object.entries(STOCK_DB).slice(0, 9).map(([sym, d]) => ({
  sym, ...d,
  target: +(d.price * (1 + rand(0.08, 0.22))).toFixed(0),
  upside: rand(8, 22),
  aiScore: rand(65, 97),
  reason: getPickReason(sym, d)
}));

function getPickReason(sym, d) {
  const reasons = {
    TCS: 'Mega-deal wins driving revenue visibility. AI & cloud transformation leadership positions TCS ahead of peers.',
    INFY: 'Margin recovery in progress. New CEO-led cost optimization likely to boost profitability in H2FY27.',
    RELIANCE: 'Jio 5G subscriber momentum accelerating. Retail segment showing strong SSSG growth.',
    HDFCBANK: 'Post-merger integration complete. Loan growth re-accelerating, NIM stabilizing near 3.5%.',
    WIPRO: 'Valuation discount to peers. Turnaround initiative gaining traction under new management.',
    AXISBANK: 'Strong Q4 results beat estimates. Credit costs declining, ROE approaching 18%.',
    SUNPHARMA: 'Multiple FDA approvals expected for specialty pipeline. Branded generic growth strong.',
    MARUTI: 'Record CNG vehicle volumes. SUV portfolio expansion capturing market share.',
    ITC: 'Cigarette volume growth resuming. Hotels demerger to unlock value.'
  };
  return reasons[sym] || 'Strong technical setup with improving fundamentals. AI model shows high confidence.';
}

let currentFilter = 'all';

function buildPicks(filter = 'all') {
  const container = document.getElementById('picksGrid');
  if (!container) return;

  const filtered = filter === 'all' ? AI_PICKS : AI_PICKS.filter(p => p.signal === filter);

  container.innerHTML = filtered.map(pick => `
    <div class="pick-card" data-signal="${pick.signal}" onclick="openStockModal('${pick.sym}')">
      <div class="pick-card-top">
        <div class="pick-stock-info">
          <h3 style="font-size: 1.22rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${pick.name}</h3>
          <span style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase;">Symbol: ${pick.sym}</span>
        </div>
        <span class="signal-badge signal-${pick.signal}">${signalLabel(pick.signal)}</span>
      </div>
      <div class="pick-price-row">
        <span class="pick-price">${formatINR(pick.price)}</span>
        <span class="pick-change ${pick.change >= 0 ? 'up-text' : 'down-text'}">${pick.change >= 0 ? '+' : ''}${pick.change.toFixed(2)}%</span>
      </div>
      <div class="pick-metrics">
        <div class="pick-metric">
          <div class="pick-metric-label">Target</div>
          <div class="pick-metric-value">₹${pick.target}</div>
        </div>
        <div class="pick-metric">
          <div class="pick-metric-label">Upside</div>
          <div class="pick-metric-value" style="color: var(--positive)">+${pick.upside.toFixed(1)}%</div>
        </div>
        <div class="pick-metric">
          <div class="pick-metric-label">Exp. Ratio</div>
          <div class="pick-metric-value">${pick.pe}%</div>
        </div>
        <div class="pick-metric">
          <div class="pick-metric-label">Risk Profile</div>
          <div class="pick-metric-value" style="text-transform: capitalize;">${pick.mcap === 'small' ? 'Low' : pick.mcap === 'mid' ? 'Moderate' : 'High'}</div>
        </div>
      </div>
      <div class="ai-score-bar">
        <div class="ai-score-label">
          <span>AI Confidence Score</span>
          <span>${pick.aiScore.toFixed(0)}%</span>
        </div>
        <div class="score-track">
          <div class="score-fill" style="width: ${pick.aiScore}%"></div>
        </div>
      </div>
      <button class="btn-outline-green" style="width: 100%; margin-top: 14px; padding: 10px; font-size: 0.82rem; font-weight: 700; border-radius: var(--radius-sm);" onclick="event.stopPropagation(); openSuitabilityModal('${pick.sym}')">Check AI Suitability</button>
    </div>
  `).join('');

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--text-muted); grid-column: 1/-1; padding: 40px 0;">No stocks match this filter.</p>';
  }
}

function signalLabel(signal) {
  const labels = { buy: 'Strong Buy', hold: 'Hold', watch: 'Watchlist', sell: 'Sell' };
  return labels[signal] || signal;
}

function filterPicks(filter, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = filter;
  buildPicks(filter);
}

// ================================================================
// AI CONFIDENCE BARS
// ================================================================
function buildConfidenceBars() {
  const container = document.getElementById('confidenceBars');
  if (!container) return;
  const models = [
    { name: 'Fundamental Analysis', pct: 92.4 },
    { name: 'Technical Signals', pct: 89.1 },
    { name: 'Sentiment Engine', pct: 78.6 },
    { name: 'Macro Factor Model', pct: 83.2 },
    { name: 'Earnings Predictor', pct: 86.7 },
    { name: 'Price Pattern AI', pct: 91.0 }
  ];
  container.innerHTML = models.map(m => `
    <div class="confidence-item">
      <div class="confidence-name">${m.name}</div>
      <div class="confidence-bar-track">
        <div class="confidence-bar-fill" style="width: 0%" data-target="${m.pct}"></div>
      </div>
      <div class="confidence-pct">${m.pct}%</div>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.confidence-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 300);
}

// ================================================================
// SCREENER
// ================================================================
function runScreener() {
  const container = document.getElementById('screenerResults');
  if (!container) return;

  const mcapEl = document.getElementById('filterMarketCap');
  const sectorEl = document.getElementById('filterSector');
  const peEl = document.getElementById('filterPE');
  const signalEl = document.getElementById('filterSignal');
  if (!mcapEl || !sectorEl || !peEl || !signalEl) return;

  const mcap = mcapEl.value;
  const sector = sectorEl.value;
  const pe = peEl.value;
  const signal = signalEl.value;

  const sectorMap = { it: 'IT', banking: 'Banking', pharma: 'Pharma', auto: 'Auto', fmcg: 'FMCG', energy: 'Energy', finance: 'Finance', retail: 'Retail', metal: 'Metal' };
  const targetSector = sectorMap[sector] || '';

  let results = Object.entries(STOCK_DB).filter(([sym, d]) => {
    if (mcap && d.mcap !== mcap) return false;
    if (targetSector && !d.sector.toLowerCase().includes(targetSector.toLowerCase())) return false;
    if (pe === 'low' && d.pe >= 15) return false;
    if (pe === 'mid' && (d.pe < 15 || d.pe > 30)) return false;
    if (pe === 'high' && d.pe <= 30) return false;
    if (signal && d.signal !== signal) return false;
    return true;
  });

  if (results.length === 0) {
    container.innerHTML = `<div class="screener-placeholder"><p>No stocks matched your filters. Try relaxing your criteria.</p></div>`;
    return;
  }

  container.innerHTML = `
    <p style="font-size:0.82rem; color: var(--text-muted); margin-bottom: 16px;">${results.length} stocks found</p>
    <table class="screener-table">
      <thead><tr>
        <th>Symbol</th><th>Name</th><th>Price</th><th>Change</th><th>Sector</th>
        <th>P/E</th><th>Market Cap</th><th>AI Signal</th>
      </tr></thead>
      <tbody>
        ${results.map(([sym, d]) => `
          <tr onclick="openStockModal('${sym}')">
            <td><strong>${sym}</strong></td>
            <td>${d.name.substring(0, 24)}${d.name.length > 24 ? '...' : ''}</td>
            <td>${formatINR(d.price)}</td>
            <td class="${d.change >= 0 ? 'up-text' : 'down-text'}">${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}%</td>
            <td>${d.sector}</td>
            <td>${d.pe}x</td>
            <td style="text-transform:capitalize">${d.mcap}</td>
            <td><span class="signal-badge signal-${d.signal}">${signalLabel(d.signal)}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

// ================================================================
// SECTOR HEATMAP
// ================================================================
function buildHeatmap() {
  const container = document.getElementById('heatmapGrid');
  if (!container) return;
  container.innerHTML = SECTORS.map(s => {
    const cls = s.change > 0.5 ? 'positive' : s.change < -0.5 ? 'negative' : 'neutral';
    return `
      <div class="heatmap-cell ${cls}" title="${s.name}: ${s.change > 0 ? '+' : ''}${s.change}%">
        <div class="heatmap-sector">${s.name}</div>
        <div class="heatmap-change">${s.change >= 0 ? '+' : ''}${s.change}%</div>
        <div class="heatmap-stocks">${s.stocks} stocks</div>
      </div>`;
  }).join('');
}

// ================================================================
// NEWS
// ================================================================
function buildNews() {
  const container = document.getElementById('newsGrid');
  if (!container) return;
  container.innerHTML = NEWS.map((n, idx) => `
    <div class="news-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="news-meta">
          <span class="news-source">${n.source}</span>
          <span class="news-time">${n.time}</span>
          <span class="news-sentiment sentiment-${n.sentiment}">${n.sentiment.toUpperCase()}</span>
        </div>
        <div class="news-headline" style="font-weight: 700; font-size: 0.98rem; margin: 8px 0; line-height: 1.4; color: var(--text-primary);">${n.headline}</div>
        <div class="news-summary" style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">${n.summary}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
        <div class="news-tags">${n.tags.map(t => `<span class="news-tag">#${t}</span>`).join('')}</div>
        <button class="btn-outline-green" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 700; width: fit-content; border-radius: var(--radius-sm);" onclick="analyzeNewsImpact(${idx}, this)">Analyze AI Impact</button>
        <div id="news-impact-${idx}" style="display: none; margin-top: 8px; padding: 10px; border-radius: var(--radius-sm); font-size: 0.8rem; line-height: 1.5; background: rgba(0, 245, 160, 0.04); border: 1px dashed rgba(0, 245, 160, 0.25); color: var(--text-secondary);"></div>
      </div>
    </div>
  `).join('');
}

window.analyzeNewsImpact = function (idx, btn) {
  const newsItem = NEWS[idx];
  if (!newsItem) return;
  const impactDiv = document.getElementById(`news-impact-${idx}`);
  if (!impactDiv) return;

  if (impactDiv.style.display === 'block') {
    impactDiv.style.display = 'none';
    btn.textContent = 'Analyze AI Impact';
    return;
  }

  const h = newsItem.headline.toLowerCase();
  let analysis = "";

  if (h.includes('rbi') || h.includes('rate') || h.includes('interest') || h.includes('repo')) {
    analysis = "<strong>AI Impact Analysis:</strong> RBI interest rate signals ke wajese Banking & Debt mutual funds me direct yield volatility ho sakti hai. Safe players ke liye Liquid and Short-term debt schemes me SIP continue rakhna steady option rahega.";
  } else if (h.includes('gain') || h.includes('rally') || h.includes('high') || h.includes('surge') || h.includes('rise')) {
    analysis = "<strong>AI Impact Analysis:</strong> Bullish momentum ke chalte equity mutual funds me net asset value (NAV) rise karega. Large cap funds moderate growth targets support karenge, jabki active mid/small caps higher returns reflect kar sakte hain.";
  } else if (h.includes('fall') || h.includes('drop') || h.includes('slump') || h.includes('loss') || h.includes('down') || h.includes('crash')) {
    analysis = "<strong>AI Impact Analysis:</strong> Market corrections ke karan immediate equity NAVs down ho sakti hain. Par SIP investors ko is slip ka advantage lekar low NAV units accumulate karne chahiye. Safe holdings ke liye hybrid allocation optimize karein.";
  } else {
    analysis = "<strong>AI Impact Analysis:</strong> Yeh financial movement macro-market sentiment ko balance karegi. Indian mutual fund schemes long-term investment horizon me stable CAGR yield provide karne ke liye structured hain.";
  }

  impactDiv.innerHTML = analysis;
  impactDiv.style.display = 'block';
  btn.textContent = 'Hide Impact Analysis';
}

// ================================================================
// PORTFOLIO
// ================================================================
async function addToPortfolio() {
  const sym = document.getElementById('portStock').value.trim().toUpperCase();
  const qty = parseInt(document.getElementById('portQty').value);
  const price = parseFloat(document.getElementById('portPrice').value);
  const token = localStorage.getItem('auth_token');

  if (!token) {
    alert('Please sign in first to track your portfolio!');
    openAuthModal();
    return;
  }

  if (!sym || !qty || !price || qty <= 0 || price <= 0) {
    alert('Please fill all fields with valid values.');
    return;
  }

  const fund = STOCK_DB[sym];
  const name = fund ? fund.name : sym;
  const sector = fund ? fund.sector : 'Equity';

  try {
    const res = await fetch('http://127.0.0.1:8000/api/portfolio/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fund_id: sym,
        fund_name: name,
        amount: qty * price,
        purchase_nav: price,
        category: sector,
        return3Y: fund ? (fund.roe + '%') : '15.0%'
      })
    });

    if (res.ok) {
      loadPortfolioFromBackend();
      document.getElementById('portStock').value = '';
      document.getElementById('portQty').value = '';
      document.getElementById('portPrice').value = '';
    } else {
      const errData = await res.json();
      alert(errData.detail || 'Failed to add investment to portfolio.');
    }
  } catch (err) {
    console.error("Error adding to portfolio", err);
    alert('Failed to connect to server.');
  }
}

async function removeFromPortfolio(id, sym) {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/portfolio/sell/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      loadPortfolioFromBackend();
    } else {
      alert('Failed to delete investment.');
    }
  } catch (err) {
    console.error("Error removing from portfolio", err);
  }
}

async function loadPortfolioFromBackend() {
  const token = localStorage.getItem('auth_token');
  if (!token) return;
  try {
    const res = await fetch('http://127.0.0.1:8000/api/portfolio', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      portfolio.length = 0;
      data.forEach(item => {
        portfolio.push({
          id: item.id,
          sym: item.fund_id,
          qty: item.units,
          avgPrice: item.purchase_nav,
          ltp: item.current_nav || item.purchase_nav
        });
      });
      renderPortfolio();
    }
  } catch (err) {
    console.error("Error loading portfolio", err);
  }
}

function renderPortfolio() {
  const body = document.getElementById('portfolioBody');
  const summaryEl = document.getElementById('portfolioSummary');
  if (!body) return;

  if (portfolio.length === 0) {
    body.innerHTML = '<tr><td colspan="7" class="empty-row">No stocks added yet. Add your first stock!</td></tr>';
    summaryEl.innerHTML = '';
    return;
  }

  let totalInvested = 0, totalCurrent = 0;

  body.innerHTML = portfolio.map(p => {
    const ltp = p.ltp || p.avgPrice;
    const invest = p.avgPrice * p.qty;
    const current = ltp * p.qty;
    const pnl = current - invest;
    const pnlPct = ((pnl / (invest || 1)) * 100).toFixed(2);
    totalInvested += invest;
    totalCurrent += current;

    return `<tr>
      <td><strong>${p.sym}</strong></td>
      <td>${p.qty}</td>
      <td>${formatINR(p.avgPrice)}</td>
      <td>${formatINR(ltp)}</td>
      <td class="${pnl >= 0 ? 'up-text' : 'down-text'}">${pnl >= 0 ? '+' : ''}${formatINR(Math.abs(pnl))}</td>
      <td class="${pnlPct >= 0 ? 'up-text' : 'down-text'}">${pnlPct >= 0 ? '+' : ''}${pnlPct}%</td>
      <td><button class="delete-btn" onclick="removeFromPortfolio('${p.id}', '${p.sym}')">Remove</button></td>
    </tr>`;
  }).join('');

  const totalPnL = totalCurrent - totalInvested;
  const totalPct = ((totalPnL / (totalInvested || 1)) * 100).toFixed(2);

  summaryEl.innerHTML = `
    <div class="summary-item"><div class="summary-label">Total Invested</div><div class="summary-value">${formatINR(totalInvested)}</div></div>
    <div class="summary-item"><div class="summary-label">Current Value</div><div class="summary-value">${formatINR(totalCurrent)}</div></div>
    <div class="summary-item"><div class="summary-label">Total P&amp;L</div><div class="summary-value ${totalPnL >= 0 ? 'up-text' : 'down-text'}">${totalPnL >= 0 ? '+' : ''}${formatINR(Math.abs(totalPnL))}</div></div>
    <div class="summary-item"><div class="summary-label">Return %</div><div class="summary-value ${totalPct >= 0 ? 'up-text' : 'down-text'}">${totalPct >= 0 ? '+' : ''}${totalPct}%</div></div>`;
}

// ================================================================
// STOCK MODAL
// ================================================================
function openStockModal(sym) {
  const d = STOCK_DB[sym];
  if (!d) return;

  document.getElementById('modalStockName').textContent = sym + ' — ' + d.name;
  document.getElementById('modalSector').textContent = d.sector;
  document.getElementById('modalPrice').textContent = formatINR(d.price);

  const chEl = document.getElementById('modalChange');
  chEl.textContent = (d.change >= 0 ? '+' : '') + d.change.toFixed(2) + '%';
  chEl.className = 'modal-change ' + (d.change >= 0 ? 'up' : 'down');

  document.getElementById('modalMetrics').innerHTML = [
    { label: 'P/E Ratio', value: d.pe + 'x' },
    { label: 'ROE', value: d.roe + '%' },
    { label: 'Dividend Yield', value: d.dividend + '%' },
    { label: 'Debt/Equity', value: d.debt },
    { label: 'Market Cap', value: d.mcap.charAt(0).toUpperCase() + d.mcap.slice(1) },
    { label: 'Volume', value: d.volume },
    { label: 'Sector', value: d.sector },
    { label: 'AI Signal', value: signalLabel(d.signal) }
  ].map(m => `
    <div class="modal-metric">
      <div class="modal-metric-label">${m.label}</div>
      <div class="modal-metric-value">${m.value}</div>
    </div>`).join('');

  const pick = AI_PICKS.find(p => p.sym === sym);
  document.getElementById('modalAIText').textContent = pick?.reason || 'AI analysis in progress. Based on current technicals, this stock is being monitored for a potential entry signal.';

  const canvas = document.getElementById('modalChart');
  const series = generateSeries(d.price * 0.85, 40, 0.018);
  series[series.length - 1] = d.price;
  setTimeout(() => drawLineChart(canvas, series, d.change >= 0), 50);

  document.getElementById('stockModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeStockModal() {
  document.getElementById('stockModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ================================================================
// CHAT BOT
// ================================================================
let chatOpen = false;

function openChat() {
  chatOpen = true;
  document.getElementById('chatPanel').classList.add('open');
  document.getElementById('chatOverlay').classList.add('active');
  document.getElementById('chatFab').style.display = 'none';
  setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

function closeChat() {
  chatOpen = false;
  document.getElementById('chatPanel').classList.remove('open');
  document.getElementById('chatOverlay').classList.remove('active');
  document.getElementById('chatFab').style.display = 'flex';
}

function sendSuggestion(btn) {
  const text = btn.textContent.replace(/^[^\w\s]+\s/, '').trim();
  document.getElementById('chatSuggestions').style.display = 'none';
  appendUserMessage(text);
  generateAIResponse(text);
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('chatSuggestions').style.display = 'none';
  appendUserMessage(text);
  generateAIResponse(text);
}

function appendUserMessage(text) {
  const container = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'message user-message';
  msg.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function appendBotMessage(html) {
  const container = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'message bot-message';
  msg.innerHTML = `<div class="message-avatar">AI</div><div class="message-bubble">${html}</div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'message bot-message';
  typing.id = 'typingIndicator';
  typing.innerHTML = `<div class="message-avatar">AI</div><div class="message-bubble"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function generateAIResponse(query) {
  showTyping();
  const token = localStorage.getItem('auth_token');

  try {
    const res = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ message: query })
    });

    removeTyping();
    if (res.ok) {
      const data = await res.json();
      appendBotMessage(formatResponse(data.response));
    } else {
      throw new Error("Backend response error");
    }
  } catch (err) {
    console.warn("Chatbot backend offline, using local rules engine", err);
    setTimeout(() => {
      removeTyping();
      let response = getAIResponse(query.toLowerCase());
      appendBotMessage(formatResponse(response));
    }, rand(600, 1200));
  }
}

function getAIResponse(q) {
  // Greetings
  if (AI_RESPONSES.greetings.some(g => q.includes(g))) {
    return `Hello! Great to see you here! 👋 I'm StockAI, ready to help you navigate the markets. Ask me about any stock, market trends, investment strategies, or financial concepts!`;
  }

  // Check all response categories
  for (const [key, data] of Object.entries(AI_RESPONSES)) {
    if (key === 'greetings') continue;
    if (data.keywords && data.keywords.some(kw => q.includes(kw))) {
      return data.response;
    }
  }

  // Stock lookup
  const stockMatch = Object.keys(STOCK_DB).find(sym => q.includes(sym.toLowerCase()));
  if (stockMatch) {
    const d = STOCK_DB[stockMatch];
    return `📊 **${stockMatch} Analysis:**\n\n**Current Price:** ${formatINR(d.price)} (${d.change >= 0 ? '+' : ''}${d.change}%)\n**Sector:** ${d.sector}\n**AI Signal:** ${signalLabel(d.signal)}\n\n**Key Metrics:**\n• P/E Ratio: ${d.pe}x\n• ROE: ${d.roe}%\n• Dividend Yield: ${d.dividend}%\n• Debt-to-Equity: ${d.debt}\n\n*Tap the stock card on the AI Picks section for a detailed chart and full analysis.*`;
  }

  // Generic intelligent fallback
  const fallbacks = [
    `I understand you're asking about "${query}". This is a great topic! For the most accurate and personalized advice, I recommend:\n\n1. 📊 Check our **AI Picks** section for curated recommendations\n2. 🔍 Use the **Stock Screener** to filter stocks by your criteria\n3. 📰 Read the **Market News** for the latest developments\n\nFeel free to ask me something more specific like "analyze HDFC Bank" or "what are the best IT stocks"!`,
    `Great question! The Indian markets are dynamic and full of opportunities. Based on current AI analysis:\n\n• **NIFTY 50** is in a bullish trend with support at 24,400\n• **Banking stocks** are showing strong momentum post-RBI policy\n• **IT sector** is under slight pressure due to global slowdowns\n\nWhat specific aspect would you like to explore further?`,
    `I'm still learning about that specific topic, but I can help you with:\n\n📈 **Stock Analysis** — Just name any NSE/BSE stock\n📊 **Market Overview** — "How are markets today?"\n💡 **Concepts** — "What is P/E ratio?" or "Explain RSI"\n🎯 **Picks** — "Best stocks to buy today"\n\nWhat would you like to know?`
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ================================================================
// THEME TOGGLE
// ================================================================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('sai_theme', newTheme);
  const knob = document.getElementById('themeKnob');
  if (knob) knob.textContent = newTheme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
  // Redraw charts so they pick up the new theme colors
  initHeroChart();
  buildIndices();
}

function initTheme() {
  const saved = localStorage.getItem('sai_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const knob = document.getElementById('themeKnob');
  if (knob) knob.textContent = saved === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
}

// ================================================================
// NAVBAR
// ================================================================
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});

// ================================================================
// HERO PARTICLES
// ================================================================
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = rand(3, 8);
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${rand(0, 100)}%;
      bottom: ${rand(0, 30)}%;
      animation-duration: ${rand(8, 20)}s;
      animation-delay: ${rand(0, 10)}s;
      opacity: ${rand(0.3, 0.8)};
    `;
    container.appendChild(p);
  }
}

// ================================================================
// LIVE DATA SIMULATION
// ================================================================
function simulateLiveUpdates() {
  setInterval(() => {
    // Update ticker prices
    Object.values(STOCK_DB).forEach(d => {
      d.price = +(d.price * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2);
    });

    // Rebuild ticker
    buildTicker();

    // Update NIFTY display
    const nifty = INDICES[0];
    nifty.value = +(nifty.value * (1 + (Math.random() - 0.48) * 0.001)).toFixed(2);
    const niftyEl = document.getElementById('niftyPrice');
    if (niftyEl) niftyEl.textContent = nifty.value.toLocaleString('en-IN');
  }, 4000);
}

// ================================================================
// INTERSECTION OBSERVER for animations
// ================================================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.pick-card, .feature-card, .news-card, .index-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ================================================================
// INIT & BACKEND INTEGRATIONS
// ================================================================
const API_BASE_URL = 'http://127.0.0.1:8000/api';
let authMode = 'login';

function handleNavAuthClick() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    checkAuthStatus();
    alert('Logged out successfully!');
    portfolio.length = 0;
    renderPortfolio();
  } else {
    checkAuthStatus();
  }
}

function openAuthModal() { }
function closeAuthModal() { }

function switchAuthMode(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('authModalTitle');
  const nameGroup = document.getElementById('authNameGroup');
  const emailGroup = document.getElementById('authEmailGroup');
  const otpGroup = document.getElementById('authOtpGroup');
  const passwordGroup = document.getElementById('authPasswordGroup');
  const passwordLabel = document.getElementById('authPasswordLabel');
  const forgotLink = document.getElementById('authForgotLink');
  const submitBtn = document.getElementById('authSubmitBtn');
  const switchText = document.getElementById('authSwitchText');
  const switchLink = document.getElementById('authSwitchLink');
  const errorEl = document.getElementById('authErrorMsg');

  errorEl.style.display = 'none';
  otpGroup.style.display = 'none';
  emailGroup.style.display = 'block';
  passwordGroup.style.display = 'block';
  passwordLabel.textContent = 'Password';
  forgotLink.style.display = 'block';

  if (authMode === 'login' || authMode === 'forgot' || authMode === 'reset') {
    authMode = 'signup';
    title.textContent = 'Sign up';
    nameGroup.style.display = 'block';
    submitBtn.textContent = 'Sign up >';
    switchText.textContent = 'Already have an account?';
    switchLink.textContent = 'Log in >';
    forgotLink.style.display = 'none';
  } else {
    authMode = 'login';
    title.textContent = 'Log in';
    nameGroup.style.display = 'none';
    submitBtn.textContent = 'Log in >';
    switchText.textContent = '';
    switchLink.textContent = 'Sign up >';
  }
}

function switchForgotPasswordMode(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('authModalTitle');
  const nameGroup = document.getElementById('authNameGroup');
  const emailGroup = document.getElementById('authEmailGroup');
  const otpGroup = document.getElementById('authOtpGroup');
  const passwordGroup = document.getElementById('authPasswordGroup');
  const passwordLabel = document.getElementById('authPasswordLabel');
  const forgotLink = document.getElementById('authForgotLink');
  const submitBtn = document.getElementById('authSubmitBtn');
  const switchText = document.getElementById('authSwitchText');
  const switchLink = document.getElementById('authSwitchLink');
  const errorEl = document.getElementById('authErrorMsg');

  errorEl.style.display = 'none';
  nameGroup.style.display = 'none';

  if (authMode === 'login') {
    authMode = 'forgot';
    title.textContent = 'Forgot Password';
    otpGroup.style.display = 'none';
    passwordGroup.style.display = 'none';
    submitBtn.textContent = 'Send OTP';
    switchText.textContent = 'Remembered password?';
    switchLink.textContent = 'Sign In';
    forgotLink.style.display = 'none';
  } else {
    authMode = 'login';
    switchAuthMode();
  }
}

async function handleAuthFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('authName').value;
  const email = document.getElementById('authEmail').value;
  const otp = document.getElementById('authOtp').value;
  const password = document.getElementById('authPassword').value;
  const errorEl = document.getElementById('authErrorMsg');

  errorEl.style.display = 'none';

  if (authMode === 'login') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify({ name: data.user.name, email: data.user.email }));
        checkAuthStatus();
        alert('Logged in successfully!');
      } else {
        errorEl.textContent = data.detail || 'Incorrect credentials.';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      console.warn("Backend offline, using local simulated login.", err);
      const simulatedUser = { name: email.split('@')[0] || 'Investor', email: email };
      localStorage.setItem('auth_token', 'mock_token_123456');
      localStorage.setItem('auth_user', JSON.stringify(simulatedUser));
      checkAuthStatus();
      alert('Backend is offline. Logged in successfully using Demo Mode!');
    }
  } else if (authMode === 'signup') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please login.');
        authMode = 'login';
        switchAuthMode();
      } else {
        errorEl.textContent = data.detail || 'Registration failed.';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      console.warn("Backend offline, using local simulated signup.", err);
      alert('Backend is offline. Registered successfully in Demo Mode! You can now log in.');
      authMode = 'login';
      switchAuthMode();
    }
  } else if (authMode === 'forgot') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        authMode = 'reset';
        document.getElementById('authModalTitle').textContent = 'Reset Password';
        document.getElementById('authOtpGroup').style.display = 'block';
        document.getElementById('authPasswordGroup').style.display = 'block';
        document.getElementById('authPasswordLabel').textContent = 'Enter New Password';
        document.getElementById('authSubmitBtn').textContent = 'Reset Password';
        alert(`OTP has been simulated! The code is: ${data.otp}`);
      } else {
        errorEl.textContent = data.detail || 'Email check failed.';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      console.warn("Backend offline, using local simulated forgot-password.", err);
      authMode = 'reset';
      document.getElementById('authModalTitle').textContent = 'Reset Password';
      document.getElementById('authOtpGroup').style.display = 'block';
      document.getElementById('authPasswordGroup').style.display = 'block';
      document.getElementById('authPasswordLabel').textContent = 'Enter New Password';
      document.getElementById('authSubmitBtn').textContent = 'Reset Password';
      alert('Backend is offline. Simulated OTP: 123456');
    }
  } else if (authMode === 'reset') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful! You can now log in.');
        authMode = 'login';
        switchAuthMode();
      } else {
        errorEl.textContent = data.detail || 'Invalid OTP code.';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      console.warn("Backend offline, using local simulated reset-password.", err);
      alert('Backend is offline. Password reset successful in Demo Mode! You can now log in.');
      authMode = 'login';
      switchAuthMode();
    }
  }
}

function checkAuthStatus() {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  let user = null;
  try {
    user = JSON.parse(userStr || 'null');
  } catch (e) {
    console.error(e);
  }

  const profileWidget = document.getElementById('sidebarUserProfile');
  const authBtn = document.getElementById('navAuthBtn');
  const dashboard = document.getElementById('dashboardWrapper');
  const authModal = document.getElementById('authModal');

  const nameEl = document.getElementById('sidebarUserName');
  const avatarEl = document.getElementById('sidebarAvatar');

  if (token && user && user.name) {
    // Authenticated: remove blur and hide auth modal overlay
    if (dashboard) {
      dashboard.style.filter = 'none';
      dashboard.style.pointerEvents = 'all';
    }
    if (authModal) {
      authModal.classList.remove('active');
    }

    if (profileWidget) profileWidget.style.display = 'flex';
    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

    if (authBtn) {
      authBtn.textContent = 'Log Out';
      authBtn.style.background = 'rgba(239, 68, 68, 0.12)';
      authBtn.style.color = '#ef4444';
      authBtn.style.border = '1px solid rgba(239, 68, 68, 0.25)';
    }
    loadPortfolioFromBackend();
  } else {
    // Unauthenticated: blur the background and open the auth modal overlay
    if (dashboard) {
      dashboard.style.filter = 'blur(12px) brightness(0.4)';
      dashboard.style.pointerEvents = 'none';
    }
    if (dashboard && authModal) {
      authModal.classList.add('active');
    }

    if (profileWidget) profileWidget.style.display = 'none';
    if (authBtn) {
      authBtn.textContent = 'Get Started';
      authBtn.style.background = 'var(--gradient-main)';
      authBtn.style.color = '#080c18';
      authBtn.style.border = 'none';
    }
  }
}

async function loadDatabaseFromBackend() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/funds');
    if (res.ok) {
      const funds = await res.json();

      // We clear and rebuild STOCK_DB based on live mutual funds
      for (const key in STOCK_DB) delete STOCK_DB[key];

      funds.forEach((fund, index) => {
        let sector = 'Equity';
        if (fund.category === 'Debt') sector = 'Banking';
        if (fund.category === 'Hybrid') sector = 'Energy';

        let mcap = 'large';
        if (fund.risk === 'Low') mcap = 'small';
        if (fund.risk === 'Moderate') mcap = 'mid';

        // Pick a short key code
        const key = fund.fund_id || `MF${1000 + index}`;

        STOCK_DB[key] = {
          name: fund.name,
          price: parseFloat(fund.nav),
          change: parseFloat(fund.return3Y || '10%') * (Math.random() > 0.5 ? 0.05 : -0.05),
          sector: sector,
          pe: parseFloat(fund.expenseRatio) || 1.2,
          mcap: mcap,
          volume: 'Live NAV',
          roe: parseFloat(fund.return3Y) || 14.5,
          debt: 0.0,
          dividend: 0.0,
          signal: fund.risk === 'Very High' || fund.risk === 'High' ? 'buy' : 'hold'
        };
      });

      // Update picks list logic
      AI_PICKS.length = 0;
      Object.entries(STOCK_DB).slice(0, 9).forEach(([sym, d]) => {
        AI_PICKS.push({
          sym, ...d,
          target: +(d.price * (1 + rand(0.08, 0.22))).toFixed(0),
          upside: rand(8, 22),
          aiScore: rand(65, 97),
          reason: `Strong ${d.sector} sector metrics. Current NAV is ${formatINR(d.price)} with 3-year performance yields of ${d.roe}%.`
        });
      });

      buildTicker();
      buildIndices();
      buildGainersLosers();
      buildAllFundsTable();
      buildPicks();
    }
  } catch (err) {
    console.error("Error loading funds from backend", err);
  }
}

async function loadNewsFromBackend() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/news');
    if (res.ok) {
      const newsData = await res.json();
      NEWS.length = 0;

      newsData.slice(0, 9).forEach(item => {
        let sentiment = 'neutral';
        if (item.title.toLowerCase().includes('rise') || item.title.toLowerCase().includes('gain') || item.title.toLowerCase().includes('high') || item.title.toLowerCase().includes('rally')) {
          sentiment = 'bullish';
        } else if (item.title.toLowerCase().includes('fall') || item.title.toLowerCase().includes('drop') || item.title.toLowerCase().includes('down') || item.title.toLowerCase().includes('loss')) {
          sentiment = 'bearish';
        }

        NEWS.push({
          source: 'Live RSS Google News',
          time: item.published_at || 'Just now',
          headline: item.title,
          summary: item.content || 'Click to view matching updates for financial and stock markets in India.',
          sentiment: sentiment,
          tags: [item.category || 'Mutual Funds']
        });
      });
      buildNews();
    }
  } catch (err) {
    console.error("Error loading news from backend", err);
  }
}
// ================================================================
// AI SALARY PLANNER & SIP CALCULATOR HANDLERS
// ================================================================
window.updateSalaryDisplay = function (val) {
  document.getElementById('salaryValDisplay').textContent = '₹' + parseInt(val).toLocaleString('en-IN');
}

window.updateSIPAmountDisplay = function (val) {
  document.getElementById('sipAmountDisplay').textContent = '₹' + parseInt(val).toLocaleString('en-IN');
  recalculateSIP();
}

window.updateSIPRateDisplay = function (val) {
  document.getElementById('sipRateDisplay').textContent = val + '%';
  recalculateSIP();
}

window.updateSIPYearsDisplay = function (val) {
  document.getElementById('sipYearsDisplay').textContent = val + ' Years';
  recalculateSIP();
}

function recalculateSIP() {
  const elAmount = document.getElementById('inputSipAmount');
  const elRate = document.getElementById('inputSipRate');
  const elYears = document.getElementById('inputSipYears');
  if (!elAmount || !elRate || !elYears) return;

  const P = parseFloat(elAmount.value);
  const r = parseFloat(elRate.value);
  const n = parseFloat(elYears.value);

  const i = r / 12 / 100;
  const t = n * 12;

  // Formula: FV = P * [((1 + i)^t - 1) / i] * (1 + i)
  const totalInvested = P * t;
  const futureValue = P * ((Math.pow(1 + i, t) - 1) / i) * (1 + i);
  const estReturns = futureValue - totalInvested;

  const investedText = document.getElementById('sipInvestedText');
  const returnsText = document.getElementById('sipReturnsText');
  const totalText = document.getElementById('sipTotalText');

  if (investedText) investedText.textContent = formatINR(totalInvested);
  if (returnsText) returnsText.textContent = formatINR(Math.max(0, estReturns));
  if (totalText) totalText.textContent = formatINR(futureValue);
}

window.generateAISIPPlan = function () {
  const salary = parseFloat(document.getElementById('inputSalary').value);
  const risk = document.getElementById('inputRisk').value;
  const tenure = document.getElementById('inputTenure').value;
  const resultPanel = document.getElementById('sipPlanResult');

  // Suggested SIP amount: 20% to 30% of monthly salary
  const minSip = Math.round(salary * 0.20);
  const maxSip = Math.round(salary * 0.30);

  // Filter mutual funds from STOCK_DB matching the risk profile
  let matchingFunds = [];
  const funds = Object.entries(STOCK_DB);

  if (risk === 'High') {
    // Equity focus (high return)
    matchingFunds = funds.filter(([sym, d]) => d.sector === 'Equity' || d.roe > 14.0);
  } else if (risk === 'Moderate') {
    // Balanced focus (hybrid)
    matchingFunds = funds.filter(([sym, d]) => d.sector === 'Energy' || d.sector === 'Equity');
  } else {
    // Low risk (debt focus)
    matchingFunds = funds.filter(([sym, d]) => d.sector === 'Banking');
  }

  // Pick top 2 recommended funds
  const recommendations = matchingFunds.slice(0, 2);
  let recsHTML = recommendations.map(([sym, d]) => {
    let buyReason = "";
    if (risk === 'High') {
      buyReason = `Yeh Equity Fund aapki monthly salary (₹${salary.toLocaleString('en-IN')}) ka growth component generate karne ke liye perfect hai. Kyunki iska target returns high hai, isse long term me compounding ka double power benefit milega aur high risk parameters inflation beat karne me best performance show karenge.`;
    } else if (risk === 'Moderate') {
      buyReason = `Aapki moderate salary category ke liye capital balance aur inflation-beating growth dono equal matrix par zaroori hain. Yeh scheme risk and stability ko perfectly distribute karti hai taaki volatility ke time safety bani rahe.`;
    } else {
      buyReason = `Safe banking aur debt asset backing hone ke chalte yeh scheme steady monthly growth ensure karti hai. Iska low expense ratio is salary segment me wealth protection ke liye highly recommended hai.`;
    }

    return `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.88rem;">
          <span style="color: var(--accent-green);">${d.name} (${sym})</span>
          <span>NAV: ${formatINR(d.price)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px; border-bottom: 1px dashed var(--border); padding-bottom: 6px;">
          <span>Return (3Y): ${d.roe}%</span>
          <span>Expense Ratio: ${d.pe}%</span>
        </div>
        <p style="font-size: 0.78rem; line-height: 1.5; color: var(--text-secondary); margin: 8px 0 0 0; padding: 6px; border-left: 2px solid var(--accent-green); background: rgba(0, 245, 160, 0.02);">
          <strong>AI Buy Reason:</strong> ${buyReason}
        </p>
      </div>
    `;
  }).join('');

  if (recommendations.length === 0) {
    recsHTML = `<p style="font-size: 0.8rem; color: var(--text-muted);">No funds currently match this category. Showing all-weather picks.</p>`;
  }

  let adviceHinglish = "";
  if (risk === 'High') {
    adviceHinglish = `Aapki monthly salary ke hisab se <strong>${formatINR(minSip)} se ${formatINR(maxSip)}</strong> har mahine invest karna best rahega. Aapka risk profile High hai, isliye Equity segment ke Small/Mid cap funds aapke liye highly suitable hain long term returns generate karne ke liye.`;
  } else if (risk === 'Moderate') {
    adviceHinglish = `Aapki monthly salary ke hisab se <strong>${formatINR(minSip)} se ${formatINR(maxSip)}</strong> har mahine invest karna highly recommended hai. Moderate risk ke liye hybrid schemes best hain, jo inflation ko beat karne ke sath security bhi dete hain.`;
  } else {
    adviceHinglish = `Aapki monthly salary ke hisab se safe buffer ke liye <strong>${formatINR(minSip)} se ${formatINR(maxSip)}</strong> har mahine invest karna safe rahega. Low risk profile ke liye Debt aur liquid funds suitable hain, jo steady aur low-risk passive income provide karte hain.`;
  }

  resultPanel.innerHTML = `
    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-green); display: flex; align-items: center; gap: 6px;">
      <span></span> AI Investment Advisory Report
    </h4>
    <p style="font-size: 0.8rem; line-height: 1.6; margin-top: 8px; color: var(--text-secondary);">
      ${adviceHinglish}
    </p>
    <div style="margin-top: 14px;">
      <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Recommended Funds:</span>
      ${recsHTML}
    </div>
  `;
  resultPanel.style.display = 'block';
}

window.switchSidebarTab = function (tabName) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  // Deactivate all sidebar navigation buttons
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show target panel
  const panel = document.getElementById(`panel-${tabName}`);
  if (panel) panel.classList.add('active');

  // Activate target button
  const btn = document.getElementById(`tab-btn-${tabName}`);
  if (btn) btn.classList.add('active');
}

window.openSuitabilityModal = function (sym) {
  const fund = STOCK_DB[sym];
  if (!fund) return;
  document.getElementById('suitabilitySym').value = sym;
  document.getElementById('suitabilityFundName').textContent = fund.name;
  document.getElementById('suitabilityResult').style.display = 'none';

  // Prefill suitability form with defaults
  document.getElementById('suitabilityAge').value = '';
  document.getElementById('suitabilityHorizon').value = '';

  document.getElementById('suitabilityModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeSuitabilityModal = function () {
  document.getElementById('suitabilityModal').classList.remove('active');
  document.body.style.overflow = '';
}

window.calculateAIFundSuitability = function (e) {
  e.preventDefault();
  const sym = document.getElementById('suitabilitySym').value;
  const age = parseInt(document.getElementById('suitabilityAge').value);
  const horizon = parseInt(document.getElementById('suitabilityHorizon').value);
  const userRisk = document.getElementById('suitabilityRisk').value;
  const resultDiv = document.getElementById('suitabilityResult');

  const fund = STOCK_DB[sym];
  if (!fund) return;

  // Determine fund risk index
  let fundRisk = 'moderate';
  if (fund.mcap === 'small') fundRisk = 'low';
  if (fund.mcap === 'large') fundRisk = 'high';

  let score = 90; // Default base score
  let advice = "";

  // 1. Age-based deductions
  if (age > 50 && fundRisk === 'high') {
    score -= 25;
    advice += "Aapki age senior bracket me hai aur high-risk equity schemes aapke capital protection goals ko impact kar sakti hain. ";
  }
  // 2. Horizon-based deductions
  if (horizon < 3 && fundRisk === 'high') {
    score -= 30;
    advice += "Short-term horizon (under 3 years) me equity mutual funds me high volatility ho sakti hai. Isse aapko temporary losses face karne pad sakte hain. ";
  } else if (horizon >= 5 && fundRisk === 'high') {
    score += 8;
  }
  // 3. Risk mismatch
  if (userRisk === 'low' && fundRisk === 'high') {
    score -= 20;
    advice += "Aap conservative option chahte hain, par yeh fund highly aggressive equity schemes me invest karta hai. Risk profile mismatch strong hai. ";
  } else if (userRisk === 'high' && fundRisk === 'low') {
    score -= 10;
    advice += "Aap growth potential chahte hain par yeh safe banking debt assets me invest karta hai jo moderate returns generate karega. ";
  }

  score = Math.max(10, Math.min(100, score));

  let scoreColor = 'var(--accent-green)';
  if (score < 50) scoreColor = '#ef4444';
  else if (score < 75) scoreColor = '#eab308';

  if (advice === "") {
    advice = `Aapki age (${age}), investment horizon (${horizon} years), aur risk appetite (${userRisk}) is mutual fund ke profile se perfect match karte hain. Is scheme me regular SIP invest karna recommended hai.`;
  } else {
    advice = "<strong>Warning alert:</strong> " + advice + "AI suggest karta hai ki is scheme ke sath portfolio core sector allocations ko split kar ke balanced ratio maintain karein.";
  }

  resultDiv.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
      <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">AI Compatibility Score</span>
      <span style="color: ${scoreColor}; font-size: 1.25rem; font-weight: 800;">${score}%</span>
    </div>
    <p style="font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">
      ${advice}
    </p>
  `;
  resultDiv.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  buildConfidenceBars();

  // Enforce authentication gate immediately
  checkAuthStatus();
  switchSidebarTab('markets');

  // Optimistically build UI immediately with simulated data
  buildTicker();
  buildIndices();
  buildGainersLosers();
  buildAllFundsTable();
  buildFundsCardGrid();
  buildPicks();
  buildNews();
  buildHeatmap();

  // Fetch databases in background
  loadDatabaseFromBackend().catch(err => console.error(err));
  loadNewsFromBackend().catch(err => console.error(err));

  initHeroChart();
  simulateLiveUpdates();
  recalculateSIP(); // run initial calculation

  const searchInput = document.getElementById('stockSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleStockSearch(e.target.value);
    });
  }

  setTimeout(initScrollAnimations, 500);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStockModal();
    closeChat();
    closeAuthModal();
  }
});

function handleStockSearch(query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  
  if (!query.trim()) {
    dropdown.innerHTML = '';
    dropdown.style.display = 'none';
    return;
  }
  
  const matches = Object.entries(STOCK_DB).filter(([sym, d]) => {
    return sym.toLowerCase().includes(query.toLowerCase()) || 
           d.name.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 5);
  
  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="search-dropdown-item" style="color: var(--text-muted); cursor: default; padding: 8px 12px; font-size: 0.8rem;">No matching funds found</div>`;
    dropdown.style.display = 'block';
    return;
  }
  
  dropdown.innerHTML = matches.map(([sym, d]) => `
    <div class="search-dropdown-item" onclick="openStockModal('${sym}')" style="padding: 8px 12px; cursor: pointer; font-size: 0.8rem; border-bottom: 1px solid var(--border);">
      <strong style="color: var(--accent-green);">${sym}</strong> - <span style="font-size: 0.75rem; color: var(--text-secondary);">${d.name}</span>
    </div>
  `).join('');
  dropdown.style.display = 'block';
}

// ================================================================
// PROFILE MODAL
// ================================================================
function switchProfileTab(tabId) {
  // Update buttons
  document.querySelectorAll('.modal-tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById('ptab-btn-' + tabId).classList.add('active');
  
  // Update content
  document.querySelectorAll('.profile-tab-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  const activeTab = document.getElementById('ptab-' + tabId);
  activeTab.classList.add('active');
  activeTab.style.display = 'flex';
}

function openProfileModal() {
  const userStr = localStorage.getItem('auth_user');
  let user = { 
    name: '', email: '', phone: '', dob: '', pan: '', bank: '', ifsc: '',
    address: '', occupation: 'Private Sector', income: 'Below 1 Lakh',
    demat: '', segments: 'Equity & Mutual Funds', nominee: '', nomRelation: 'Spouse'
  };
  try {
    user = Object.assign(user, JSON.parse(userStr || '{}'));
  } catch(e){}

  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  const phoneInput = document.getElementById('profilePhoneInput');
  const dobInput = document.getElementById('profileDobInput');
  const panInput = document.getElementById('profilePanInput');
  const bankInput = document.getElementById('profileBankInput');
  const ifscInput = document.getElementById('profileIfscInput');
  
  // New fields
  const addrInput = document.getElementById('profileAddressInput');
  const occInput = document.getElementById('profileOccupationInput');
  const incInput = document.getElementById('profileIncomeInput');
  const dematInput = document.getElementById('profileDematInput');
  const segInput = document.getElementById('profileSegmentsInput');
  const nomInput = document.getElementById('profileNomineeInput');
  const nomRelInput = document.getElementById('profileNomRelationInput');
  
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (dobInput) dobInput.value = user.dob || '';
  if (panInput) panInput.value = user.pan || '';
  if (bankInput) bankInput.value = user.bank || '';
  if (ifscInput) ifscInput.value = user.ifsc || '';
  
  if (addrInput) addrInput.value = user.address || '';
  if (occInput) occInput.value = user.occupation || 'Private Sector';
  if (incInput) incInput.value = user.income || 'Below 1 Lakh';
  if (dematInput) dematInput.value = user.demat || '';
  if (segInput) segInput.value = user.segments || 'Equity & Mutual Funds';
  if (nomInput) nomInput.value = user.nominee || '';
  if (nomRelInput) nomRelInput.value = user.nomRelation || 'Spouse';

  // Reset to first tab
  switchProfileTab('personal');

  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('active');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('active');
}

function saveProfile() {
  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  const phoneInput = document.getElementById('profilePhoneInput');
  const dobInput = document.getElementById('profileDobInput');
  const panInput = document.getElementById('profilePanInput');
  const bankInput = document.getElementById('profileBankInput');
  const ifscInput = document.getElementById('profileIfscInput');

  // New fields
  const addrInput = document.getElementById('profileAddressInput');
  const occInput = document.getElementById('profileOccupationInput');
  const incInput = document.getElementById('profileIncomeInput');
  const dematInput = document.getElementById('profileDematInput');
  const segInput = document.getElementById('profileSegmentsInput');
  const nomInput = document.getElementById('profileNomineeInput');
  const nomRelInput = document.getElementById('profileNomRelationInput');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newEmail = emailInput ? emailInput.value.trim() : '';
  const newPhone = phoneInput ? phoneInput.value.trim() : '';
  const newDob = dobInput ? dobInput.value : '';
  const newPan = panInput ? panInput.value.trim().toUpperCase() : '';
  const newBank = bankInput ? bankInput.value.trim() : '';
  const newIfsc = ifscInput ? ifscInput.value.trim().toUpperCase() : '';
  
  const newAddr = addrInput ? addrInput.value.trim() : '';
  const newOcc = occInput ? occInput.value : '';
  const newInc = incInput ? incInput.value : '';
  const newDemat = dematInput ? dematInput.value.trim() : '';
  const newSeg = segInput ? segInput.value : '';
  const newNom = nomInput ? nomInput.value.trim() : '';
  const newNomRel = nomRelInput ? nomRelInput.value : '';
  
  if (!newName) {
    alert('Name is required!');
    return;
  }

  const userStr = localStorage.getItem('auth_user');
  let user = {};
  try {
    user = JSON.parse(userStr || '{}');
  } catch(e){}

  user.name = newName;
  user.email = newEmail;
  user.phone = newPhone;
  user.dob = newDob;
  user.pan = newPan;
  user.bank = newBank;
  user.ifsc = newIfsc;
  
  user.address = newAddr;
  user.occupation = newOcc;
  user.income = newInc;
  user.demat = newDemat;
  user.segments = newSeg;
  user.nominee = newNom;
  user.nomRelation = newNomRel;
  
  localStorage.setItem('auth_user', JSON.stringify(user));
  
  closeProfileModal();
  alert('Profile updated successfully!');
  
  // Re-run the auth check to update UI widgets
  checkAuth();
}

function updateUploadLabel(input) {
  const container = input.parentElement;
  const label = container.querySelector('span');
  if (input.files && input.files.length > 0) {
    label.textContent = input.files[0].name;
    container.classList.add('has-file');
  } else {
    label.textContent = 'Upload ' + (input.id.replace('Upload','').replace('pan','PAN '));
    container.classList.remove('has-file');
  }
}
