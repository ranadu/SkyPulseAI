import type { RiskLevel } from '../types';

/* ── Risk color tokens ─────────────────────────────────────────── */
export function riskHex(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#f43f5e';
    case 'high':     return '#fb923c';
    case 'medium':   return '#facc15';
    case 'low':      return '#22c55e';
  }
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'text-[#f43f5e]';
    case 'high':     return 'text-[#fb923c]';
    case 'medium':   return 'text-[#facc15]';
    case 'low':      return 'text-[#22c55e]';
  }
}

export function healthHex(score: number): string {
  if (score < 40) return '#f43f5e';
  if (score < 60) return '#fb923c';
  if (score < 80) return '#facc15';
  return '#22c55e';
}

/* ── Badge ──────────────────────────────────────────────────────── */
export function riskBadge(level: RiskLevel): string {
  const base = 'inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border';
  switch (level) {
    case 'critical': return `${base} bg-[rgba(244,63,94,0.12)] border-[#f43f5e]/40 text-[#f43f5e]`;
    case 'high':     return `${base} bg-[rgba(251,146,60,0.12)] border-[#fb923c]/40 text-[#fb923c]`;
    case 'medium':   return `${base} bg-[rgba(250,204,21,0.12)] border-[#facc15]/40 text-[#facc15]`;
    case 'low':      return `${base} bg-[rgba(34,197,94,0.12)] border-[#22c55e]/40 text-[#22c55e]`;
  }
}

/* ── Formatters ─────────────────────────────────────────────────── */
export function formatHours(hours: number): string {
  return hours.toLocaleString() + ' hrs';
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/* ── Segmented bar ──────────────────────────────────────────────── */
export function segmentColors(score: number, total = 20): string[] {
  const filled = Math.round((score / 100) * total);
  const color = healthHex(score);
  return Array.from({ length: total }, (_, i) => (i < filled ? color : '#1a2235'));
}
