'use client';

import { useState } from 'react';
import { mockExportRecords, mockBuyers } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, DollarSign, Ship, Users } from 'lucide-react';

const countryLabel: Record<string,string> = { VN:'베트남', CN:'중국', TH:'태국', PH:'필리핀', JP:'일본', KR:'대한민국' };
const countryFlag: Record<string,string> = { VN:'🆻🇳', CN:'🇨🇳', TH:'🇹🇭', PH:'🇵🇭', JP:'🇯🇵', KR:'🇰🇷' };

export default function ExportPage() {
  const [tab, setTab] = useState<'records'|'buyers'>('records');
  const delivered = mockExportRecords.filter(e=>e.status==='delivered');
  const totalUsd = delivered.reduce((s,e)=>s+e.totalUsd,0);
  const totalKg = delivered.reduce((s,e)=>s+e.quantityKg,0);
  const countryData = Object.entries(mockExportRecords.filter(e=>e.status==='delivered').reduce((acc,e)=>{ acc[e.country]=(acc[e.country]??0)+e.totalUsd; return acc; },{} as Record<string,number>)).map(([c,usd])=>({ country: countryLabel[c]??c, usd }));

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div><h1 className="text-xl font-bold text-slate-800">수출 실적 관리</h1><p className="text-sm text-slate-500 mt-0.5">국가별 수출 계약·낙품 현황 및 바이어 관리</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SC icon={<DollarSign className="w-5 h-5 text-teal-600"/>} label="낙품완료 수출액" value={`$${totalUsd.toLocaleString()}`} sub={`목표 $200,000 · ${((totalUsd/200000)*100).toFixed(0)}%`} />
        <SC icon={<Ship className="w-5 h-5 text-blue-600"/>} label="낙품완료 수출량" value={`${totalKg.toLocaleString()}kg`} sub={`${delivered.length}건 낙품 완료`} />
        <SC icon={<Globe className="w-5 h-5 text-indigo-600"/>} label="수출 국가 수" value={`${new Set(mockExportRecords.map(e=>e.country)).size}개국`} sub="목표 5개국" />
        <SC icon={<Users className="w-5 h-5 text-amber-600"/>} label="계약 바이어" value={`${mockBuyers.filter(b=>b.status==='active').length}개사`} sub={`협상 중 ${mockBuyers.filter(b=>b.status==='negotiating').length}개사`} />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">국가별 낙품완료 수출액 (USD)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={countryData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="country" tick={{fontSize:12}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`,'수출액']} />
            <Bar dataKey="usd" fill="#0d9488" radius={[4,4,0,0]} name="수출액(USD)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {(['records','buyers'] as const).map(t=>(<button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===t?'bg-white text-teal-700 shadow-sm':'text-slate-600 hover:text-slate-800'}`}>{t==='records'?'수출 계약·낙품':'바이어 목록'}</button>))}
      </div>
      {tab==='records' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200"><tr>{['바이어','국가','제품','수량(kg)','단가(USD)','엑수(USD)','인코터스','계약일','낙품일','상태'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {mockExportRecords.map(rec=>(
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{rec.buyer}</td>
                    <td className="px-4 py-3">{countryFlag[rec.country]} {countryLabel[rec.country]}</td>
                    <td className="px-4 py-3 text-slate-600">{rec.product}</td>
                    <td className="px-4 py-3 text-right">{rec.quantityKg.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">${rec.pricePerKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-semibold">${rec.totalUsd.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center"><span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{rec.incoterms}</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{rec.contractDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{rec.deliveryDate??'-'}</td>
                    <td className="px-4 py-3"><StatusBadge variant={rec.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {mockBuyers.map(buyer=>(
            <div key={buyer.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div><p className="font-semibold text-slate-800">{buyer.name}</p><p className="text-xs text-slate-500">{countryFlag[buyer.country]} {countryLabel[buyer.country]}</p></div>
                <StatusBadge variant={buyer.status==='active'?'normal':buyer.status==='negotiating'?'caution':'pending'} label={buyer.status==='active'?'활성':buyer.status==='negotiating'?'협상 중':'잠재'} size="sm" />
              </div>
              <div className="flex gap-3 text-xs text-slate-500 mt-2"><StatusBadge variant={buyer.type} size="sm" /><span>최근 접촉: {buyer.lastContact}</span></div>
              {buyer.totalUsd>0&&<p className="text-sm font-bold text-teal-700 mt-2">${buyer.totalUsd.toLocaleString()} 거래 완료</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SC({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return <div className="bg-white rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-slate-500">{label}</span></div><p className="text-xl font-bold text-slate-800">{value}</p><p className="text-xs text-slate-400 mt-1">{sub}</p></div>;
}
