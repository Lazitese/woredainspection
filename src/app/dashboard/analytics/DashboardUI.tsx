"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Monitor,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Tablet,
  BarChart3,
  Activity,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  ExternalLink,
  Minus,
} from "lucide-react";

// Country code → flag emoji
function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌍";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...upper.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

interface AnalyticsData {
  total_views: number;
  unique_visitors: number;
  bounce_rate: number;
  session_duration: string;
  views_change_pct: number;
  visitors_change_pct: number;
  bounce_change_pct: number;
  time_series: { date: string; views: number; unique: number }[];
  top_pages: { path: string; views: number }[];
  entry_pages: { path: string; views: number }[];
  exit_pages: { path: string; views: number }[];
  top_referrers: { referrer: string; views: number }[];
  devices: { device_type: string; views: number }[];
  locations: { country: string; country_code: string | null; views: number }[];
}

function DeltaBadge({ value, inverted = false }: { value: number; inverted?: boolean }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
        <Minus className="w-3 h-3" />
        0%
      </span>
    );
  }
  const isPositive = inverted ? value < 0 : value > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
        isPositive
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      }`}
    >
      {value > 0 ? (
        <ArrowUpRight className="w-3 h-3" />
      ) : (
        <ArrowDownRight className="w-3 h-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default function DashboardUI({
  initialData,
  currentRange,
}: {
  initialData: AnalyticsData;
  currentRange: string;
}) {
  const router = useRouter();
  const [chartMode, setChartMode] = useState<"views" | "unique">("views");
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [liveVisitors, setLiveVisitors] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/analytics/live");
        const data = await res.json();
        if (data && typeof data.live === "number") setLiveVisitors(data.live);
      } catch {
        /* silent */
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRangeChange = (value: string) => {
    router.push(`/dashboard/analytics?range=${value}`);
  };

  const chartData = useMemo(() => {
    if (!initialData.time_series) return [];
    return initialData.time_series.map((item) => {
      const dateObj = new Date(item.date);
      const label =
        currentRange === "24h"
          ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : dateObj.toLocaleDateString([], { month: "short", day: "numeric" });
      return { ...item, label };
    });
  }, [initialData.time_series, currentRange]);

  const rangeLabels: Record<string, string> = {
    "24h": "ዛሬ (Today)",
    "7d": "7 ቀናት (7 Days)",
    "30d": "30 ቀናት (30 Days)",
    "90d": "90 ቀናት (90 Days)",
  };

  const chartColor = chartMode === "views" ? "#3b82f6" : "#10b981";
  const chartKey = chartMode === "views" ? "views" : "unique";

  const getDeviceIcon = (type: string) => {
    if (type === "Mobile") return <Smartphone className="w-4 h-4 text-zinc-400" />;
    if (type === "Tablet") return <Tablet className="w-4 h-4 text-zinc-400" />;
    return <Monitor className="w-4 h-4 text-zinc-400" />;
  };

  const totalDeviceViews = (initialData.devices || []).reduce((s, d) => s + d.views, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            ትንታኔ <span className="text-zinc-400 dark:text-zinc-500 font-normal text-lg ml-1">Analytics</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {liveVisitors} <span className="text-zinc-400 dark:text-zinc-500 font-normal">live</span>
            </span>
          </div>

          <Select value={currentRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[170px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/50 rounded-lg h-9 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
              <SelectItem value="24h">ዛሬ (Today)</SelectItem>
              <SelectItem value="7d">7 ቀናት (7 Days)</SelectItem>
              <SelectItem value="30d">30 ቀናት (30 Days)</SelectItem>
              <SelectItem value="90d">90 ቀናት (90 Days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ልዩ ጎብኚዎች"
          sublabel="Unique Visitors"
          value={initialData.unique_visitors.toLocaleString()}
          delta={initialData.visitors_change_pct}
          icon={<Users className="w-4 h-4" />}
          color="emerald"
        />
        <StatCard
          label="የገጽ ዕይታዎች"
          sublabel="Page Views"
          value={initialData.total_views.toLocaleString()}
          delta={initialData.views_change_pct}
          icon={<Eye className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          label="የመመለስ መጠን"
          sublabel="Bounce Rate"
          value={`${initialData.bounce_rate}%`}
          delta={initialData.bounce_change_pct}
          inverted
          icon={<MousePointerClick className="w-4 h-4" />}
          color="amber"
        />
        <StatCard
          label="የቆይታ ጊዜ"
          sublabel="Avg. Duration"
          value={initialData.session_duration || "0m 0s"}
          icon={<Clock className="w-4 h-4" />}
          color="purple"
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setChartMode("views")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartMode === "views"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              ዕይታዎች (Views)
            </button>
            <button
              onClick={() => setChartMode("unique")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartMode === "unique"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              ጎብኚዎች (Visitors)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded-md transition-all ${
                chartType === "area"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-md transition-all ${
                chartType === "bar"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={chartData.length > 30 ? 6 : 20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-zinc-100, #f4f4f5)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    dy={8}
                    minTickGap={30}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    content={({ active, payload, label }) => {
                      if (active && payload?.[0]) {
                        return (
                          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-lg shadow-lg text-sm">
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{payload[0].payload.date ? new Date(payload[0].payload.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : label}</p>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {(payload[0].value as number).toLocaleString()}{" "}
                              <span className="font-normal text-zinc-400 text-xs">
                                {chartMode === "views" ? "views" : "visitors"}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey={chartKey} fill={chartColor} opacity={0.85} radius={[3, 3, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-zinc-100, #f4f4f5)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    dy={8}
                    minTickGap={30}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ stroke: "#d4d4d8", strokeWidth: 1, strokeDasharray: "4 4" }}
                    content={({ active, payload, label }) => {
                      if (active && payload?.[0]) {
                        return (
                          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-lg shadow-lg text-sm">
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{payload[0].payload.date ? new Date(payload[0].payload.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : label}</p>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {(payload[0].value as number).toLocaleString()}{" "}
                              <span className="font-normal text-zinc-400 text-xs">
                                {chartMode === "views" ? "views" : "visitors"}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartKey}
                    stroke={chartColor}
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: chartColor }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Pages */}
        <ListCard title="ገጾች (Pages)" icon={<FileText className="w-4 h-4 text-zinc-400" />}>
          {(initialData.top_pages || []).length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(initialData.top_pages || []).map((item, i) => (
                <ListRow key={i} label={item.path || "/"} value={item.views} max={initialData.top_pages[0]?.views || 1} color="bg-blue-500" />
              ))}
            </ul>
          )}
        </ListCard>

        {/* Referrers */}
        <ListCard title="አቅጣጫ ጠቋሚዎች (Referrers)" icon={<ExternalLink className="w-4 h-4 text-zinc-400" />}>
          {(initialData.top_referrers || []).length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(initialData.top_referrers || []).map((item, i) => {
                let displayRef = item.referrer;
                try {
                  const url = new URL(item.referrer);
                  displayRef = url.hostname.replace("www.", "");
                } catch { /* use raw */ }
                return (
                  <ListRow key={i} label={displayRef} value={item.views} max={initialData.top_referrers[0]?.views || 1} color="bg-indigo-500" />
                );
              })}
            </ul>
          )}
        </ListCard>

        {/* Countries */}
        <ListCard title="ሀገራት (Countries)" icon={<Globe className="w-4 h-4 text-zinc-400" />}>
          {(initialData.locations || []).length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(initialData.locations || [])
                .filter((l) => l.country !== "Localhost")
                .map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{countryFlag(item.country_code)}</span>
                      <span className="text-zinc-700 dark:text-zinc-300">{item.country}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {item.views.toLocaleString()}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </ListCard>

        {/* Devices */}
        <ListCard title="መሳሪያዎች (Devices)" icon={<Monitor className="w-4 h-4 text-zinc-400" />}>
          {(initialData.devices || []).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-4 space-y-4">
              {(initialData.devices || []).map((item, i) => {
                const pct = totalDeviceViews > 0 ? ((item.views / totalDeviceViews) * 100).toFixed(1) : "0";
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(item.device_type)}
                        <span className="text-zinc-700 dark:text-zinc-300">{item.device_type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-xs">{pct}%</span>
                        <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums w-12 text-right">
                          {item.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ListCard>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  label,
  sublabel,
  value,
  delta,
  inverted = false,
  icon,
  color,
}: {
  label: string;
  sublabel: string;
  value: string;
  delta?: number;
  inverted?: boolean;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "amber" | "purple";
}) {
  const colorMap = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
        {delta !== undefined && <DeltaBadge value={delta} inverted={inverted} />}
      </div>
      <div>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {label} <span className="text-zinc-400 dark:text-zinc-500">· {sublabel}</span>
        </p>
      </div>
    </div>
  );
}

function ListCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto max-h-[320px]">{children}</div>
    </div>
  );
}

function ListRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max((value / max) * 100, 2);
  return (
    <li className="relative px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center justify-between relative z-10">
        <span className="text-zinc-700 dark:text-zinc-300 truncate pr-4 max-w-[75%]">{label}</span>
        <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {value.toLocaleString()}
        </span>
      </div>
      <div className="absolute inset-y-0 left-0 z-0 opacity-[0.06]" style={{ width: `${pct}%` }}>
        <div className={`h-full ${color}`} />
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-zinc-400 dark:text-zinc-500">
      ምንም መረጃ የለም (No data)
    </div>
  );
}
