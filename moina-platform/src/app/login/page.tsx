'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Microscope, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-900 via-slate-900 to-teal-800 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <Microscope className="w-10 h-10 text-teal-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-teal-300">바이오션</h1>
          <p className="text-xl font-semibold mb-4 text-white">모이나 생산·수출 모니터링 플랫폼</p>
          <p className="text-slate-400 text-sm leading-relaxed">모이나(물벼록) 배양·생산 현황, 품질 분석, 수출 실적, KPI 달성도를 실시간으로 통합 관리하는 스마트 플랫폼입니다.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[{ label: '2026 수출목표', value: '$200K' }, { label: '생산목표', value: '20톤' }, { label: '수출국가', value: '5개국' }].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xl font-bold text-teal-300">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Microscope className="w-7 h-7 text-teal-600" />
            <div><p className="font-bold text-teal-700">바이오션</p><p className="text-xs text-slate-500">모이나 모니터링 플랫폼</p></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">로그인</h2>
          <p className="text-slate-500 text-sm mb-8">관리자 계정으로 로그인하세요.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일 또는 아이디" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm pr-10" />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors text-sm">로그인</button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">계정이 없으신가요?{' '}<a href="/signup" className="text-teal-600 font-medium hover:underline">회원가입</a></p>
          <p className="text-center text-xs text-slate-400 mt-8">만든이: <span className="font-medium text-slate-500">바이오션</span></p>
        </div>
      </div>
    </div>
  );
}
