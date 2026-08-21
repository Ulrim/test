'use client';

import { mockTanks, mockBatches, mockExportRecords, mockKpiTargets, mockAlerts, monthlyProductionData, monthlyExportData } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const fmt = (n: number) => n.toLocaleString();

export default function DashboardPage() {
  const deliveredUsd = mockExportRecords.filter(e => e.status === 'delivered').reduce((s, e) => s + e.totalUsd, 0);
  const ongoingBatch = mockBatches.find(b => b.status === 'ongoing');
  const warningTanks = mockTanks.filter(t => t.status !== 'normal').length;
  const unreadAlerts = mockAlerts.filter(a => !a.read).length;
  const exportPct = Math.round((deliveredUsd / 200000) * 100);

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>통합 대시보드</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>2026년 8월 21일 · 바이오션 모이나 생산·수출 현황</p>
      </div>

      {/* 주요 지표 4개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard
          label="납품완료 수출액"
          value={`$${fmt(deliveredUsd)}`}
          sub={`목표 $200K 대비 ${exportPct}% 달성`}
          trend="up"
          accent="mint"
        />
        <MetricCard
          label="진행 배치 실적"
          value={ongoingBatch ? `${fmt(ongoingBatch.actualKg ?? 0)} kg` : '—'}
          sub={ongoingBatch ? `목표 ${fmt(ongoingBatch.targetKg)}kg · ${ongoingBatch.batchNo}` : '진행 배치 없음'}
          trend="up"
          accent="blue"
        />
        <MetricCard
          label="배양조 정상 가동"
          value={`${mockTanks.length - warningTanks} / ${mockTanks.length}`}
          sub={`${warningTanks}개 주의·경고 상태`}
          trend={warningTanks > 0 ? 'down' : 'up'}
          accent={warningTanks > 1 ? 'red' : 'yellow'}
        />
        <MetricCard
          label="미처리 알림"
          value={`${unreadAlerts}건`}
          sub="즉시 확인 필요"
          trend={unreadAlerts > 0 ? 'down' : 'up'}
          accent={unreadAlerts > 0 ? 'red' : 'mint'}
        />
      </div>

      {/* 차트 2열 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>월별 생산량</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text-1)', marginTop: 2 }}>
              {fmt(monthlyProductionData.reduce((s, d) => s + d.kg, 0))} kg
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>2026년 3–8월 누적</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyProductionData} barSize={24} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${Number(v).toLocaleString()} kg`, '생산량']}
              />
              <Bar dataKey="kg" fill="var(--mint)" radius={[4, 4, 0, 0]} name="생산량(kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>월별 수출액</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text-1)', marginTop: 2 }}>
              ${fmt(monthlyExportData.reduce((s, d) => s + d.usd, 0))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>2026년 3–8월 누적</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyExportData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="usdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--mint)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--mint)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, '수출액']}
              />
              <Area dataKey="usd" stroke="var(--mint)" strokeWidth={2} fill="url(#usdGrad)" dot={{ r: 3, fill: 'var(--mint)' }} name="수출액" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI 달성도 */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 16 }}>2026 KPI 달성률</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
          {mockKpiTargets.map(k => {
            const pct = Math.min(100, Math.round((k.actual / k.target2026) * 100));
            const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
            return (
              <div key={k.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{k.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color }}>
                    {k.actual}{k.unit} <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>/ {k.target2026}</span>
                    <span style={{ marginLeft: 6, color }}>{pct}%</span>
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 2열 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* 알림 */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>최근 알림</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockAlerts.slice(0, 4).map(alert => (
              <div key={alert.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                background: !alert.read ? 'var(--danger-bg)' : 'var(--bg)',
                borderLeft: `3px solid ${alert.severity === 'warning' ? 'var(--danger)' : alert.severity === 'caution' ? 'var(--warning)' : 'var(--info)'}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: !alert.read ? 600 : 400, lineHeight: 1.4 }}>{alert.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{alert.createdAt.slice(11, 16)}</div>
                </div>
                {!alert.read && <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* 배양조 요약 */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>배양조 현황</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {mockTanks.map(tank => {
              const borderColor = tank.status === 'normal' ? 'var(--success)' : tank.status === 'caution' ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={tank.id} style={{
                  borderLeft: `3px solid ${borderColor}`,
                  paddingLeft: 10,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{tank.name}</span>
                    <StatusBadge variant={tank.status} size="sm" />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    {fmt(tank.density)} 마리/ℓ · {tank.water.temperature}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, trend, accent }: {
  label: string; value: string; sub: string; trend: 'up' | 'down'; accent: string;
}) {
  const accentColors: Record<string, { bg: string; text: string; icon: string }> = {
    mint:   { bg: 'var(--mint-light)',    text: 'var(--mint)',    icon: 'var(--mint)' },
    blue:   { bg: '#EFF6FF',              text: '#3B82F6',        icon: '#3B82F6' },
    red:    { bg: 'var(--danger-bg)',     text: 'var(--danger)',  icon: 'var(--danger)' },
    yellow: { bg: 'var(--warning-bg)',    text: 'var(--warning)', icon: 'var(--warning)' },
  };
  const c = accentColors[accent] ?? accentColors.mint;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div className="metric-label">{label}</div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {trend === 'up'
            ? <TrendingUp size={14} color={c.icon} />
            : <TrendingDown size={14} color={c.icon} />}
        </div>
      </div>
      <div className="metric-value tabular">{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}
