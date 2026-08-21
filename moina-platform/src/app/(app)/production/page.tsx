'use client';

import { useState } from 'react';
import { mockBatches } from '@/lib/mockData';
import { ProductionBatch } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ProductionPage() {
  const [filter, setFilter] = useState<'all'|'ongoing'|'completed'|'failed'>('all');
  const [detail, setDetail] = useState<ProductionBatch|null>(null);
  const filtered = filter==='all' ? mockBatches : mockBatches.filter(b => b.status===filter);
  const total = { ongoing: mockBatches.filter(b=>b.status==='ongoing').length, completed: mockBatches.filter(b=>b.status==='completed').length, failed: mockBatches.filter(b=>b.status==='failed').length };
  const totalKg = mockBatches.filter(b=>b.status==='completed').reduce((s,b)=>s+(b.actualKg??0),0);

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div><h1 className="text-xl font-bold text-slate-800">생산·품질 관리</h1><p className="text-sm text-slate-500 mt-0.5">모이나 생산 배치 현황 및 품질 분석 결과</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SC icon={<Package className="w-5 h-5 text-blue-600"/>} label="진행 중" value={total.ongoing} color="blue" />
        <SC icon={<CheckCircle className="w-5 h-5 text-teal-600"/>} label="완료" value={total.completed} color="teal" />
        <SC icon={<XCircle className="w-5 h-5 text-red-600"/>} label="실패" value={total.failed} color="red" />
        <SC icon={<AlertCircle className="w-5 h-5 text-slate-600"/>} label="완료 생산량 합계" value={`${totalKg.toLocaleString()}kg`} color="slate" />
      </div>
      <div className="flex gap-2">
        {(['all','ongoing','completed','failed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter===f?'bg-teal-600 text-white':'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'}`}>
            {f==='all'?'전체':f==='ongoing'?'진행 중':f==='completed'?'완료':'실패'}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['배치번호','제품','시작일','종료일','상태','목표(kg)','실적(kg)','달성률','품질','상세'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(batch => {
                const pct = batch.actualKg&&batch.targetKg ? Math.round((batch.actualKg/batch.targetKg)*100) : null;
                const qPass = batch.heavyMetal==='pass'&&batch.pathogen==='pass';
                const qFail = batch.heavyMetal==='fail'||batch.pathogen==='fail';
                return (
                  <tr key={batch.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{batch.batchNo}</td>
                    <td className="px-4 py-3 text-slate-700">{batch.product}</td>
                    <td className="px-4 py-3 text-slate-500">{batch.startDate}</td>
                    <td className="px-4 py-3 text-slate-500">{batch.endDate??'-'}</td>
                    <td className="px-4 py-3"><StatusBadge variant={batch.status} size="sm" /></td>
                    <td className="px-4 py-3 text-right">{batch.targetKg.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{batch.actualKg?.toLocaleString()??'-'}</td>
                    <td className="px-4 py-3 text-right">{pct!=null?<span className={`font-semibold ${pct>=90?'text-teal-600':pct>=70?'text-amber-600':'text-red-600'}`}>{pct}%</span>:'-'}</td>
                    <td className="px-4 py-3">{qPass?<span className="text-teal-600 text-xs font-medium">합격</span>:qFail?<span className="text-red-600 text-xs font-medium">불합격</span>:<span className="text-slate-400 text-xs">검사 중</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => setDetail(batch)} className="text-teal-600 text-xs hover:underline">보기</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold text-slate-800">{detail.batchNo}</h3><p className="text-sm text-slate-500">{detail.product}</p></div><StatusBadge variant={detail.status} /></div>
            <div className="space-y-3 text-sm">
              <R label="담당자" value={detail.manager} />
              <R label="시작일" value={detail.startDate} />
              <R label="종료일" value={detail.endDate??'-'} />
              <R label="목표 생산량" value={`${detail.targetKg.toLocaleString()} kg`} />
              <R label="실제 생산량" value={detail.actualKg?`${detail.actualKg.toLocaleString()} kg`:'-'} />
              {detail.dha&&<R label="DHA 함량" value={`${detail.dha}%`} />}
              {detail.epa&&<R label="EPA 함량" value={`${detail.epa}%`} />}
              {detail.protein&&<R label="단백질 함량" value={`${detail.protein}%`} />}
              <R label="중금속 검사" value={detail.heavyMetal??'-'} badge />
              <R label="병원균 검사" value={detail.pathogen??'-'} badge />
            </div>
            <button onClick={() => setDetail(null)} className="mt-5 w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SC({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string|number; color: string }) {
  const bg: Record<string,string> = { blue:'bg-blue-50 border-blue-100', teal:'bg-teal-50 border-teal-100', red:'bg-red-50 border-red-100', slate:'bg-slate-50 border-slate-200' };
  return <div className={`rounded-xl border p-4 ${bg[color]}`}><div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-slate-600">{label}</span></div><p className="text-2xl font-bold text-slate-800">{value}</p></div>;
}

function R({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return <div className="flex justify-between"><span className="text-slate-500">{label}</span>{badge?<StatusBadge variant={value} size="sm" />:<span className="font-medium text-slate-700">{value}</span>}</div>;
}
