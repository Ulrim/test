'use client';

import { mockKpiTargets } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiPage() {
  const radarData = mockKpiTargets.map(k => ({ subject: k.label, '달성': Math.round((k.actual/k.target2026)*100), '목표': 100 }));
  const barData = mockKpiTargets.map(k => ({ label: k.label, '2026 목표': k.target2026, '2026 실적': k.actual, '2027 목표': k.target2027 }));

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div><h1 className="text-xl font-bold text-slate-800">KPI 달성 현황</h1><p className="text-sm text-slate-500 mt-0.5">민간투자기반 유망기업 사업화 지원사업 핵심 성과 지표 · 2026년 기준</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockKpiTargets.map(k => {
          const pct = Math.min(100, Math.round((k.actual/k.target2026)*100));
          const on = pct>=70;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <div><p className="font-semibold text-slate-800">{k.label}</p><p className="text-xs text-slate-500">단위: {k.unit}</p></div>
                {on?<TrendingUp className="w-5 h-5 text-teal-500"/>:<TrendingDown className="w-5 h-5 text-red-400"/>}
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-slate-800">{k.actual}</span>
                <span className="text-sm text-slate-500 mb-1">{k.unit}</span>
                <span className={`ml-auto text-sm font-bold ${on?'text-teal-600':'text-red-500'}`}>{pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${pct>=80?'bg-teal-500':pct>=50?'bg-amber-400':'bg-red-400'}`} style={{width:`${pct}%`}} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">2026 목표</p><p className="font-semibold text-slate-700">{k.target2026} {k.unit}</p></div>
                <div className="bg-teal-50 rounded-lg p-2"><p className="text-teal-400">2027 목표</p><p className="font-semibold text-teal-700">{k.target2027} {k.unit}</p></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-teal-600"/><h3 className="text-sm font-semibold text-slate-700">KPI 달성률 종합 (목표 대비 %)</h3></div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{fontSize:11}} />
            <Radar name="달성률" dataKey="달성" stroke="#0d9488" fill="#0d9488" fillOpacity={0.25} />
            <Radar name="목표" dataKey="목표" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.08} strokeDasharray="4 4" />
            <Legend />
            <Tooltip formatter={(v) => [`${v}%`]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">연도별 목표·실적 비교</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:10}} />
            <Tooltip /><Legend />
            <Bar dataKey="2026 실적" fill="#0d9488" radius={[4,4,0,0]} />
            <Bar dataKey="2026 목표" fill="#99f6e4" radius={[4,4,0,0]} />
            <Bar dataKey="2027 목표" fill="#7dd3fc" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>{['지표','단위','2026 목표','2027 목표','2026 실적','달성률','평가'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {mockKpiTargets.map(k => {
              const pct = Math.round((k.actual/k.target2026)*100);
              return (
                <tr key={k.label} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{k.label}</td>
                  <td className="px-4 py-3 text-slate-500">{k.unit}</td>
                  <td className="px-4 py-3 text-right">{k.target2026.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-teal-600">{k.target2027.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold">{k.actual.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right"><span className={`font-bold ${pct>=80?'text-teal-600':pct>=50?'text-amber-600':'text-red-600'}`}>{pct}%</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pct>=80?'bg-teal-100 text-teal-700':pct>=50?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{pct>=80?'양호':pct>=50?'주의':'미흡'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
