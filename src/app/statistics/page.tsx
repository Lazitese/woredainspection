"use client";

import { Menubar } from "@/components/menubar";
import { Footer } from "@/components/footer";
import { ChevronRight, Users, Building2, Network, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useWoreda } from "@/providers/woreda-provider";
import { WOREDAS_LIST } from "@/config/woredas";

/* ─── Woreda Data from Config ─── */

interface RegionRow {
  id: number;
  slug: string;
  name: string;
  leaderName: string;
  unions: number;
  families: number;
  members: number;
}

const regionalData: RegionRow[] = WOREDAS_LIST.map((w) => ({
  id: w.number,
  slug: w.slug,
  name: w.name,
  leaderName: w.leaderName || `${w.name} ዋና አስተዳዳሪ`,
  unions: w.stats.unions,
  families: w.stats.families,
  members: w.stats.members,
}));

const totals = {
  woredas: regionalData.length,
  unions: regionalData.reduce((s, r) => s + r.unions, 0),
  families: regionalData.reduce((s, r) => s + r.families, 0),
  members: regionalData.reduce((s, r) => s + r.members, 0),
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/* ─── Animated Counter (simple CSS approach) ─── */
function AnimatedValue({ value }: { value: number }) {
  return <span className="tabular-nums">{formatNumber(value)}</span>;
}

/* ─── CSS-only horizontal bar ─── */
function HorizontalBar({ value, max, color, label, isActive }: { value: number; max: number; color: string; label: string; isActive?: boolean }) {
  const pct = Math.max((value / max) * 100, 1);
  return (
    <div className={`group flex items-center gap-4 rounded-xl px-2 py-1 transition-colors ${isActive ? "bg-blue-50/80 ring-1 ring-[#014BAA]/20" : ""}`}>
      <span className={`w-24 shrink-0 text-right text-sm font-semibold ${isActive ? "text-[#014BAA] font-bold" : "text-slate-700"}`}>{label}</span>
      <div className="relative flex-1 h-8 rounded-xl bg-slate-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-xl transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, backgroundColor: isActive ? "#014BAA" : color }}
        />
        <span className={`absolute inset-y-0 right-3 flex items-center text-xs font-bold ${pct > 70 ? "text-white" : "text-slate-600"}`}>
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}

/* ─── Donut slice (CSS conic) ─── */
function DonutChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const start = cumulative;
    cumulative += (d.value / total) * 360;
    return { ...d, start, end: cumulative, color: colors[i % colors.length] };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <div
        className="relative size-48 shrink-0 rounded-full shadow-inner"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white shadow-sm">
          <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatNumber(total)}</span>
          <span className="text-[0.65rem] font-semibold text-slate-400 tracking-wide">ጠቅላላ</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="block size-3 rounded-full" style={{ backgroundColor: s.color }} />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700">{s.label}</span>
              <span className="text-[0.65rem] text-slate-400 tabular-nums">{formatNumber(s.value)} ({((s.value / total) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function StatisticsPage() {
  const { woreda } = useWoreda();
  const [activeMetric, setActiveMetric] = useState<"members" | "families" | "unions">("members");

  const summaryCards = [
    { label: "የአባል ብዛት", labelEn: `${woreda.name} — የአባል ብዛት`, value: woreda.stats.members, icon: Users, color: "#014BAA" },
    { label: "የቤተሰብ ብዛት", labelEn: `${woreda.name} — የቤተሰብ ብዛት`, value: woreda.stats.families, icon: Building2, color: "#10B981" },
    { label: "የህብረት ብዛት", labelEn: `${woreda.name} — የህብረት ብዛት`, value: woreda.stats.unions, icon: Network, color: "#FFB800" },
  ];

  const maxMembers = Math.max(...regionalData.map((r) => r.members));
  const maxFamilies = Math.max(...regionalData.map((r) => r.families));
  const maxUnions = Math.max(...regionalData.map((r) => r.unions));

  const metricConfig = {
    members: { max: maxMembers, key: "members" as const, label: "የአባል ብዛት", color: "#014BAA" },
    families: { max: maxFamilies, key: "families" as const, label: "የቤተሰብ ብዛት", color: "#10B981" },
    unions: { max: maxUnions, key: "unions" as const, label: "የህብረት ብዛት", color: "#FFB800" },
  };

  const config = metricConfig[activeMetric];

  // Top 5 regions by members
  const top5 = [...regionalData].sort((a, b) => b.members - a.members).slice(0, 5);

  const donutColors = ["#014BAA", "#FFB800", "#10B981", "#8B5CF6", "#F43F5E", "#06B6D4", "#F59E0B", "#6366F1", "#EC4899", "#14B8A6", "#EF4444", "#3B82F6", "#A855F7", "#78716C"];

  return (
    <>
      <Menubar />
      <main className="min-h-screen bg-white pt-24 pb-20">

        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden bg-slate-50 py-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(#014BAA 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          <div className="container-site relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-white text-[#014BAA] shadow-sm ring-1 ring-slate-200/60">
              <BarChart3 className="size-8" />
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              <span style={{ color: "#014BAA" }}>የ{woreda.name} መረጃ</span>
            </h1>
            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>መነሻ</span>
              <ChevronRight className="size-4" />
              <span style={{ color: "#014BAA" }}>መረጃ ({woreda.name})</span>
            </div>

          </div>
        </section>



        {/* ═══ Summary Cards (1st Section for Active Woreda) ═══ */}
        <section className="container-site -mt-12 relative z-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)]"
                >
                  <div className="absolute -right-6 -top-6 size-24 rounded-full opacity-[0.06]" style={{ backgroundColor: card.color }} />
                  <div className="flex size-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${card.color}10`, color: card.color }}>
                    <Icon className="size-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold tracking-tight text-slate-900">
                      <AnimatedValue value={card.value} />
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{card.label}</p>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-300">{card.labelEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ═══ Bar Chart: Regional Comparison ═══ */}
        <section className="container-site mt-16 lg:mt-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                የወረዳ ንጽጽር
              </h2>
              <p className="mt-1 text-sm text-slate-500">በመለኪያ የወረዳ ንጽጽር ({config.label})</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["members", "families", "unions"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeMetric === m
                      ? "bg-[#014BAA] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {metricConfig[m].label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100 sm:p-8">
            <div className="flex flex-col gap-3">
              {[...regionalData].sort((a, b) => b[config.key] - a[config.key]).map((r) => (
                <HorizontalBar
                  key={r.id}
                  label={r.name}
                  value={r[config.key]}
                  max={config.max}
                  color={config.color}
                  isActive={r.slug === woreda.slug}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Donut + Top 5 Side-by-Side ═══ */}
        <section className="container-site mt-16 lg:mt-24">
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Donut */}
            <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100 sm:p-8">
              <h3 className="font-heading text-xl font-bold text-slate-900">የኮሚሽን አባላት ስርጭት</h3>
              <p className="mb-6 text-sm text-slate-500">በወረዳ የኮሚሽን አባላት ስርጭት</p>
              <DonutChart
                data={regionalData.map((r) => ({ label: r.name, value: r.members }))}
                colors={donutColors}
              />
            </div>

            {/* Top 5 */}
            <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100 sm:p-8">
              <h3 className="font-heading text-xl font-bold text-slate-900">ከፍተኛ 5 ወረዳዎች</h3>
              <p className="mb-6 text-sm text-slate-500">በኮሚሽን አባላት ብዛት ከፍተኛ 5 ወረዳዎች</p>
              <div className="flex flex-col gap-5">
                {top5.map((r, i) => {
                  const pct = (r.members / totals.members) * 100;
                  const medal = ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;
                  return (
                    <div key={r.id} className="flex items-center gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
                        {medal}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-bold text-slate-900">{r.name}</span>
                          <span className="text-xs font-bold text-slate-400 tabular-nums">{formatNumber(r.members)}</span>
                        </div>
                        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: donutColors[i] }}
                          />
                        </div>
                      </div>
                      <span className="w-12 text-right text-xs font-bold tabular-nums" style={{ color: donutColors[i] }}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ═══ Full Data Table ═══ */}
        <section className="container-site mt-16 lg:mt-24">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              የኮሚሽኑ ዝርዝር ሰንጠረዥ
            </h2>
            <p className="mt-1 text-sm text-slate-500">ዝርዝር የወረዳ ማጠቃለያ</p>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)]">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-4 text-left font-bold text-slate-500 text-xs tracking-wider uppercase">ተ.ቁ</th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 text-xs tracking-wider uppercase">ቅ/ጽ/ቤት (ወረዳ)</th>
                  <th className="px-4 py-4 text-right font-bold text-slate-500 text-xs tracking-wider uppercase">የህብረት ብዛት</th>
                  <th className="px-4 py-4 text-right font-bold text-slate-500 text-xs tracking-wider uppercase">የቤተሰብ ብዛት</th>
                  <th className="px-4 py-4 text-right font-bold text-slate-500 text-xs tracking-wider uppercase">የአባል ብዛት</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((r, i) => {
                  const isCurrent = r.slug === woreda.slug;
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-slate-50 transition-colors hover:bg-blue-50/40 ${
                        isCurrent ? "bg-blue-50/70 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-400 tabular-nums">{r.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        {r.name}
                        {isCurrent && (
                          <span className="ml-2 rounded-full bg-[#014BAA]/10 px-2 py-0.5 text-[0.65rem] font-bold text-[#014BAA]">
                            የአሁኑ ወረዳ
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600 tabular-nums">{formatNumber(r.unions)}</td>
                      <td className="px-4 py-3.5 text-right text-slate-600 tabular-nums">{formatNumber(r.families)}</td>
                      <td className="px-4 py-3.5 text-right font-bold tabular-nums" style={{ color: "#014BAA" }}>{formatNumber(r.members)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4 font-bold text-slate-900">ጠቅላላ ድምር</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 tabular-nums">{formatNumber(totals.unions)}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 tabular-nums">{formatNumber(totals.families)}</td>
                  <td className="px-4 py-4 text-right font-bold tabular-nums" style={{ color: "#014BAA" }}>{formatNumber(totals.members)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
