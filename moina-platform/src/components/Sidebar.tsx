'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FlaskConical, Package, Globe, Target,
  Bell, LogOut, ChevronLeft, ChevronRight, Microscope
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
    <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 bg-slate-900 text-white flex flex-col min-h-screen shrink-0`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Microscope className="w-6 h-6 text-teal-400 shrink-0" />
            <div className="leading-tight">
              <p className="font-bold text-sm text-teal-400">바이오션</p>
              <p className="text-[10px] text-slate-400 font-normal">모이나 모니터링 플랫폼</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} className="p-1 rounded hover:bg-slate-700 ml-auto shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                ${active ? 'bg-teal-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="relative shrink-0"><Icon className="w-5 h-5" /></span>
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        <div className="mt-2 border-t border-slate-700 pt-2">
          <Link
            href="/alerts"
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
              ${pathname.startsWith('/alerts') ? 'bg-teal-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="relative shrink-0">
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </span>
            {!collapsed && <span>알림 · 이상감지</span>}
          </Link>
        </div>
      </nav>

      <div className="border-t border-slate-700 p-4">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-400">
              {user.role === 'admin' ? '관리자' : user.role === 'operator' ? '운영자' : '조회자'}
            </p>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && '로그아웃'}
        </button>
      </div>
    </aside>
  );
}
