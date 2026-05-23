const STORAGE_KEY = "tradevue-journal-trades-v2";
const OLD_STORAGE_KEY = "tradevue-journal-trades-v1";
const SETTINGS_KEY = "tradevue-journal-settings-v1";

const defaultSettings = {
  startingBalance: 10000,
  dailyLossLimit: 500,
  propFirmPassed: false,
  customStructures: []
};

const baseStructures = ["IFVG", "Fair Value Gap", "Breaker Block", "Liquidity Sweep", "Other"];

const rawSample = [
  ["2026-04-13", "NASDAQ", "Breakout retest", "Long", "13:00", "13:15", 212.29, 211.55, 25, 0.36, 210.12, 2, true, false, false, "Paper Trading", "Entered a little early; risk was controlled."],
  ["2026-04-14", "NASDAQ", "Pullback to support", "Long", "10:30", "11:10", 205.6, 212.32, 100, 1.2, 202.73, 1, true, false, false, "Paper Trading", "Good entry after confirmation; managed risk well."],
  ["2026-04-15", "S&P 500", "VWAP bounce", "Long", "13:00", "14:30", 117.54, 116.32, 40, 0.92, 114.94, 4, true, false, false, "Demo Trading", "Market reversed after entry; followed stop."],
  ["2026-04-16", "NASDAQ", "Breakout retest", "Long", "11:05", "11:45", 191.25, 187.7, 30, 0.82, 186.52, 2, true, false, false, "Paper Trading", "Entered a little early; risk was controlled."],
  ["2026-04-17", "S&P 500", "Opening range breakout", "Long", "11:00", "11:25", 157.94, 158.01, 25, 0.95, 156.5, 2, true, false, false, "Demo Trading", "Exited flat when setup lost momentum."],
  ["2026-04-20", "NASDAQ", "Pullback to support", "Long", "10:05", "12:05", 257.24, 255.85, 40, 0.43, 254.66, 4, false, false, true, "Paper Trading", "Should have waited for stronger confirmation."],
  ["2026-04-21", "S&P 500", "Pullback to support", "Short", "13:45", "14:00", 279.3, 275.71, 20, 1.03, 283.68, 4, true, false, true, "Demo Trading", "Kept stop tight and let winner work."],
  ["2026-04-22", "S&P 500", "Breakout retest", "Short", "13:05", "14:05", 196.23, 189.24, 15, 0.39, 199.95, 3, true, false, false, "Paper Trading", "Patient setup; exited cleanly when momentum slowed."],
  ["2026-04-23", "NASDAQ", "Trend continuation", "Long", "14:00", "15:30", 238.52, 235.92, 100, 1.22, 234.33, 2, false, true, true, "Live Trading", "Should have waited for stronger confirmation."],
  ["2026-04-24", "NASDAQ", "Trend continuation", "Short", "14:05", "14:30", 80.74, 77.87, 25, 0.34, 82.57, 4, true, false, true, "Paper Trading", "Good entry after confirmation; managed risk well."],
  ["2026-04-27", "NASDAQ", "Pullback to support", "Short", "13:00", "13:25", 261.38, 265.21, 25, 1.37, 266.49, 4, false, true, true, "Demo Trading", "Stopped out; setup did not continue."],
  ["2026-04-28", "NASDAQ", "Pullback to support", "Long", "13:05", "14:35", 19.88, 19.67, 10, 0.55, 19.67, 3, false, false, true, "Paper Trading", "Should have waited for stronger confirmation."],
  ["2026-04-29", "S&P 500", "Pullback to support", "Short", "09:00", "10:00", 42.71, 43.26, 50, 1.07, 43.25, 3, false, false, true, "Paper Trading", "Stopped out; setup did not continue."],
  ["2026-04-30", "NASDAQ", "Resistance rejection", "Long", "14:00", "14:15", 54.73, 54.74, 20, 1.33, 54.11, 4, true, false, false, "Demo Trading", "Small scratch trade; no clear follow-through."],
  ["2026-05-01", "NASDAQ", "Moving average bounce", "Long", "13:15", "14:15", 145.24, 147.2, 25, 0.74, 141.98, 2, true, false, true, "Paper Trading", "Good entry after confirmation; managed risk well."],
  ["2026-05-04", "NASDAQ", "Breakout retest", "Long", "14:05", "14:20", 169.75, 171.64, 100, 1.4, 168.53, 1, true, false, false, "Paper Trading", "Good entry after confirmation; managed risk well."],
  ["2026-05-05", "NASDAQ", "Pullback to support", "Long", "11:15", "11:40", 123.79, 127.8, 25, 0.96, 121.69, 4, true, false, false, "Demo Trading", "Good entry after confirmation; managed risk well."],
  ["2026-05-06", "S&P 500", "Trend continuation", "Long", "14:15", "14:40", 137.79, 136.97, 15, 0.92, 136.94, 3, false, false, true, "Paper Trading", "Stopped out; setup did not continue."],
  ["2026-05-07", "S&P 500", "Opening range breakout", "Short", "14:15", "16:15", 132.8, 132.67, 100, 0.26, 135.37, 4, true, false, false, "Demo Trading", "Small scratch trade; no clear follow-through."],
  ["2026-05-08", "NASDAQ", "Opening range breakout", "Long", "09:00", "11:00", 89.36, 87.89, 25, 0.86, 87.61, 2, false, false, true, "Live Trading", "Market reversed after entry; followed stop."],
  ["2026-05-11", "S&P 500", "Opening range breakout", "Short", "10:45", "11:00", 184.92, 185.93, 30, 0.39, 186.6, 2, false, false, true, "Paper Trading", "Entered a little early; risk was controlled."],
  ["2026-05-12", "NASDAQ", "Trend continuation", "Long", "13:45", "15:45", 113.54, 115.66, 10, 1.23, 110.92, 4, true, false, false, "Demo Trading", "Good entry after confirmation; managed risk well."],
  ["2026-05-13", "NASDAQ", "Moving average bounce", "Long", "10:00", "11:00", 24.49, 24.26, 40, 0.56, 23.98, 3, false, false, true, "Paper Trading", "Should have waited for stronger confirmation."],
  ["2026-05-14", "NASDAQ", "Failed breakdown reversal", "Short", "11:15", "13:15", 97.96, 96.8, 25, 0.34, 98.96, 1, true, false, true, "Demo Trading", "Patient setup; exited cleanly when momentum slowed."],
  ["2026-05-15", "NASDAQ", "Opening range breakout", "Short", "14:00", "15:00", 170.11, 167.64, 30, 0.8, 171.25, 1, true, false, false, "Paper Trading", "Patient setup; exited cleanly when momentum slowed."],
  ["2026-05-18", "NASDAQ", "Breakout retest", "Short", "11:45", "12:25", 154.22, 156.84, 100, 0.79, 157.16, 4, true, false, false, "Live Trading", "Market reversed after entry; followed stop."],
  ["2026-05-19", "NASDAQ", "Failed breakdown reversal", "Short", "10:45", "12:15", 123.43, 124.96, 30, 1.19, 125.47, 4, false, false, true, "Paper Trading", "Should have waited for stronger confirmation."],
  ["2026-05-20", "S&P 500", "Trend continuation", "Short", "10:00", "10:40", 73.07, 71.4, 40, 1.38, 74.15, 4, true, false, false, "Demo Trading", "Followed plan and took profit near target."],
  ["2026-05-21", "NASDAQ", "Pullback to support", "Short", "13:45", "14:10", 229.32, 225.92, 20, 0.34, 230.8, 2, true, false, true, "Paper Trading", "Kept stop tight and let winner work."],
  ["2026-05-22", "NASDAQ", "Breakout retest", "Long", "14:05", "17:05", 251.88, 249.31, 15, 0.83, 246.64, 3, false, false, true, "Paper Trading", "Should have waited for stronger confirmation."]
];

const sampleTrades = rawSample.map((row) => normalizeTrade({
  date: row[0],
  symbol: row[1],
  setup: row[2],
  side: row[3],
  entryTime: row[4],
  exitTime: row[5],
  entry: row[6],
  exit: row[7],
  qty: row[8],
  fees: row[9],
  stop: row[10],
  emotionLevel: row[11],
  followedPlan: row[12],
  overtraded: row[13],
  mistake: row[14],
  tradeType: row[15],
  notes: row[16]
}));

let state = {
  trades: loadTrades(),
  settings: loadSettings(),
  range: "30",
  recentAsc: false,
  pendingScreenshots: []
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTrade(trade) {
  const entry = Number(trade.entry) || 0;
  const exit = Number(trade.exit) || 0;
  const qty = Number(trade.qty) || 0;
  const fees = Number(trade.fees) || 0;
  const stop = Number(trade.stop) || 0;
  const side = trade.side || "Long";
  const multiplier = side === "Short" ? -1 : 1;
  const gross = (exit - entry) * qty * multiplier;
  const net = gross - fees;
  const risk = stop ? Math.abs(entry - stop) * qty : 0;
  return {
    id: trade.id || uid(),
    date: trade.date || isoDate(new Date()),
    symbol: normalizeSymbol(trade.symbol),
    tradeType: trade.tradeType || "Paper Trading",
    setup: trade.setup || trade.tradeStructure || "Unlabeled setup",
    tradeStructure: trade.tradeStructure || trade.setup || "Other",
    customStructure: trade.customStructure || "",
    side,
    entryTime: trade.entryTime || "",
    exitTime: trade.exitTime || "",
    entry,
    exit,
    qty,
    fees,
    stop,
    emotionLevel: clamp(Number(trade.emotionLevel ?? trade.emotion ?? 3), 1, 5),
    followedPlan: boolValue(trade.followedPlan, !trade.mistake),
    overtraded: boolValue(trade.overtraded, false),
    mistake: boolValue(trade.mistake, false),
    notes: trade.notes || "",
    screenshots: Array.isArray(trade.screenshots) ? trade.screenshots : (trade.screenshot ? [trade.screenshot] : []),
    gross,
    net,
    risk,
    r: risk ? net / risk : 0
  };
}

function normalizeSymbol(symbol) {
  const raw = String(symbol || "NASDAQ").toUpperCase();
  if (raw.includes("S&P") || raw.includes("SPY") || raw.includes("ES")) return "S&P 500";
  return "NASDAQ";
}

function boolValue(value, fallback) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "Yes" || value === "yes") return true;
  if (value === "false" || value === "No" || value === "no") return false;
  return fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value || min));
}

function loadTrades() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
  if (!saved) return sampleTrades;
  try {
    return JSON.parse(saved).map(normalizeTrade);
  } catch {
    return sampleTrades;
  }
}

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { ...defaultSettings };
  }
}

function saveTrades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trades));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function filteredTrades() {
  const sorted = [...state.trades].sort(byDate);
  if (state.range === "all") return sorted;
  const latest = new Date(sorted.at(-1)?.date || Date.now());
  const cutoff = new Date(latest);
  cutoff.setDate(cutoff.getDate() - Number(state.range) + 1);
  return sorted.filter((trade) => new Date(`${trade.date}T00:00`) >= cutoff);
}

function scoringTrades(trades = filteredTrades()) {
  return trades.filter((trade) => trade.tradeType !== "Paper Trading");
}

function paperTrades(trades = filteredTrades()) {
  return trades.filter((trade) => trade.tradeType === "Paper Trading");
}

function byDate(a, b) {
  return new Date(`${a.date}T${a.entryTime || "00:00"}`) - new Date(`${b.date}T${b.entryTime || "00:00"}`);
}

function money(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function compactMoney(value) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 1 : 2)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function groupBy(rows, keyFn) {
  return rows.reduce((groups, row) => {
    const key = keyFn(row);
    groups[key] ||= [];
    groups[key].push(row);
    return groups;
  }, {});
}

function metrics(trades = filteredTrades()) {
  const wins = trades.filter((trade) => trade.net > 0);
  const losses = trades.filter((trade) => trade.net < 0);
  const grossProfit = sum(wins, "net");
  const grossLoss = Math.abs(sum(losses, "net"));
  const avgWin = wins.length ? grossProfit / wins.length : 0;
  const avgLoss = losses.length ? grossLoss / losses.length : 0;
  return {
    trades,
    net: sum(trades, "net"),
    wins,
    losses,
    winRate: trades.length ? wins.length / trades.length : 0,
    profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? 99 : 0,
    avgWin,
    avgLoss,
    avgRr: avgLoss ? avgWin / avgLoss : 0,
    expectancy: trades.length ? sum(trades, "net") / trades.length : 0,
    disciplineScore: disciplineScore(trades)
  };
}

function disciplineScore(trades) {
  if (!trades.length) return 0;
  const total = trades.reduce((score, trade) => {
    let points = 0;
    if (trade.followedPlan) points += 55;
    if (!trade.mistake) points += 20;
    if (!trade.overtraded) points += 15;
    points += Math.max(0, 10 - (trade.emotionLevel - 1) * 2.5);
    return score + points;
  }, 0);
  return Math.round(total / trades.length);
}

function dailySeries(trades = filteredTrades()) {
  const byDay = groupBy(trades, (trade) => trade.date);
  return Object.keys(byDay).sort().map((date) => ({
    date,
    trades: byDay[date],
    pnl: sum(byDay[date], "net")
  }));
}

function equitySeries(trades = filteredTrades()) {
  let balance = state.settings.startingBalance;
  return dailySeries(trades).map((day) => {
    balance += day.pnl;
    return { ...day, balance };
  });
}

function maxDrawdown(series) {
  let peak = state.settings.startingBalance;
  let drawdown = 0;
  series.forEach((point) => {
    peak = Math.max(peak, point.balance);
    drawdown = Math.min(drawdown, point.balance - peak);
  });
  return drawdown;
}

function render() {
  renderDashboard();
  renderPaperDashboard();
  renderCalendar();
  renderTrades();
  renderHistory();
  renderReports();
  renderMilestones();
  renderCoach();
  renderSettings();
}

function timeOptions() {
  const options = [];
  for (let minutes = 9 * 60; minutes <= 14 * 60 + 30; minutes += 5) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const hour12 = ((hour24 + 11) % 12) + 1;
    const value = `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const label = `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
    options.push({ value, label });
  }
  return options;
}

function renderTimeDropdowns() {
  const html = `<option value="">Select time</option>${timeOptions().map((time) => `<option value="${time.value}">${time.label}</option>`).join("")}`;
  $("#tradeForm [name=entryTime]").innerHTML = html;
  $("#tradeForm [name=exitTime]").innerHTML = html;
}

function structures() {
  return [...new Set([...baseStructures.filter((item) => item !== "Other"), ...(state.settings.customStructures || []), "Other"])];
}

function renderStructureDropdown(selected = "") {
  const select = $("#tradeForm [name=tradeStructure]");
  select.innerHTML = structures().map((item) => `<option value="${escapeAttr(item)}">${item}</option>`).join("");
  select.value = selected && structures().includes(selected) ? selected : select.value || "IFVG";
  toggleCustomStructure();
}

function toggleCustomStructure() {
  const isOther = $("#tradeForm [name=tradeStructure]").value === "Other";
  document.querySelector(".custom-structure-field").classList.toggle("hidden", !isOther);
}

function renderScreenshotPreview() {
  $("#screenshotPreview").innerHTML = state.pendingScreenshots.length ? state.pendingScreenshots.map((src, index) => `
    <div class="preview-shot">
      <img src="${src}" alt="Selected trade screenshot ${index + 1}" />
      <button class="tiny-button" type="button" data-remove-shot="${index}">Remove</button>
    </div>
  `).join("") : "";
}

function renderDashboard() {
  const allTrades = filteredTrades();
  const trades = scoringTrades(allTrades);
  const m = metrics(trades);
  const series = equitySeries(trades);
  const currentBalance = series.at(-1)?.balance ?? state.settings.startingBalance;
  const best = [...trades].sort((a, b) => b.net - a.net)[0];
  const worst = [...trades].sort((a, b) => a.net - b.net)[0];
  const today = series.at(-1);
  const usedToday = today ? Math.max(0, -today.pnl) : 0;
  const remaining = state.settings.dailyLossLimit - usedToday;
  const lossPct = Math.min(100, usedToday / state.settings.dailyLossLimit * 100);

  $("#startingBalance").textContent = money(state.settings.startingBalance);
  $("#currentBalance").textContent = money(currentBalance);
  $("#totalPnl").textContent = money(m.net);
  $("#totalPnl").className = pnlClass(m.net);
  $("#winRateCard").textContent = percent(m.winRate);
  $("#winRateDetail").textContent = `${trades.length} trades, ${m.wins.length} wins, ${m.losses.length} losses`;
  $("#avgRrCard").textContent = `1 : ${m.avgRr.toFixed(1)}`;
  $("#maxDrawdownCard").textContent = money(maxDrawdown(series));
  $("#maxDrawdownCard").className = "negative";
  $("#disciplineScoreCard").textContent = `${m.disciplineScore}%`;
  $("#disciplineDetail").textContent = `${trades.filter((t) => t.followedPlan).length}/${trades.length} followed plan`;
  $("#bestTradeCard").textContent = best ? compactMoney(best.net) : "$0";
  $("#bestTradeCard").className = "positive";
  $("#bestTradeDetail").textContent = best ? `${best.symbol} - ${best.setup}` : "No trades yet.";
  $("#worstTradeCard").textContent = worst ? compactMoney(worst.net) : "$0";
  $("#worstTradeCard").className = "negative";
  $("#worstTradeDetail").textContent = worst ? `${worst.symbol} - ${worst.setup}` : "No trades yet.";
  $("#lossLimitLabel").textContent = money(state.settings.dailyLossLimit);
  $("#usedToday").textContent = money(usedToday);
  $("#remainingToday").textContent = money(Math.max(0, remaining));
  $("#lossLimitBar").style.width = `${lossPct}%`;
  $("#lossLimitBar").className = lossPct >= 100 ? "danger" : lossPct >= 70 ? "warn" : "safe";
  $("#lossLimitStatus").textContent = lossPct >= 100 ? "Limit hit. Stop trading." : lossPct >= 70 ? "Close to limit. Reduce size or stop." : "Safe.";

  renderEquityChart(series, "#equityChart");
  renderHourly(trades, "#hourlyList");
  renderCalendarInto("#dashboardCalendarBoard", trades);
}

function renderPaperDashboard() {
  const trades = paperTrades(filteredTrades());
  const m = metrics(trades);
  const series = equitySeries(trades);
  const currentBalance = series.at(-1)?.balance ?? state.settings.startingBalance;
  const best = [...trades].sort((a, b) => b.net - a.net)[0];
  const worst = [...trades].sort((a, b) => a.net - b.net)[0];

  $("#paperStartingBalance").textContent = money(state.settings.startingBalance);
  $("#paperCurrentBalance").textContent = money(currentBalance);
  $("#paperTotalPnl").textContent = money(m.net);
  $("#paperTotalPnl").className = pnlClass(m.net);
  $("#paperTotalTrades").textContent = trades.length;
  $("#paperWins").textContent = m.wins.length;
  $("#paperLosses").textContent = m.losses.length;
  $("#paperWinRateCard").textContent = percent(m.winRate);
  $("#paperWinRateDetail").textContent = `${trades.length} paper trades, ${m.wins.length} wins, ${m.losses.length} losses`;
  $("#paperAvgRrCard").textContent = `1 : ${m.avgRr.toFixed(1)}`;
  $("#paperMaxDrawdownCard").textContent = money(maxDrawdown(series));
  $("#paperMaxDrawdownCard").className = "negative";
  $("#paperDisciplineScoreCard").textContent = `${m.disciplineScore}%`;
  $("#paperDisciplineDetail").textContent = `${trades.filter((trade) => trade.followedPlan).length}/${trades.length} followed plan`;
  $("#paperBestTradeCard").textContent = best ? compactMoney(best.net) : "$0";
  $("#paperBestTradeCard").className = "positive";
  $("#paperBestTradeDetail").textContent = best ? `${best.symbol} - ${best.setup}` : "No paper trades yet.";
  $("#paperWorstTradeCard").textContent = worst ? compactMoney(worst.net) : "$0";
  $("#paperWorstTradeCard").className = "negative";
  $("#paperWorstTradeDetail").textContent = worst ? `${worst.symbol} - ${worst.setup}` : "No paper trades yet.";

  renderEquityChart(series, "#paperEquityChart");
  renderRecentTrades(trades, "#paperRecentTrades");
  renderHourly(trades, "#paperHourlyList");
  renderCalendarInto("#paperCalendarBoard", trades);
}

function renderEquityChart(series, targetSelector = "#equityChart") {
  const svg = $(targetSelector);
  const width = 900;
  const height = 260;
  const pad = 28;
  if (!series.length) {
    svg.innerHTML = `<text x="450" y="130" text-anchor="middle">No equity data yet</text>`;
    return;
  }
  const balances = [state.settings.startingBalance, ...series.map((p) => p.balance)];
  const min = Math.min(...balances);
  const max = Math.max(...balances);
  const span = max - min || 1;
  const points = series.map((point, i) => {
    const x = pad + (i / Math.max(series.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - ((point.balance - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const zeroY = height - pad - ((state.settings.startingBalance - min) / span) * (height - pad * 2);
  svg.innerHTML = `
    <line x1="${pad}" y1="${zeroY}" x2="${width - pad}" y2="${zeroY}" class="chart-zero"></line>
    <polyline points="${points}" class="chart-line"></polyline>
    ${series.map((point, i) => {
      const [x, y] = points.split(" ")[i].split(",");
      return `<circle cx="${x}" cy="${y}" r="4" class="${point.pnl >= 0 ? "dot-win" : "dot-loss"}"></circle>`;
    }).join("")}
    <text x="${pad}" y="18" class="chart-label">${money(max)}</text>
    <text x="${pad}" y="${height - 6}" class="chart-label">${money(min)}</text>
  `;
}

function renderRecentTrades(trades, targetSelector = "#recentTrades") {
  const rows = [...trades].sort((a, b) => state.recentAsc ? byDate(a, b) : byDate(b, a)).slice(0, 3);
  $(targetSelector).innerHTML = rows.map((trade) => `
    <article class="recent-card">
      <time>${formatDateTime(trade)}</time>
      <div class="recent-bottom">
        <div><strong>${trade.symbol}</strong><span>${trade.tradeType}</span></div>
        <div class="${pnlClass(trade.net)}">${money(trade.net)}</div>
      </div>
      <p>${trade.setup}</p>
    </article>
  `).join("");
}

function renderHourly(trades, targetSelector = "#hourlyList") {
  const groups = Object.entries(groupBy(trades, (trade) => (trade.entryTime || "00:00").slice(0, 2))).map(([hour, rows]) => ({
    hour,
    pnl: sum(rows, "net"),
    count: rows.length
  })).sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl)).slice(0, 5);
  const max = Math.max(...groups.map((g) => Math.abs(g.pnl)), 1);
  $(targetSelector).innerHTML = groups.map((group) => `
    <div class="hour-row">
      <span>${group.hour}:00</span>
      <span class="bar"><span style="--w:${Math.abs(group.pnl) / max * 100}%;--c:${group.pnl >= 0 ? "var(--green)" : "var(--red)"}"></span></span>
      <strong class="${pnlClass(group.pnl)}">${money(group.pnl)}</strong>
    </div>
  `).join("");
}

function renderCalendar() {
  renderCalendarInto("#calendarBoard", filteredTrades());
}

function renderCalendarInto(targetSelector, trades) {
  const days = dailySeries(trades);
  const byDay = Object.fromEntries(days.map((day) => [day.date, day]));
  const latest = new Date(`${trades.at(-1)?.date || isoDate(new Date())}T00:00`);
  const start = new Date(latest.getFullYear(), latest.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  const maxAbs = Math.max(...days.map((day) => Math.abs(day.pnl)), 1);
  if (targetSelector === "#calendarBoard") {
    $("#calendarSummary").textContent = `${trades.length} trades, ${money(sum(trades, "net"))} net`;
  }
  $(targetSelector).innerHTML = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = isoDate(date);
    const day = byDay[key];
    const intensity = day ? 0.18 + Math.min(0.74, Math.abs(day.pnl) / maxAbs * 0.74) : 0;
    const cls = day ? (day.pnl >= 0 ? "heat-win" : "heat-loss") : "heat-empty";
    return `<article class="calendar-cell ${cls}" style="--heat:${intensity}">
      <strong>${date.getDate()}</strong>
      <span>${day ? money(day.pnl) : "$0"}</span>
      <small>${day ? `${day.trades.length} trades` : "No trades"}</small>
    </article>`;
  }).join("");
}

function renderTrades() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const rows = filteredTrades().filter((trade) => `${trade.symbol} ${trade.setup} ${trade.tradeType} ${trade.notes}`.toLowerCase().includes(query)).sort((a, b) => byDate(b, a));
  $("#tradeRows").innerHTML = rows.map((trade) => `
    <tr>
      <td>${trade.date}</td>
      <td><strong>${trade.symbol}</strong></td>
      <td><span class="trade-type ${tradeTypeClass(trade.tradeType)}">${trade.tradeType}</span></td>
      <td>${trade.setup}</td>
      <td>${trade.side}</td>
      <td class="${pnlClass(trade.net)}">${money(trade.net)}</td>
      <td class="${pnlClass(trade.r)}">${trade.r.toFixed(2)}</td>
      <td>${trade.followedPlan ? "Yes" : "No"}</td>
      <td>${trade.mistake ? "Yes" : "No"}</td>
      <td class="row-actions"><button class="tiny-button" type="button" data-edit="${trade.id}">Edit</button><button class="delete-button" type="button" data-delete="${trade.id}">Delete</button></td>
    </tr>
  `).join("");
}

function renderHistory() {
  const rows = filteredTrades().sort((a, b) => byDate(b, a));
  $("#historyList").innerHTML = rows.map((trade) => `
    <article class="history-card">
      <div class="history-main">
        <div class="history-top">
          <strong>${trade.date} - ${trade.symbol}</strong>
          <span class="${pnlClass(trade.net)}">${money(trade.net)}</span>
        </div>
        <div class="history-session-line">
          <span>Start: ${formatTradeTime(trade.entryTime)}</span>
          <span>Finish: ${formatTradeTime(trade.exitTime)}</span>
          <strong class="${pnlClass(trade.net)}">P/L: ${money(trade.net)}</strong>
        </div>
        <div class="history-meta">
          <span>${trade.tradeType}</span>
          <span>${trade.setup}</span>
          <span>Plan: ${trade.followedPlan ? "Yes" : "No"}</span>
          <span>Mistake: ${trade.mistake ? "Yes" : "No"}</span>
          <span>Emotion: ${trade.emotionLevel}/5</span>
        </div>
        <label class="history-notes-label">Journal Notes
          <textarea class="history-note-editor" data-note-editor="${trade.id}" rows="4">${escapeHtml(trade.notes || "")}</textarea>
        </label>
        <button class="tiny-button" type="button" data-save-note="${trade.id}">Update notes</button>
      </div>
      <div class="history-shots">
        ${trade.screenshots.length ? trade.screenshots.map((src, index) => `<button class="shot-thumb" type="button" data-zoom="${trade.id}" data-shot="${index}"><img src="${src}" alt="Trade screenshot ${index + 1} for ${trade.symbol}" /></button>`).join("") : `<div class="empty-shot">No screenshot</div>`}
      </div>
    </article>
  `).join("");
}

function renderReports() {
  const trades = scoringTrades(filteredTrades());
  const m = metrics(trades);
  $("#reportMetrics").innerHTML = [
    ["Net P/L", money(m.net), pnlClass(m.net)],
    ["Trades", trades.length, ""],
    ["Win Rate", percent(m.winRate), ""],
    ["Profit Factor", m.profitFactor.toFixed(2), ""],
    ["Expectancy", money(m.expectancy), pnlClass(m.expectancy)],
    ["Discipline", `${m.disciplineScore}%`, ""]
  ].map(([label, value, cls]) => `<div class="report-tile"><span>${label}</span><strong class="${cls}">${value}</strong></div>`).join("");

  const setupRows = Object.entries(groupBy(trades, (trade) => trade.setup)).map(([setup, rows]) => {
    const wins = rows.filter((row) => row.net > 0);
    const losses = rows.filter((row) => row.net < 0);
    return {
      setup,
      trades: rows.length,
      winRate: rows.length ? wins.length / rows.length : 0,
      avgWin: wins.length ? sum(wins, "net") / wins.length : 0,
      avgLoss: losses.length ? Math.abs(sum(losses, "net")) / losses.length : 0,
      pnl: sum(rows, "net")
    };
  }).sort((a, b) => b.pnl - a.pnl);
  $("#setupBreakdown").innerHTML = setupRows.map((row) => `
    <tr><td>${row.setup}</td><td>${row.trades}</td><td>${percent(row.winRate)}</td><td>${money(row.avgWin)}</td><td>${money(row.avgLoss)}</td><td class="${pnlClass(row.pnl)}">${money(row.pnl)}</td></tr>
  `).join("");

  const watch = [
    ["Plan breaks", trades.filter((trade) => !trade.followedPlan)],
    ["Overtrading", trades.filter((trade) => trade.overtraded)],
    ["Mistakes", trades.filter((trade) => trade.mistake)],
    ["High emotion", trades.filter((trade) => trade.emotionLevel >= 4)]
  ];
  $("#watchList").innerHTML = watch.map(([label, rows]) => `<div class="watch-item"><strong>${label}</strong><span>${rows.length} trades</span><div class="${pnlClass(sum(rows, "net"))}">${money(sum(rows, "net"))}</div></div>`).join("");
}

function renderMilestones() {
  const days = dailySeries(scoringTrades(state.trades));
  const day200 = days.some((day) => day.pnl >= 200);
  const day2000 = days.some((day) => day.pnl >= 2000);
  const items = [
    { id: "day200", label: "Make $200 in One Day", done: day200, detail: bestDayText(days, 200) },
    { id: "day2000", label: "Make $2,000 in One Day", done: day2000, detail: bestDayText(days, 2000) },
    { id: "prop", label: "Pass Prop Firm Challenge", done: state.settings.propFirmPassed, detail: "Manual checkbox in Settings." }
  ];
  const html = items.map((item) => `
    <article class="milestone-card ${item.done ? "done" : ""}">
      <div><strong>${item.label}</strong><p>${item.detail}</p></div>
      <span>${item.done ? "Complete" : "Incomplete"}</span>
    </article>
  `).join("");
  $("#milestoneGrid").innerHTML = html;
  $("#sidebarMilestones").innerHTML = items.map((item) => `<div class="mini-milestone ${item.done ? "done" : ""}"><span></span>${item.label}</div>`).join("");
}

function bestDayText(days, target) {
  const best = [...days].sort((a, b) => b.pnl - a.pnl)[0];
  if (!best) return `Target: ${money(target)}`;
  return `Best day: ${money(best.pnl)} on ${best.date}`;
}

function renderCoach() {
  const trades = scoringTrades(filteredTrades());
  const m = metrics(trades);
  const badDiscipline = trades.filter((trade) => !trade.followedPlan || trade.mistake || trade.overtraded);
  const biggestLoss = [...trades].sort((a, b) => a.net - b.net)[0];
  const notes = [
    ["Discipline", `${m.disciplineScore}% score. ${badDiscipline.length} trades need review for plan breaks, overtrading, or mistakes.`],
    ["Risk", `Max drawdown is ${money(maxDrawdown(equitySeries(trades)))}. Keep the daily stop visible before each session.`],
    ["Review", biggestLoss ? `Worst trade: ${biggestLoss.symbol} ${money(biggestLoss.net)}. Review its note and screenshot before the next session.` : "Add trades to see review prompts."]
  ];
  $("#coachNotes").innerHTML = notes.map(([title, body]) => `<div class="coach-note"><strong>${title}</strong><p>${body}</p></div>`).join("");
}

function renderSettings() {
  $("#settingsForm [name=propFirmPassed]").checked = state.settings.propFirmPassed;
}

function switchView(view) {
  $$(".view").forEach((el) => el.classList.toggle("active", el.id === `${view}View`));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  const titles = {
    dashboard: ["Dashboard", "Performance, risk, and discipline at a glance."],
    calendar: ["Calendar", "Daily P/L heatmap and trade count."],
    trades: ["Trades", "Search, edit, export, or delete records."],
    journal: ["Journal", "Create or edit a trade entry."],
    history: ["Journal History", "Look back at notes, screenshots, mistakes, and plan discipline."],
    reports: ["Reports", "Setup performance and rule-break analysis."],
    milestones: ["Milestones", "Progress toward trading goals."],
    settings: ["Settings", "Track manual prop-firm challenge completion."],
    paper: ["Paper Dashboard", "Practice results only. Paper trades do not affect the main dashboard."]
  };
  $("#viewTitle").textContent = titles[view][0];
  $("#viewSubtitle").textContent = titles[view][1];
}

function clearForm() {
  $("#tradeForm").reset();
  $("#tradeForm [name=id]").value = "";
  $("#tradeForm [name=date]").value = isoDate(new Date());
  $("#journalHeading").textContent = "New trade";
  state.pendingScreenshots = [];
  $("#screenshotPreview").innerHTML = "";
  renderStructureDropdown("IFVG");
}

function fillForm(trade) {
  const form = $("#tradeForm");
  renderStructureDropdown(trade.tradeStructure);
  for (const key of ["id", "date", "symbol", "tradeType", "side", "entryTime", "exitTime", "entry", "exit", "qty", "fees", "stop", "emotionLevel", "notes", "customStructure"]) {
    if (form.elements[key]) form.elements[key].value = trade[key] ?? "";
  }
  if (structures().includes(trade.tradeStructure)) {
    form.elements.tradeStructure.value = trade.tradeStructure;
  } else {
    form.elements.tradeStructure.value = "Other";
    form.elements.customStructure.value = trade.tradeStructure;
  }
  toggleCustomStructure();
  form.elements.followedPlan.value = String(trade.followedPlan);
  form.elements.overtraded.value = String(trade.overtraded);
  form.elements.mistake.value = String(trade.mistake);
  state.pendingScreenshots = [...trade.screenshots];
  renderScreenshotPreview();
  $("#journalHeading").textContent = "Edit trade";
  switchView("journal");
}

async function screenshotsFromInput(input) {
  const files = [...(input.files || [])];
  if (!files.length) return [...state.pendingScreenshots];
  const loaded = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
  return [...state.pendingScreenshots, ...loaded];
}

function formTradePayload(form, screenshots) {
  const structureValue = form.get("tradeStructure");
  const custom = String(form.get("customStructure") || "").trim();
  const resolvedStructure = structureValue === "Other" && custom ? custom : structureValue;
  if (custom && !state.settings.customStructures.includes(custom)) {
    state.settings.customStructures.push(custom);
    saveSettings();
  }
  return normalizeTrade({
    id: form.get("id") || undefined,
    date: form.get("date"),
    symbol: form.get("symbol"),
    tradeType: form.get("tradeType"),
    setup: resolvedStructure,
    tradeStructure: resolvedStructure,
    customStructure: structureValue === "Other" ? custom : "",
    side: form.get("side"),
    entryTime: form.get("entryTime"),
    exitTime: form.get("exitTime"),
    entry: form.get("entry"),
    exit: form.get("exit"),
    qty: form.get("qty"),
    fees: form.get("fees"),
    stop: form.get("stop"),
    emotionLevel: form.get("emotionLevel"),
    followedPlan: form.get("followedPlan"),
    overtraded: form.get("overtraded"),
    mistake: form.get("mistake"),
    notes: form.get("notes"),
    screenshots
  });
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map(splitCsvLine);
  const headers = rows.shift().map((h) => h.trim().toLowerCase());
  return rows.map((row) => {
    const item = Object.fromEntries(headers.map((h, i) => [h, row[i]]));
    return normalizeTrade({
      date: item.date,
      symbol: item.symbol,
      tradeType: item.tradetype || item["trade type"],
      setup: item.structure || item.tradestructure || item["trade structure"] || item.setup || item.strategy || item["strategy / setup"],
      tradeStructure: item.structure || item.tradestructure || item["trade structure"] || item.setup || item.strategy || item["strategy / setup"],
      side: item.side || item.direction,
      entryTime: item.entrytime || item["entry time"],
      exitTime: item.exittime || item["exit time"],
      entry: item.entry || item["entry price"],
      exit: item.exit || item["exit price"],
      qty: item.qty || item.shares || item.quantity,
      fees: item.fees,
      stop: item.stop || item["stop loss"] || item["stop loss price"],
      emotionLevel: item.emotionlevel || item["emotion level"],
      followedPlan: item.followedplan || item["followed plan"],
      overtraded: item.overtraded,
      mistake: item.mistake || item["mistake?"],
      notes: item.notes || item["journal notes"]
    });
  }).filter((trade) => trade.date && trade.symbol);
}

function splitCsvLine(line) {
  const out = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      out.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  out.push(cell);
  return out;
}

function exportCsv() {
  const headers = ["date", "symbol", "tradeType", "tradeStructure", "setup", "side", "entryTime", "exitTime", "entry", "exit", "qty", "fees", "stop", "emotionLevel", "followedPlan", "overtraded", "mistake", "notes"];
  const lines = [headers.join(",")].concat(state.trades.map((trade) => headers.map((header) => csvValue(trade[header])).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trades.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportAiReportFile() {
  const all = [...state.trades].sort(byDate);
  const real = scoringTrades(all);
  const paper = paperTrades(all);
  const realMetrics = metrics(real);
  const paperMetrics = metrics(paper);
  const lines = [
    "# Trading Journal Data for AI Review",
    "",
    "Use this data to analyze trading performance, discipline, risk management, setup quality, emotional patterns, repeated mistakes, and improvement priorities.",
    "",
    "## Summary",
    "",
    `- Total trades: ${all.length}`,
    `- Real score trades (Demo + Live only): ${real.length}`,
    `- Paper trades: ${paper.length}`,
    `- Demo/Live net P/L: ${money(realMetrics.net)}`,
    `- Demo/Live win rate: ${percent(realMetrics.winRate)}`,
    `- Demo/Live profit factor: ${realMetrics.profitFactor.toFixed(2)}`,
    `- Demo/Live expectancy: ${money(realMetrics.expectancy)}`,
    `- Demo/Live discipline score: ${realMetrics.disciplineScore}%`,
    `- Paper net P/L: ${money(paperMetrics.net)}`,
    `- Paper win rate: ${percent(paperMetrics.winRate)}`,
    `- Paper discipline score: ${paperMetrics.disciplineScore}%`,
    "",
    "## Trades",
    "",
    "| # | Date | Type | Symbol | Structure | Side | Entry Time | Exit Time | Net P/L | R | Followed Plan | Overtraded | Mistake | Emotion | Screenshots | Notes |",
    "|---|---|---|---|---|---|---|---|---:|---:|---|---|---|---:|---:|---|",
    ...all.map((trade, index) => [
      index + 1,
      trade.date,
      trade.tradeType,
      trade.symbol,
      trade.setup,
      trade.side,
      trade.entryTime || "",
      trade.exitTime || "",
      money(trade.net),
      trade.r.toFixed(2),
      trade.followedPlan ? "Yes" : "No",
      trade.overtraded ? "Yes" : "No",
      trade.mistake ? "Yes" : "No",
      trade.emotionLevel,
      trade.screenshots.length,
      (trade.notes || "").replace(/\n/g, " ")
    ].map(markdownCell).join("|").replace(/^/, "|").replace(/$/, "|")),
    "",
    "## Raw JSON",
    "",
    "```json",
    JSON.stringify({ settings: state.settings, trades: all }, null, 2),
    "```"
  ];
  downloadTextFile("trading_journal_ai_report.md", lines.join("\n"), "text/markdown");
}

function markdownCell(value) {
  return ` ${String(value ?? "").replaceAll("|", "/")} `;
}

function downloadTextFile(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function pnlClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function tradeTypeClass(type) {
  if (type === "Demo Trading") return "demo";
  if (type === "Live Trading") return "live";
  return "paper";
}

function formatDateTime(trade) {
  const date = new Date(`${trade.date}T${trade.entryTime || "00:00"}`);
  return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}${trade.entryTime ? ` ${trade.entryTime}` : ""}`;
}

function formatTradeTime(value) {
  if (!value) return "Not set";
  const [hourText, minuteText] = value.split(":");
  const hour24 = Number(hourText);
  const minute = Number(minuteText || 0);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function toast(message) {
  const old = $(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2400);
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) switchView(viewButton.dataset.view);

  const rangeButton = event.target.closest("[data-range]");
  if (rangeButton) {
    state.range = rangeButton.dataset.range;
    $("[data-range].active")?.classList.remove("active");
    rangeButton.classList.add("active");
    render();
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "import") $("#csvFile").click();
  if (action === "sort-recent") {
    state.recentAsc = !state.recentAsc;
    renderRecentTrades(paperTrades(filteredTrades()), "#paperRecentTrades");
  }
  if (action === "export") exportCsv();
  if (action === "export-ai") exportAiReportFile();
  if (action === "reset-sample") {
    state.trades = sampleTrades;
    saveTrades();
    render();
    toast("Sample trades restored");
  }
  if (action === "clear-form") clearForm();
  if (action === "close-lightbox") {
    $("#imageLightbox").classList.add("hidden");
    $("#lightboxImage").src = "";
  }

  const removeShot = event.target.closest("[data-remove-shot]")?.dataset.removeShot;
  if (removeShot !== undefined) {
    state.pendingScreenshots.splice(Number(removeShot), 1);
    renderScreenshotPreview();
  }

  const editId = event.target.closest("[data-edit]")?.dataset.edit;
  if (editId) fillForm(state.trades.find((trade) => trade.id === editId));

  const noteId = event.target.closest("[data-save-note]")?.dataset.saveNote;
  if (noteId) {
    const editor = document.querySelector(`[data-note-editor="${noteId}"]`);
    const trade = state.trades.find((item) => item.id === noteId);
    if (trade && editor) {
      trade.notes = editor.value;
      saveTrades();
      render();
      toast("Journal notes updated");
    }
  }

  const zoomId = event.target.closest("[data-zoom]")?.dataset.zoom;
  if (zoomId) {
    const button = event.target.closest("[data-zoom]");
    const trade = state.trades.find((item) => item.id === zoomId);
    const src = trade?.screenshots[Number(button.dataset.shot)];
    if (src) {
      $("#lightboxImage").src = src;
      $("#imageLightbox").classList.remove("hidden");
    }
  }

  const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
  if (deleteId) {
    state.trades = state.trades.filter((trade) => trade.id !== deleteId);
    saveTrades();
    render();
    toast("Trade deleted");
  }
});

$("#searchInput").addEventListener("input", () => {
  renderTrades();
  renderHistory();
});

$("#csvFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const imported = parseCsv(await file.text());
  state.trades = [...state.trades, ...imported];
  saveTrades();
  render();
  toast(`${imported.length} trades imported`);
  event.target.value = "";
});

$("#tradeForm [name=tradeStructure]").addEventListener("change", toggleCustomStructure);

$("#tradeForm [name=screenshot]").addEventListener("change", async (event) => {
  state.pendingScreenshots = await screenshotsFromInput(event.target);
  renderScreenshotPreview();
  event.target.value = "";
});

$("#tradeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const screenshots = await screenshotsFromInput(event.currentTarget.elements.screenshot);
  const trade = formTradePayload(formData, screenshots);
  const existingIndex = state.trades.findIndex((item) => item.id === trade.id);
  if (existingIndex >= 0) {
    state.trades[existingIndex] = trade;
    toast("Trade updated");
  } else {
    state.trades.push(trade);
    toast("Trade saved");
  }
  saveTrades();
  clearForm();
  render();
  switchView("history");
});

$("#settingsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.settings = {
    ...state.settings,
    propFirmPassed: form.get("propFirmPassed") === "on"
  };
  saveSettings();
  render();
  toast("Settings saved");
});

renderTimeDropdowns();
renderStructureDropdown("IFVG");
clearForm();
saveTrades();
render();
