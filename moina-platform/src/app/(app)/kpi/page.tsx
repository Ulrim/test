'use client';

import { mockKpiTargets } from '@/lib/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiPage() {
  const radarData = mockKpiTargets.map(k => ({
    subject: k.label,
    '달성': Math.round((k.actual / k.target2026) * 100),
    '목표': 100,
  }));

  const year = 2026;

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>KPI 달성 현황</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>민간투자기반 유망기업 사업화 지원사업 핵심 성과 지표 · {year}년 기준</p>
      </div>

      {/* KPI 카드 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {mockKpiTargets.map(k => {
          const pct = Math.min(100, Math.round((k.actual / k.target2026) * 100));
          const barColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
          const isGood = pct >= 70;

          return (
            <div key={k.label} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>단위: {k.unit}</div>
                </div>
                {isGood
                  ? <TrendingUp size={18} color="var(--success)" />
                  : <TrendingDown size={18} color="var(--danger)" />}
              </div>

              {/* 큰 숫자 */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                  {k.actual}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{k.unit}</span>
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: barColor,
                }}>{pct}%</span>
              </div>

              {/* 진행 바 */}
              <div className="progress-track" style={{ marginBottom: 14 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
              </div>

              {/* 목표 비교 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2, fontWeight: 600, letterSpacing: '0.04em' }}>2026 목표</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>{k.target2026}<span style={{ fontSize: 10, fontWeight: 400 }}> {k.unit}</span></div>
                </div>
                <div style={{ background: 'var(--mint-light)', borderRadius: 'var(--r-sm)', padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--mint-dark)', marginBottom: 2, fontWeight: 600, letterSpacing: '0.04em' }}>2027 목표</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--mint-dark)' }}>{k.target2027}<span style={{ fontSize: 10, fontWeight: 400 }}> {k.unit}</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 차트 2열 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>KPI 달성률 종합 (%)</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-3)' }} />
              <Radar name="달성률" dataKey="달성" stroke="var(--mint)" fill="var(--mint)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="목표" dataKey="목표" stroke="var(--border)" fill="none" strokeDasharray="4 4" />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v}%`]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>목표·실적 비교</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockKpiTargets.map(k => ({ label: k.label, '2026목표': k.target2026, '실적': k.actual, '2027목표': k.target2027 }))} barGap={3} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="실적" fill="var(--mint)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="2026목표" fill="var(--border)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="2027목표" fill="var(--info-bg)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 상세 테이블 */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr>
            {['지표', '단위', '2026 목표', '2027 목표', '현재 실적', '달성률', '평가'].map(h => <th key={h}>{h}</th>)}
          </tr></thead>
          <tbody>
            {mockKpiTargets.map(k => {
              const pct = Math.round((k.actual / k.target2026) * 100);
              const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
              const bgColor = pct >= 80 ? 'var(--success-bg)' : pct >= 50 ? 'var(--warning-bg)' : 'var(--danger-bg)';
              return (
                <tr key={k.label}>
                  <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{k.label}</td>
                  <td style={{ color: 'var(--text-3)' }}>{k.unit}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{k.target2026.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--mint)' }}>{k.target2027.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', fontWeight: 700, color: 'var(--text-1)' }}>{k.actual.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>{pct}%</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 700, color, background: bgColor, padding: '2px 10px', borderRadius: 999 }}>
                      {pct >= 80 ? '양호' : pct >= 50 ? '주의' : '미흡'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
