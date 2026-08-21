'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-sans)' }}>
      {/* 좌측 브랜드 패널 */}
      <div style={{
        width: '45%',
        background: 'var(--navy)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }} className="hidden-mobile">
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(11,184,154,0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(108,92,231,0.1) 0%, transparent 50%)
          `,
        }} />
        {/* 격자 패턴 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div style={{ position: 'relative', maxWidth: 380, textAlign: 'center' }}>
          {/* 로고 마크 */}
          <div style={{
            width: 72, height: 72,
            borderRadius: 18,
            background: 'var(--mint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 8px 24px rgba(11,184,154,0.3)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="13" r="7" stroke="white" strokeWidth="2.5"/>
              <path d="M11 13 C11 13 7 23 7 30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M25 13 C25 13 29 23 29 30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="18" y1="20" x2="18" y2="31" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="13" y1="30" x2="23" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>바이오션</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: '0 0 40px', lineHeight: 1.6 }}>
            모이나(물벼룩) 생산·수출 통합<br/>모니터링 플랫폼
          </p>

          {/* KPI 지표 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: '2026 수출목표', value: '$200K' },
              { label: '생산 목표', value: '20톤' },
              { label: '수출 국가', value: '5개국' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '16px 10px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--mint)', lineHeight: 1.2 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 48 }}>
            만든이: 바이오션 · BIOCEN365
          </p>
        </div>
      </div>

      {/* 우측 폼 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        background: 'var(--bg)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              로그인
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-3)', margin: 0 }}>
              계정 정보를 입력하거나 바로 로그인하세요.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em' }}>
                이메일
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일 또는 아이디"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-1)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--mint)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em' }}>
                비밀번호
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  style={{
                    width: '100%',
                    padding: '11px 44px 11px 14px',
                    borderRadius: 'var(--r-md)',
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-1)',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--mint)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 'var(--r-md)',
                background: 'var(--mint)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '0.01em',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 14px rgba(11,184,154,0.35)',
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              로그인 <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginTop: 24 }}>
            계정이 없으신가요?{' '}
            <a href="/signup" style={{ color: 'var(--mint)', fontWeight: 600, textDecoration: 'none' }}>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
