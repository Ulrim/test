'use client';

import { useState } from 'react';
import { mockTanks, generateChartData } from '@/lib/mockData';
import { CultivationTank } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WATER_PARAMS = [
  { key: 'temperature', label: '수온', unit: '°C', ok: (v: number) => v <= 26, warn: 28 },
  { key: 'pH',          label: 'pH',   unit: '',   ok: (v: number) => v >= 6.8 && v <= 7.8 },
  { key: 'dissolvedOxygen', label: '용존산소', unit: 'mg/L', ok: (v: number) => v >= 6.5 },
  { key: 'ammonia',     label: '암모니아', unit: 'mg/L', ok: (v: number) => v <= 0.1 },
  { key: 'turbidity',   label: '탁도', unit: 'NTU', ok: (v: number) => v <= 25 },
];

export default function CultivationPage() {
  const [selected, setSelected] = useState<CultivationTank>(mockTanks[0]);
  const chartData = generateChartData(selected.id, 12);
  const counts = {
    normal:  mockTanks.filter(t => t.status === 'normal').length,
    caution: mockTanks.filter(t => t.status === 'caution').length,
    warning: mockTanks.filter(t => t.status === 'warning').length,
  };

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>배양 모니터링</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>모이나 배양조 수질 및 개체 밀도 실시간 모니터링</p>
      </div>

      {/* 상태 요약 칩 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: '정상', count: counts.normal,  color: 'var(--success)', bg: 'var(--success-bg)' },
          { label: '주의', count: counts.caution, color: 'var(--warning)', bg: 'var(--warning-bg)' },
          { label: '경고', count: counts.warning, color: 'var(--danger)',  bg: 'var(--danger-bg)' },
        ].map(s => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999,
            background: s.bg,
            border: `1px solid ${s.color}30`,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, display: 'block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label} {s.count}조</span>
          </div>
        ))}
      </div>

      {/* 배양조 선택 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {mockTanks.map(tank => {
          const isSelected = selected.id === tank.id;
          const barColor = tank.status === 'normal' ? 'var(--success)' : tank.status === 'caution' ? 'var(--warning)' : 'var(--danger)';
          const pct = Math.min(100, (tank.density / tank.targetDensity) * 100);

          return (
            <button
              key={tank.id}
              onClick={() => setSelected(tank)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 'var(--r-lg)',
                border: isSelected ? `2px solid var(--mint)` : `1px solid var(--border)`,
                background: isSelected ? 'var(--mint-light)' : 'var(--surface)',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 0 3px rgba(11,184,154,0.1)' : 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{tank.name}</span>
                <StatusBadge variant={tank.status} size="sm" dot />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                {tank.volume.toLocaleString()}ℓ · 접종 {tank.daysSinceInoculation}일차
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>밀도</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-2)' }}>
                  {tank.density.toLocaleString()} <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>/ {tank.targetDensity.toLocaleString()}</span>
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택 조 상세 */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{selected.name} 상세</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>최종 업데이트: {selected.lastUpdated.slice(11, 16)}</div>
          </div>
          <StatusBadge variant={selected.status} dot />
        </div>

        {/* 수질 파라미터 카드 5개 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
          {WATER_PARAMS.map(p => {
            const val = selected.water[p.key as keyof typeof selected.water] as number;
            const isOk = p.ok(val);
            return (
              <div key={p.key} style={{
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: isOk ? 'var(--bg)' : 'var(--danger-bg)',
                border: `1px solid ${isOk ? 'var(--border)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, fontWeight: 500 }}>{p.label}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: isOk ? 'var(--text-1)' : 'var(--danger)',
                  lineHeight: 1.2,
                }}>
                  {val}
                  <span style={{ fontSize: 11, fontWeight: 400, color: isOk ? 'var(--text-3)' : 'var(--danger)', marginLeft: 2 }}>{p.unit}</span>
                </div>
                <div style={{ fontSize: 10, color: isOk ? 'var(--success)' : 'var(--danger)', marginTop: 4, fontWeight: 600 }}>
                  {isOk ? '정상 범위' : '⚠ 범위 초과'}
                </div>
              </div>
            );
          })}
        </div>

        {/* 차트 2열 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              수온 / 용존산소 (12시간)
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={chartData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis yAxisId="t" tick={{ fontSize: 9, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <YAxis yAxisId="d" orientation="right" tick={{ fontSize: 9, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="t" dataKey="temperature" stroke="#F97316" strokeWidth={2} dot={false} name="수온(°C)" />
                <Line yAxisId="d" dataKey="dissolvedOxygen" stroke="var(--mint)" strokeWidth={2} dot={false} name="DO(mg/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              pH / 암모니아 (12시간)
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={chartData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis yAxisId="p" tick={{ fontSize: 9, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <YAxis yAxisId="a" orientation="right" tick={{ fontSize: 9, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="p" dataKey="pH" stroke="var(--info)" strokeWidth={2} dot={false} name="pH" />
                <Line yAxisId="a" dataKey="ammonia" stroke="var(--danger)" strokeWidth={2} dot={false} name="암모니아(mg/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
