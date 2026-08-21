'use client';

import { useState } from 'react';
import { mockBatches } from '@/lib/mockData';
import { ProductionBatch } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { X } from 'lucide-react';

export default function ProductionPage() {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed' | 'failed'>('all');
  const [detail, setDetail] = useState<ProductionBatch | null>(null);
  const filtered = filter === 'all' ? mockBatches : mockBatches.filter(b => b.status === filter);

  const stats = {
    ongoing:   mockBatches.filter(b => b.status === 'ongoing').length,
    completed: mockBatches.filter(b => b.status === 'completed').length,
    failed:    mockBatches.filter(b => b.status === 'failed').length,
    totalKg:   mockBatches.filter(b => b.status === 'completed').reduce((s, b) => s + (b.actualKg ?? 0), 0),
  };

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>생산·품질 관리</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>모이나 생산 배치 현황 및 DHA/EPA 분석, 안전성 검사 결과</p>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: '진행 중 배치', value: stats.ongoing, color: '#3B82F6', bg: '#EFF6FF' },
          { label: '완료 배치',   value: stats.completed, color: 'var(--success)', bg: 'var(--success-bg)' },
          { label: '실패 배치',   value: stats.failed,   color: 'var(--danger)',  bg: 'var(--danger-bg)' },
          { label: '완료 총 생산량', value: `${stats.totalKg.toLocaleString()} kg`, color: 'var(--text-1)', bg: 'var(--bg)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <div className="metric-label" style={{ marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['all', 'ongoing', 'completed', 'failed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px',
            borderRadius: 999,
            border: filter === f ? 'none' : '1px solid var(--border)',
            background: filter === f ? 'var(--mint)' : 'var(--surface)',
            color: filter === f ? '#fff' : 'var(--text-2)',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            transition: 'all 0.15s',
          }}>
            {f === 'all' ? '전체' : f === 'ongoing' ? '진행 중' : f === 'completed' ? '완료' : '실패'}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 820 }}>
            <thead>
              <tr>
                {['배치번호', '제품', '시작일', '종료일', '상태', '목표', '실적', '달성률', '품질', ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(batch => {
                const pct = batch.actualKg && batch.targetKg ? Math.round((batch.actualKg / batch.targetKg) * 100) : null;
                const pctColor = pct == null ? 'var(--text-3)' : pct >= 90 ? 'var(--success)' : pct >= 70 ? 'var(--warning)' : 'var(--danger)';
                const qPass = batch.heavyMetal === 'pass' && batch.pathogen === 'pass';
                const qFail = batch.heavyMetal === 'fail' || batch.pathogen === 'fail';

                return (
                  <tr key={batch.id}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>{batch.batchNo}</span></td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>{batch.product}</td>
                    <td>{batch.startDate}</td>
                    <td>{batch.endDate ?? '—'}</td>
                    <td><StatusBadge variant={batch.status} size="sm" /></td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{batch.targetKg.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{batch.actualKg?.toLocaleString() ?? '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {pct != null
                        ? <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: pctColor }}>{pct}%</span>
                        : '—'}
                    </td>
                    <td>
                      {qPass ? <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 600 }}>합격</span>
                        : qFail ? <span style={{ color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}>불합격</span>
                        : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>검사 중</span>}
                    </td>
                    <td>
                      <button onClick={() => setDetail(batch)} style={{
                        background: 'var(--mint-light)', color: 'var(--mint)',
                        border: 'none', borderRadius: 6, padding: '3px 10px',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                      }}>상세</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-xl)',
            padding: 28,
            maxWidth: 420, width: '100%', margin: 16,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{detail.batchNo}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>{detail.product}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusBadge variant={detail.status} />
                <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: '담당자', value: detail.manager },
                { label: '시작일', value: detail.startDate },
                { label: '목표 생산량', value: `${detail.targetKg.toLocaleString()} kg` },
                { label: '실제 생산량', value: detail.actualKg ? `${detail.actualKg.toLocaleString()} kg` : '—' },
              ].map(r => (
                <div key={r.label} style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{r.value}</div>
                </div>
              ))}
            </div>

            {(detail.dha || detail.epa || detail.protein) && (
              <div style={{ background: 'var(--mint-light)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--mint)', marginBottom: 8, letterSpacing: '0.05em' }}>영양 분석</div>
                <div style={{ display: 'flex', gap: 20 }}>
                  {detail.dha && <NutrientStat label="DHA" value={`${detail.dha}%`} />}
                  {detail.epa && <NutrientStat label="EPA" value={`${detail.epa}%`} />}
                  {detail.protein && <NutrientStat label="단백질" value={`${detail.protein}%`} />}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <QualityRow label="중금속 검사" val={detail.heavyMetal} />
              <QualityRow label="병원균 검사" val={detail.pathogen} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NutrientStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--mint)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--mint-dark)' }}>{value}</div>
    </div>
  );
}

function QualityRow({ label, val }: { label: string; val?: string }) {
  const isPass = val === 'pass';
  const isFail = val === 'fail';
  return (
    <div style={{ background: isPass ? 'var(--success-bg)' : isFail ? 'var(--danger-bg)' : 'var(--bg)', borderRadius: 'var(--r-md)', padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: isPass ? 'var(--success)' : isFail ? 'var(--danger)' : 'var(--text-3)' }}>
        {val === 'pass' ? '✓ 합격' : val === 'fail' ? '✗ 불합격' : '검사 중'}
      </div>
    </div>
  );
}
