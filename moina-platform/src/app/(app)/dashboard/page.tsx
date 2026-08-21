'use client';

import { mockTanks, mockBatches, mockExportRecords, mockKpiTargets, mockAlerts, monthlyProductionData, monthlyExportData } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves, Package, Globe, Target, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const totalExportUsd = mockExportRecords.filter(e => e.status === 'delivered').reduce((s, e) => s + e.totalUsd, 0);
  const ongoingBatch = mockBatches.find(b => b.status === 'ongoing');
  const warningTanks = mockTanks.filter(t => t.status !== 'normal').length;
  const unreadAlerts = mockAlerts.filter(a => !a.read).length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800">통합 대시보드</h1>
        <p className="text-sm text-slate-500 mt-0.5">2026년 8월 21일 기준 · 바이오션 모이나 생산·수출 현황</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Globe className="w-5 h-5 text-teal-600" />} label="누적 수출액 (낙품완료)" value={`$${(totalExportUsd/1000).toFixed(0)}K`} sub={`목표 $200K · ${((totalExportUsd/200000)*100).toFixed(0)}% 달성`} color="teal" />
        <KpiCard icon={<Package className="w-5 h-5 text-blue-600" />} label="진행 중 배치" value={ongoingBatch ? `${ongoingBatch.actualKg??0}kg` : '-'} sub={ongoingBatch ? `목표 ${ongoingBatch.targetKg}kg · ${ongoingBatch.batchNo}` : '배치 없음'} color="blue" />
        <KpiCard icon={<Waves className="w-5 h-5 text-indigo-600" />} label="배양조 상태" value={`${mockTanks.length-warningTanks} / ${mockTanks.length}`} sub={`${warningTanks}개 주의·경고`} color="indigo" />
        <KpiCard icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} label="미수정 알림" value={`${unreadAlerts}건`} sub="즉시 확인 필요" color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">월별 생산량 (kg)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyProductionData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="kg" fill="#0d9488" radius={[4,4,0,0]} name="생산량(kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">월별 수출액 (USD)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyExportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '수출액']} />
              <Line dataKey="usd" stroke="#0891b2" strokeWidth={2} dot={{ r: 4 }} name="수출액(USD)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-teal-600" /><h3 className="text-sm font-semibold text-slate-700">2026년 주요 KPI 달성률</h3></div>
        <div className="space-y-3">
          {mockKpiTargets.map(k => {
            const pct = Math.min(100, Math.round((k.actual/k.target2026)*100));
            return (
              <div key={k.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{k.label}</span>
                  <span className="font-medium">{k.actual}{k.unit} / {k.target2026}{k.unit} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct>=80?'bg-teal-500':pct>=50?'bg-amber-400':'bg-red-400'}`} style={{width:`${pct}%`}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">전제 알림</h3>
        <div className="space-y-2">
          {mockAlerts.slice(0,5).map(alert => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${!alert.read?'bg-red-50':'bg-slate-50'}`}>
              <StatusBadge variant={alert.severity} size="sm" />
              <span className="text-sm text-slate-700 flex-1">{alert.message}</span>
              <span className="text-xs text-slate-400 shrink-0">{alert.createdAt.slice(11,16)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">배양조 현황 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mockTanks.map(tank => (
            <div key={tank.id} className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{tank.name}</span>
                <StatusBadge variant={tank.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500">밀도 {tank.density.toLocaleString()} 마리/ℓ</p>
              <p className="text-xs text-slate-500">수온 {tank.water.temperature}°C · pH {tank.water.pH}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  const bg: Record<string,string> = { teal:'bg-teal-50 border-teal-100', blue:'bg-blue-50 border-blue-100', indigo:'bg-indigo-50 border-indigo-100', amber:'bg-amber-50 border-amber-100' };
  return (
    <div className={`rounded-xl border p-4 ${bg[color]??'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-600">{label}</span></div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}
