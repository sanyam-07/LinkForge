import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

export const ClicksTimeChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" className="dark:stroke-zinc-800" opacity={0.6} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />
          <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionPieChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-400 dark:text-zinc-500">
        No distribution data yet
      </div>
    );
  }

  return (
    <div className="h-56 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-slate-600 dark:text-zinc-400">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>
              {item.name}: <strong className="text-slate-900 dark:text-white">{item.percentage}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DistributionBarChart = ({ data = [], color = '#8b5cf6' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-400 dark:text-zinc-500">
        No breakdown data available
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" className="dark:stroke-zinc-800" opacity={0.6} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default { ClicksTimeChart, DistributionPieChart, DistributionBarChart };
