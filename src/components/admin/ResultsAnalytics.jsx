import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { getGrade } from '../../utils/scoring';
import { useTheme } from '../../context/ThemeContext';

const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#94a3b8'];
const SEMANTIC = { pass: '#10b981', fail: '#f43f5e' };
const GRADE_COLORS = {
  A1: '#10b981', A2: '#34d399', B1: '#06b6d4', B2: '#22d3ee',
  C1: '#f59e0b', C2: '#fbbf24', D: '#fb923c', E: '#f43f5e', '-': '#94a3b8',
};
const GRADE_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E'];

const CHART_TYPES = ['bar', 'line', 'area', 'donut', 'pie'];

const useChartTheme = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return {
    dark,
    grid: dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
    tick: dark ? '#9ca3af' : '#6b7280',
    axis: dark ? 'rgba(255,255,255,0.6)' : '#374151',
    tooltipBg: dark ? '#1e1e38' : '#ffffff',
    tooltipBorder: dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
    tooltipText: dark ? '#ffffff' : '#111827',
  };
};

const buildDatasets = (rows) => {
  const histogram = Array.from({ length: 10 }, (_, i) => ({
    name: i === 9 ? '90-100' : `${i * 10}-${i * 10 + 9}`,
    value: 0,
  }));
  const grades = GRADE_ORDER.map((g) => ({ name: g, value: 0 }));
  const passfail = [
    { name: 'Pass', value: 0, fill: SEMANTIC.pass },
    { name: 'Fail', value: 0, fill: SEMANTIC.fail },
  ];
  const byDay = new Map();
  const bySubject = new Map();
  const byType = new Map();

  rows.forEach((r) => {
    const p = Number.isFinite(r.percentage) ? r.percentage : 0;
    const clamped = Math.max(0, Math.min(100, p));
    histogram[Math.min(9, Math.floor(clamped / 10))].value += 1;

    const g = getGrade(clamped.toFixed(2));
    const gi = GRADE_ORDER.indexOf(g);
    if (gi !== -1) grades[gi].value += 1;

    (clamped >= 40 ? passfail[0] : passfail[1]).value += 1;

    const date = r.timestamp instanceof Date ? r.timestamp : new Date(0);
    const day = date.toDateString();
    byDay.set(day, (byDay.get(day) || 0) + 1);

    const subj = r.subject || 'Unknown';
    const cur = bySubject.get(subj) || { sum: 0, n: 0 };
    cur.sum += clamped;
    cur.n += 1;
    bySubject.set(subj, cur);

    const t = r.type === 'coding' ? 'Coding' : r.type === 'project' ? 'Project' : 'MCQ';
    byType.set(t, (byType.get(t) || 0) + 1);
  });

  const overtime = [...byDay.entries()]
    .map(([d, value]) => ({ name: d.slice(4, 10), value }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const subjects = [...bySubject.entries()]
    .map(([name, { sum, n }]) => ({ name, value: Math.round((sum / n) * 10) / 10 }))
    .sort((a, b) => b.value - a.value);
  const formats = [...byType.entries()].map(([name, value]) => ({ name, value }));

  return { histogram, grades, passfail, overtime, subjects, formats };
};

function ChartSwitcher({ value, options, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg shrink-0">
      {options.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
            value === t
              ? 'bg-primary text-white shadow'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit, ctx }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg border"
      style={{ background: ctx.tooltipBg, borderColor: ctx.tooltipBorder, color: ctx.tooltipText }}
    >
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color || entry.payload?.fill || entry.stroke || PALETTE[i % PALETTE.length] }} />
          <span className="font-semibold">{entry.value}</span>{unit}
        </p>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, xLabel, yLabel, types, value, onChange, empty, ctx, children }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          {(xLabel || yLabel) && !empty && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {xLabel && <span>X: {xLabel}</span>}
              {yLabel && <span className="ml-2">Y: {yLabel}</span>}
            </p>
          )}
        </div>
        <ChartSwitcher value={value} options={types} onChange={onChange} />
      </div>
      {empty ? (
        <div className="flex items-center justify-center py-14 text-sm text-gray-400 dark:text-gray-500">
          No data — adjust your filters
        </div>
      ) : (
        <div style={{ height: 260 }}>{children}</div>
      )}
    </div>
  );
}

export default function ResultsAnalytics({ rows }) {
  const ctx = useChartTheme();
  const [types, setTypes] = useState({
    histogram: 'bar',
    grades: 'bar',
    passfail: 'donut',
    overtime: 'area',
    subjects: 'bar',
    formats: 'donut',
  });
  const set = (key) => (value) => setTypes((t) => ({ ...t, [key]: value }));

  const data = useMemo(() => buildDatasets(rows || []), [rows]);
  const isEmpty = (arr) => !arr.length || arr.every((d) => !d.value);
  const empty = {
    histogram: isEmpty(data.histogram),
    grades: isEmpty(data.grades),
    passfail: isEmpty(data.passfail),
    overtime: data.overtime.length === 0,
    subjects: data.subjects.length === 0,
    formats: isEmpty(data.formats),
  };

  const colorFns = {
    histogram: (_, i) => PALETTE[i % PALETTE.length],
    grades: (d) => GRADE_COLORS[d.name] || PALETTE[0],
    passfail: (d) => d.fill || PALETTE[0],
    overtime: () => PALETTE[0],
    subjects: (_, i) => PALETTE[i % PALETTE.length],
    formats: (_, i) => PALETTE[i % PALETTE.length],
  };

  const renderChart = (type, cfg) => {
    const { data: series, xLabel, yLabel, unit = '', allowDecimals = false, tickGap = 0 } = cfg;
    const { x, y } = (() => ({
      x: {
        dataKey: 'name',
        stroke: ctx.grid,
        tick: { fill: ctx.tick, fontSize: 11 },
        interval: tickGap,
        label: xLabel ? { value: xLabel, position: 'insideBottom', offset: -2, fill: ctx.axis, fontSize: 11 } : undefined,
      },
      y: {
        stroke: ctx.grid,
        tick: { fill: ctx.tick, fontSize: 11 },
        allowDecimals,
        label: yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 0, fill: ctx.axis, fontSize: 11 } : undefined,
      },
    }))();

    const tooltip = <Tooltip content={<ChartTooltip ctx={ctx} unit={unit} />} />;

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ctx.grid} vertical={false} />
            <XAxis {...x} />
            <YAxis {...y} />
            {tooltip}
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {series.map((d, i) => (
                <Cell key={i} fill={colorFns[cfg.kind](d, i)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ctx.grid} vertical={false} />
            <XAxis {...x} />
            <YAxis {...y} />
            {tooltip}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colorFns[cfg.kind](series[0], 0)}
              strokeWidth={2.5}
              dot={{ r: 3, fill: colorFns[cfg.kind](series[0], 0) }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'area') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ctx.grid} vertical={false} />
            <XAxis {...x} />
            <YAxis {...y} />
            {tooltip}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorFns[cfg.kind](series[0], 0)}
              strokeWidth={2.5}
              fill={colorFns[cfg.kind](series[0], 0)}
              fillOpacity={0.15}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    const innerRadius = type === 'donut' ? '45%' : 0;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          {tooltip}
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Pie
            data={series}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius="80%"
            paddingAngle={2}
            stroke="none"
          >
            {series.map((d, i) => (
              <Cell key={i} fill={colorFns[cfg.kind](d, i)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const base = (kind) => ({ kind, colorFns, ctx });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Color codes</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded-full" style={{ background: SEMANTIC.pass }} />Pass (≥40%)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded-full" style={{ background: SEMANTIC.fail }} />Fail (&lt;40%)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded-full" style={{ background: PALETTE[0] }} />Others use the palette
          </span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{rows?.length || 0} submissions analysed</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ChartCard
          title="Score distribution"
          subtitle="How submissions are spread across score ranges"
          xLabel="Percentage range (%)"
          yLabel="Submissions"
          types={['bar', 'line', 'area']}
          value={types.histogram}
          onChange={set('histogram')}
          empty={empty.histogram}
          ctx={ctx}
        >
          {renderChart(types.histogram, { ...base('histogram'), data: data.histogram, xLabel: 'Percentage range (%)', yLabel: 'Submissions'})}
        </ChartCard>

        <ChartCard
          title="Grade distribution"
          xLabel="Grade"
          yLabel="Submissions"
          types={['bar', 'donut', 'pie']}
          value={types.grades}
          onChange={set('grades')}
          empty={empty.grades}
          ctx={ctx}
        >
          {renderChart(types.grades, { ...base('grades'), data: data.grades, xLabel: 'Grade', yLabel: 'Submissions'})}
        </ChartCard>

        <ChartCard
          title="Pass / Fail"
          subtitle="Passing score is ≥40%"
          xLabel="Result"
          yLabel="Submissions"
          types={['donut', 'pie', 'bar']}
          value={types.passfail}
          onChange={set('passfail')}
          empty={empty.passfail}
          ctx={ctx}
        >
          {renderChart(types.passfail, { ...base('passfail'), data: data.passfail, xLabel: 'Result', yLabel: 'Submissions' })}
        </ChartCard>

        <ChartCard
          title="Submissions over time"
          subtitle="Number of submissions per day"
          xLabel="Date"
          yLabel="Submissions"
          types={['area', 'line', 'bar']}
          value={types.overtime}
          onChange={set('overtime')}
          empty={empty.overtime}
          ctx={ctx}
        >
          {renderChart(types.overtime, { ...base('overtime'), data: data.overtime, xLabel: 'Date', yLabel: 'Submissions', tickGap: 'preserveStartEnd' })}
        </ChartCard>

        <ChartCard
          title="Average score by subject"
          subtitle="Mean percentage per subject"
          xLabel="Subject"
          yLabel="Average %"
          types={['bar', 'donut', 'pie']}
          value={types.subjects}
          onChange={set('subjects')}
          empty={empty.subjects}
          ctx={ctx}
        >
          {renderChart(types.subjects, { ...base('subjects'), data: data.subjects, xLabel: 'Subject', yLabel: 'Average %', allowDecimals: true, unit: '%' })}
        </ChartCard>

        <ChartCard
          title="Format mix"
          subtitle="MCQ vs Coding vs Project"
          xLabel="Format"
          yLabel="Submissions"
          types={['donut', 'pie', 'bar']}
          value={types.formats}
          onChange={set('formats')}
          empty={empty.formats}
          ctx={ctx}
        >
          {renderChart(types.formats, { ...base('formats'), data: data.formats, xLabel: 'Format', yLabel: 'Submissions', })}
        </ChartCard>
      </div>
    </div>
  );
}