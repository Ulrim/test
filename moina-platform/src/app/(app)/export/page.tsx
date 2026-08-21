'use client';

import { useState } from 'react';
import { mockExportRecords, mockBuyers } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COUNTRY: Record<string, string> = { VN: '베트남', CN: '중국', TH: '태국', PH: '필리핀', JP: '일본', KR: '대한민국' };
const FLAG:    Record<string, string> = { VN: '🆻🇳', CN: '🇨🇳', TH: '🇹🇭', PH: '🇵🇭', JP: '🇯🇵', KR: '🇰🇷' };
const BAR_COLORS = ['#0BB89A', '#3B82F6', '#6C5CE7', '#F59E0B', '#EF4444', '#10B981'];

export default function ExportPage() {
  const [tab, setTab] = useState<'records' | 'buyers'>('records');

  const delivered = mockExportRecords.filter(e => e.status === 'delivered');
  const totalUsd  = delivered.reduce((s, e) => s + e.totalUsd, 0);
  const totalKg   = delivered.reduce((s, e) => s + e.quantityKg, 0);
  const activeBuyers = mockBuyers.filter(b => b.status === 'active').length;

  const countryData = Object.entries(
    delivered.reduce((acc, e) => { acc[e.country] = (acc[e.country] ?? 0) + e.totalUsd; return acc; }, {} as Record<string, number>)
  ).map(([c, usd]) => ({ country: COUNTRY[c] ?? c, usd })).sort((a, b) => b.usd - a.usd);

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>수출 실적 관리</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>국가별 수출 계약·납품 현황 및 바이어 관리</p>
      </div>

      {/* KPI 요약 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: '납품완료 수출액', value: `$${totalUsd.toLocaleString()}`, sub: `목표 $200K · ${Math.round(totalUsd/2000)}%` },
          { label: '납품완료 수량',   value: `${totalKg.toLocaleString()} kg`, sub: `${delivered.length}건 완료` },
          { label: '수출 국가',       value: `${new Set(mockExportRecords.map(e => e.country)).size}개국`, sub: '목표 5개국' },
          { label: '활성 바이어',     value: `${activeBuyers}개사`, sub: `협상 중 ${mockBuyers.filter(b => b.status === 'negotiating').length}개사` },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <div className="metric-label" style={{ marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div className="metric-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
          국가별 납품완료 수출액 (USD)
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={countryData} barSize={36} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="country" tick={{ fontSize: 12, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, '수출액']} />
            <Bar dataKey="usd" radius={[5, 5, 0, 0]} name="수출액">
              {countryData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 16, border: '1px solid var(--border)' }}>
        {(['records', 'buyers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 16px', borderRadius: 7, border: 'none',
            background: tab === t ? 'var(--surface)' : 'transparent',
            color: tab === t ? 'var(--mint)' : 'var(--text-3)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s',
          }}>
            {t === 'records' ? '수출 계약·납품' : '바이어 목록'}
          </button>
        ))}
      </div>

      {tab === 'records' ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 740 }}>
              <thead><tr>
                {['바이어', '국가', '제품', '수량', '단가', '총액(USD)', '인코텐즈', '계약일', '납품일', '상태'].map(h => <th key={h}>{h}</th>)}
              </tr></thead>
              <tbody>
                {mockExportRecords.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{rec.buyer}</td>
                    <td>{FLAG[rec.country]} {COUNTRY[rec.country]}</td>
                    <td>{rec.product}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{rec.quantityKg.toLocaleString()} kg</td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>${rec.pricePerKg.toFixed(1)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', fontWeight: 700, color: 'var(--text-1)' }}>${rec.totalUsd.toLocaleString()}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-2)' }}>{rec.incoterms}</span></td>
                    <td>{rec.contractDate}</td>
                    <td>{rec.deliveryDate ?? '—'}</td>
                    <td><StatusBadge variant={rec.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {mockBuyers.map(buyer => (
            <div key={buyer.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>{buyer.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{FLAG[buyer.country]} {COUNTRY[buyer.country]}</div>
                </div>
                <StatusBadge
                  variant={buyer.status === 'active' ? 'normal' : buyer.status === 'negotiating' ? 'caution' : 'pending'}
                  label={buyer.status === 'active' ? '활성' : buyer.status === 'negotiating' ? '협상 중' : '잠재'}
                  size="sm"
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <StatusBadge variant={buyer.type} size="sm" />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>최근 접촉: {buyer.lastContact}</span>
              </div>
              {buyer.totalUsd > 0 && (
                <div style={{ background: 'var(--mint-light)', borderRadius: 'var(--r-sm)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--mint-dark)' }}>누적 거래액</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--mint-dark)' }}>${buyer.totalUsd.toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
