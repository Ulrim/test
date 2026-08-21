'use client';

import { useState } from 'react';
import { mockAlerts } from '@/lib/mockData';
import { Alert } from '@/types';
import { AlertTriangle, Info, CheckCircle2, BellOff } from 'lucide-react';

const SEVERITY_CONFIG = {
  warning: { color: 'var(--danger)',  bg: 'var(--danger-bg)',  border: 'var(--danger)',  Icon: AlertTriangle, label: '경고' },
  caution: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning)', Icon: AlertTriangle, label: '주의' },
  info:    { color: 'var(--info)',    bg: 'var(--info-bg)',    border: 'var(--info)',    Icon: Info,          label: '정보' },
};

const TYPE_LABEL: Record<string, string> = { water: '수질', production: '생산', export: '수출', system: '시스템' };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'water' | 'production' | 'export'>('all');

  const markRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const unread = alerts.filter(a => !a.read).length;

  const counts = { warning: alerts.filter(a => a.severity === 'warning' && !a.read).length, caution: alerts.filter(a => a.severity === 'caution' && !a.read).length };

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>알림 · 이상감지</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0' }}>수질 이상, 생산 현황, 수출 일정 알림</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            <CheckCircle2 size={14} color="var(--success)" />
            전체 읽음 처리
          </button>
        )}
      </div>

      {/* 요약 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {counts.warning > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '10px 16px' }}>
            <AlertTriangle size={16} color="var(--danger)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>경고 {counts.warning}건</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>즉시 확인 필요</span>
          </div>
        )}
        {counts.caution > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--r-md)', padding: '10px 16px' }}>
            <AlertTriangle size={16} color="var(--warning)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)' }}>주의 {counts.caution}건</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>모니터링 필요</span>
          </div>
        )}
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['all', 'water', 'production', 'export'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 999,
            border: filter === f ? 'none' : '1px solid var(--border)',
            background: filter === f ? 'var(--mint)' : 'var(--surface)',
            color: filter === f ? '#fff' : 'var(--text-2)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
          }}>
            {f === 'all' ? '전체' : TYPE_LABEL[f]}
          </button>
        ))}
      </div>

      {/* 알림 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-3)' }}>
            <BellOff size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <div style={{ fontSize: 14 }}>알림이 없습니다.</div>
          </div>
        )}
        {filtered.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info;
          const { Icon } = cfg;
          return (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 18px',
              borderRadius: 'var(--r-lg)',
              background: !alert.read ? cfg.bg : 'var(--surface)',
              border: `1px solid ${!alert.read ? `${cfg.border}30` : 'var(--border)'}`,
              borderLeft: `4px solid ${cfg.border}`,
              transition: 'background 0.2s',
            }}>
              <Icon size={16} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    color: cfg.color, background: cfg.bg,
                    padding: '1px 7px', borderRadius: 999,
                    textTransform: 'uppercase',
                  }}>{cfg.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--bg)', padding: '1px 7px', borderRadius: 999 }}>
                    {TYPE_LABEL[alert.type] ?? alert.type}
                  </span>
                  {alert.tankId && (
                    <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>조 {alert.tankId}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: !alert.read ? 'var(--text-1)' : 'var(--text-2)', fontWeight: !alert.read ? 600 : 400, lineHeight: 1.5 }}>
                  {alert.message}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  {alert.createdAt.replace('T', ' ').slice(0, 16)}
                </div>
              </div>
              {!alert.read && (
                <button onClick={() => markRead(alert.id)} style={{
                  flexShrink: 0, padding: '5px 12px',
                  borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
                  background: 'var(--surface)', color: 'var(--text-2)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                }}>읽음</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
