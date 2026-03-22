'use client';

import { useState } from 'react';

const mockDecisions = [
  { title: 'Switch to PostgreSQL', status: 'validated', owner: 'Sarah K.', confidence: 'high', tags: ['database', 'infrastructure'] },
  { title: 'Redesign onboarding flow', status: 'active', owner: 'Marcus T.', confidence: 'medium', tags: ['ux', 'growth'] },
  { title: 'Implement rate limiting', status: 'reviewing', owner: 'Priya M.', confidence: 'high', tags: ['security'] },
  { title: 'Add dark mode support', status: 'inconclusive', owner: 'James L.', confidence: 'low', tags: ['ux'] },
];

const statusColors: Record<string, string> = {
  active: 'bg-blue-500/20 text-blue-400',
  reviewing: 'bg-amber-500/20 text-amber-400',
  validated: 'bg-emerald-500/20 text-emerald-400',
  invalidated: 'bg-red-500/20 text-red-400',
  inconclusive: 'bg-zinc-500/20 text-zinc-400',
};

const confidenceColors: Record<string, string> = {
  high: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-red-500/20 text-red-400',
};

export function DecisionLogMockup() {
  const [selected] = useState(0);

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 rounded bg-zinc-800 text-xs text-zinc-400">
            decision-dna.app/acme/decisions
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-zinc-800 p-3 space-y-1">
          <div className="text-xs text-zinc-500 uppercase tracking-wide px-2 py-1">Decisions</div>
          {mockDecisions.map((d, i) => (
            <div
              key={d.title}
              className={`px-2 py-2 rounded text-xs cursor-pointer ${i === selected ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <div className="truncate font-medium">{d.title}</div>
              <div className="text-[10px] mt-0.5">{d.owner}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Title</div>
              <div className="text-sm font-semibold text-white">{mockDecisions[selected].title}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Status</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${statusColors[mockDecisions[selected].status]}`}>
                  {mockDecisions[selected].status}
                </span>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Confidence</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${confidenceColors[mockDecisions[selected].confidence]}`}>
                  {mockDecisions[selected].confidence}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Problem Statement</div>
              <div className="text-xs text-zinc-300 bg-zinc-800/50 rounded p-2">
                We need a more reliable database that handles our growing transaction volume while maintaining ACID compliance.
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Options Considered</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-zinc-300">PostgreSQL <span className="text-emerald-400">(chosen)</span></span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span className="text-zinc-400">MySQL</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span className="text-zinc-400">MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OutcomeTrackingMockup() {
  const stats = [
    { label: 'Total Decisions', value: '47', change: '+12%' },
    { label: 'Validated', value: '68%', change: '+5%' },
    { label: 'This Month', value: '8', change: '+3' },
  ];

  const recentOutcomes = [
    { title: 'Switch to PostgreSQL', status: 'validated', date: 'Mar 15', result: 'Query times improved by 40%' },
    { title: 'Add dark mode', status: 'inconclusive', date: 'Mar 10', result: 'User engagement unchanged' },
    { title: 'Rate limiting API', status: 'validated', date: 'Mar 5', result: 'Reduced abuse by 95%' },
  ];

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 rounded bg-zinc-800 text-xs text-zinc-400">
            decision-dna.app/acme/dashboard
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide">{stat.label}</div>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-lg font-bold text-white">{stat.value}</span>
                  <span className="text-[10px] text-emerald-400">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">Recent Outcomes</div>
            <div className="space-y-2">
              {recentOutcomes.map((outcome) => (
                <div key={outcome.title} className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white truncate">{outcome.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${outcome.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                      {outcome.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{outcome.result}</div>
                  <div className="text-[9px] text-zinc-500 mt-1">{outcome.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DecisionGraphMockup() {
  const nodes = [
    { id: 1, label: 'Microservices', x: 50, y: 50, color: '#3b82f6' },
    { id: 2, label: 'Auth Service', x: 20, y: 25, color: '#22c55e' },
    { id: 3, label: 'API Gateway', x: 80, y: 25, color: '#f59e0b' },
    { id: 4, label: 'User Service', x: 30, y: 75, color: '#3b82f6' },
    { id: 5, label: 'Order Service', x: 70, y: 75, color: '#3b82f6' },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
  ];

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 relative">
      <div className="absolute top-2 left-2 px-2 py-1 bg-zinc-800 rounded text-[9px] text-zinc-400">
        Decision Graph
      </div>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from)!;
          const to = nodes.find(n => n.id === edge.to)!;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#334155"
              strokeWidth="0.5"
            />
          );
        })}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="6" fill={node.color} opacity="0.8" />
            <text
              x={node.x}
              y={node.y + 12}
              textAnchor="middle"
              className="text-[4px] fill-zinc-400"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-2 left-2 flex gap-3 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-zinc-500">Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-500">Validated</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-zinc-500">Reviewing</span>
        </div>
      </div>
    </div>
  );
}
