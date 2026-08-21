'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FlaskConical, Package, Globe, Target,
  Bell, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { mockAlerts } from '@/lib/mockData';

const navItems = [
  { href: '/dashboard', label: '통합 대시보드', icon: LayoutDashboard },
  { href: '/cultivation', label: '배양 모니터링', icon: FlaskConical },
  { href: '/production', label: '생산·품질 관리', icon: Package },
  { href: '/export', label: '수출 실적 관리', icon: Globe },
  { href: '/kpi', label: 'KPI 달성 현황', icon: Target },
  { href: '/alerts', label: '알림·이상감지', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const unread = mockAlerts.filter(a => !a.read).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside style={{
      width: collapsed ? '64px' : '220px',
      background: 'var(--navy)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
      transition: 'width 0.2s ease',
    }}>
      {/* 로고 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid var(--navy-3)',
        gap: '10px',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '8px',
              background: 'var(--mint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6" r="3" stroke="white" strokeWidth="1.5"/>
                <path d="M5 6 C5 6 3 10 3 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 6 C11 6 13 10 13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="9" x2="8" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>바이오션</div>
              <div style={{ fontSize: 10, color: 'var(--navy-text)', lineHeight: 1.3, whiteSpace: 'nowrap' }}>모이나 모니터링</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'var(--mint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="3" stroke="white" strokeWidth="1.5"/>
              <line x1="8" y1="9" x2="8" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: 'var(--navy-3)',
            border: 'none',
            borderRadius: '6px',
            color: 'var(--navy-text)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 네비게이션 */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const isAlerts = href === '/alerts';
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px 0' : '9px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                position: 'relative',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'var(--navy-3)' : 'transparent',
                color: active ? '#fff' : 'var(--navy-text)',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s ease',
                borderLeft: active ? '3px solid var(--mint)' : '3px solid transparent',
              }}
            >
              <span style={{ position: 'relative', flexShrink: 0 }}>
                <Icon size={16} />
                {isAlerts && unread > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px', right: '-5px',
                    background: 'var(--danger)',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: '999px',
                    minWidth: 14, height: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}>{unread}</span>
                )}
              </span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 유저 섹션 */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--navy-3)' }}>
        {!collapsed && user && (
          <div style={{ padding: '8px 12px', marginBottom: '4px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.name}</div>
            <div style={{
              display: 'inline-block',
              fontSize: 10, fontWeight: 600,
              background: 'var(--mint)',
              color: '#fff',
              padding: '1px 7px',
              borderRadius: '999px',
              marginTop: '3px',
              letterSpacing: '0.04em',
            }}>
              {user.role === 'admin' ? '관리자' : user.role === 'operator' ? '운영자' : '조회자'}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: collapsed ? '9px 0' : '9px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: 'var(--navy-text)',
            cursor: 'pointer',
            fontSize: 13,
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <LogOut size={15} />
          {!collapsed && '로그아웃'}
        </button>
      </div>
    </aside>
  );
}
