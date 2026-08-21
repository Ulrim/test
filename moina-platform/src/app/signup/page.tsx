'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Microscope, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'operator', dept: '' });
  const [mismatch, setMismatch] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setMismatch(true); return; }
    setMismatch(false);
    setDone(true);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-sm p-8">
        <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">회원가입 완료</h2>
        <p className="text-slate-500 text-sm mb-6">가입 신청이 접수되었습니다. 관리자 승인 후 로그인 가능합니다.</p>
        <button onClick={() => router.push('/login')} className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 text-sm">로그인으로 이동</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Microscope className="w-7 h-7 text-teal-600" />
          <div><p className="font-bold text-teal-700">바이오션</p><p className="text-xs text-slate-500">모이나 모니터링 플랫폼</p></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">회원가입</h2>
        <form onSubmit={handle} className="space-y-4">
          {[{ label: '이름', key: 'name', type: 'text', placeholder: '실명을 입력하세요' }, { label: '이메일', key: 'email', type: 'email', placeholder: 'example@biocen365.com' }, { label: '비밀번호', key: 'password', type: 'password', placeholder: '8자 이상' }, { label: '비밀번호 확인', key: 'confirm', type: 'password', placeholder: '비밀번호를 다시 입력' }].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${(key === 'confirm' || key === 'password') && mismatch ? 'border-red-400' : 'border-slate-200'}`} />
              {key === 'confirm' && mismatch && <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">권한</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
              <option value="admin">관리자</option>
              <option value="operator">운영자</option>
              <option value="viewer">조회자</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">소속 부서</label>
            <input type="text" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} placeholder="예: 생산팀, 품질관리팀" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors text-sm">가입 신청</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">이미 계정이 있으신가요?{' '}<a href="/login" className="text-teal-600 font-medium hover:underline">로그인</a></p>
      </div>
    </div>
  );
}
