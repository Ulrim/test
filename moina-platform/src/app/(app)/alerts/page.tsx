'use client';

import { useState } from 'react';
import { mockAlerts } from '@/lib/mockData';
import { Alert } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Bell, CheckCheck } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all'|'water'|'production'|'export'>('all');

  const markRead = (id: string) => setAlerts(prev => prev.map(a => a.id===id?{...a,read:true}:a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({...a,read:true})));

  const filtered = filter==='all' ? alerts : alerts.filter(a => a.type===filter);
  const unread = alerts.filter(a => !a.read).length;
  const typeLabel: Record<string,string> = { water:'수질', production:'생산', export:'수출', system:'시스템' };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">알림 · 이상감지</h1>
          <p className="text-sm text-slate-500 mt-0.5">수질 이상, 생산 현황, 수출 일정 알림 목록</p>
        </div>
        {unread>0 && <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"><CheckCheck className="w-4 h-4" />전체 읽음 처리</button>}
      </div>
      <div className="flex gap-2">
        {(['all','water','production','export'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter===f?'bg-teal-600 text-white':'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'}`}>
            {f==='all'?'전체':typeLabel[f]}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length===0 && (
          <div className="text-center py-16 text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>알림이 없습니다.</p>
          </div>
        )}
        {filtered.map(alert => (
          <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border ${!alert.read?'bg-white border-red-100 shadow-sm':'bg-slate-50 border-slate-100'}`}>
            <div className="flex flex-col items-center gap-1">
              <StatusBadge variant={alert.severity} size="sm" />
              <span className="text-xs text-slate-400">{typeLabel[alert.type]??alert.type}</span>
            </div>
            <div className="flex-1">
              <p className={`text-sm ${!alert.read?'font-medium text-slate-800':'text-slate-600'}`}>{alert.message}</p>
              {alert.tankId && <p className="text-xs text-slate-400 mt-0.5">배양조 ID: {alert.tankId}</p>}
              <p className="text-xs text-slate-400 mt-1">{alert.createdAt.replace('T',' ').slice(0,16)}</p>
            </div>
            {!alert.read && <button onClick={() => markRead(alert.id)} className="text-xs text-teal-600 hover:text-teal-700 whitespace-nowrap font-medium">읽음</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
