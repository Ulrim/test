'use client';

import { useState } from 'react';
import { mockTanks, generateChartData } from '@/lib/mockData';
import { CultivationTank } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Wind, FlaskConical } from 'lucide-react';

export default function CultivationPage() {
  const [selected, setSelected] = useState<CultivationTank>(mockTanks[0]);
  const chartData = generateChartData(selected.id, 12);
  const statusCount = { normal: mockTanks.filter(t=>t.status==='normal').length, caution: mockTanks.filter(t=>t.status==='caution').length, warning: mockTanks.filter(t=>t.status==='warning').length };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div><h1 className="text-xl font-bold text-slate-800">배양 모니터링</h1><p className="text-sm text-slate-500 mt-0.5">모이나 배양조 수질 및 밀도 실시간 모니터링</p></div>
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2"><span className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-sm text-emerald-700 font-medium">정상 {statusCount.normal}조</span></div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2"><span className="w-2 h-2 rounded-full bg-amber-500"/><span className="text-sm text-amber-700 font-medium">주의 {statusCount.caution}조</span></div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-2"><span className="w-2 h-2 rounded-full bg-red-500"/><span className="text-sm text-red-700 font-medium">경고 {statusCount.warning}조</span></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {mockTanks.map(tank => (
          <button key={tank.id} onClick={() => setSelected(tank)} className={`text-left p-4 rounded-xl border transition-all ${selected.id===tank.id?'border-teal-500 bg-teal-50 shadow-sm':'border-slate-200 bg-white hover:border-teal-300'}`}>
            <div className="flex justify-between items-start mb-2"><span className="font-semibold text-slate-800">{tank.name}</span><StatusBadge variant={tank.status} size="sm" dot /></div>
            <p className="text-xs text-slate-500">{tank.volume.toLocaleString()}ℓ · 접종 {tank.daysSinceInoculation}일</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">밀도</span><span className="font-medium text-slate-700">{tank.density.toLocaleString()} / {tank.targetDensity.toLocaleString()}</span></div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${tank.density>=tank.targetDensity?'bg-teal-500':tank.density>=tank.targetDensity*0.7?'bg-amber-400':'bg-red-400'}`} style={{width:`${Math.min(100,(tank.density/tank.targetDensity)*100)}%`}} />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-slate-800">{selected.name} 상세 현황</h3><span className="text-xs text-slate-400">최종 업데이트: {selected.lastUpdated.slice(11,16)}</span></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <WCard icon={<Thermometer className="w-4 h-4 text-orange-500"/>} label="수온" value={`${selected.water.temperature}°C`} ok={selected.water.temperature<=26} />
          <WCard icon={<FlaskConical className="w-4 h-4 text-blue-500"/>} label="pH" value={`${selected.water.pH}`} ok={selected.water.pH>=6.8&&selected.water.pH<=7.8} />
          <WCard icon={<Wind className="w-4 h-4 text-cyan-500"/>} label="용존산소" value={`${selected.water.dissolvedOxygen} mg/L`} ok={selected.water.dissolvedOxygen>=6.5} />
          <WCard icon={<Droplets className="w-4 h-4 text-red-400"/>} label="암모니아" value={`${selected.water.ammonia} mg/L`} ok={selected.water.ammonia<=0.1} />
          <WCard icon={<Droplets className="w-4 h-4 text-slate-400"/>} label="탁도" value={`${selected.water.turbidity} NTU`} ok={selected.water.turbidity<=25} />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div><p className="text-xs font-medium text-slate-600 mb-2">수온 / 용존산소 (12시간)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize:10}} interval={2} />
                <YAxis yAxisId="temp" tick={{fontSize:10}} domain={['auto','auto']} />
                <YAxis yAxisId="do" orientation="right" tick={{fontSize:10}} domain={['auto','auto']} />
                <Tooltip /><Legend iconSize={10} />
                <Line yAxisId="temp" dataKey="temperature" stroke="#f97316" strokeWidth={1.5} dot={false} name="수온(°C)" />
                <Line yAxisId="do" dataKey="dissolvedOxygen" stroke="#0891b2" strokeWidth={1.5} dot={false} name="DO(mg/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div><p className="text-xs font-medium text-slate-600 mb-2">pH / 암모니아 (12시간)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize:10}} interval={2} />
                <YAxis yAxisId="ph" tick={{fontSize:10}} domain={['auto','auto']} />
                <YAxis yAxisId="nh" orientation="right" tick={{fontSize:10}} domain={['auto','auto']} />
                <Tooltip /><Legend iconSize={10} />
                <Line yAxisId="ph" dataKey="pH" stroke="#7c3aed" strokeWidth={1.5} dot={false} name="pH" />
                <Line yAxisId="nh" dataKey="ammonia" stroke="#dc2626" strokeWidth={1.5} dot={false} name="암모니아(mg/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function WCard({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok: boolean }) {
  return (
    <div className={`rounded-lg p-3 border ${ok?'bg-slate-50 border-slate-200':'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-1 mb-1">{icon}<span className="text-xs text-slate-500">{label}</span></div>
      <p className={`text-base font-bold ${ok?'text-slate-800':'text-red-700'}`}>{value}</p>
    </div>
  );
}
