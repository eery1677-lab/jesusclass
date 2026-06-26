import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signInWithGoogle, selectRole, needsRoleSelection, firebaseUser, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = async (role) => {
    setIsLoading(true);
    try {
      await selectRole(role);
    } catch (err) {
      setError('역할 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 역할 선택 화면
  if (needsRoleSelection) {
    return (
      <div style={styles.container}>
        <div style={styles.bgGlow1} />
        <div style={styles.bgGlow2} />
        <div style={styles.card}>
          <div style={styles.avatarBox}>
            <span style={{ fontSize: '2rem' }}>
              {firebaseUser?.photoURL
                ? <img src={firebaseUser.photoURL} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%' }} />
                : '👤'}
            </span>
          </div>
          <h2 style={styles.roleTitle}>어떤 역할로 이용하시나요?</h2>
          <p style={styles.roleSubtitle}>
            <strong>{firebaseUser?.displayName || '사용자'}</strong> 님, 처음 접속하셨습니다.<br />
            역할을 선택하면 다음부터는 자동으로 로그인됩니다.
          </p>

          <div style={styles.roleGrid}>
            <button
              onClick={() => handleSelectRole('teacher')}
              disabled={isLoading}
              style={styles.roleCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <span style={styles.roleIcon}>👩‍🏫</span>
              <strong style={styles.roleLabel}>교사</strong>
              <span style={styles.roleDesc}>학생 관리, 알림장·앨범·달란트 운영</span>
            </button>

            <button
              onClick={() => handleSelectRole('student')}
              disabled={isLoading}
              style={styles.roleCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <span style={styles.roleIcon}>🙋</span>
              <strong style={styles.roleLabel}>학부모 / 학생</strong>
              <span style={styles.roleDesc}>주보 확인, 알림장 열람, 1:1 톡</span>
            </button>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
        </div>
      </div>
    );
  }

  // 메인 로그인 화면
  return (
    <div style={styles.container}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.bgPattern} />

      <div style={styles.card}>
        {/* 로고 */}
        <div style={styles.logoWrap}>
          <div style={styles.crossIcon}>✝</div>
        </div>

        <h1 style={styles.appTitle}>예수클래스</h1>
        <p style={styles.appSubtitle}>교사와 학부모를 잇는<br />스마트 주일학교 앱</p>

        <div style={styles.divider} />

        {!isConfigured && (
          <div style={styles.demoBanner}>
            <span>⚡</span>
            <span>Firebase 미설정 — 데모 모드로 실행 중입니다.<br />.env 파일에 Firebase 설정을 입력하면 실제 연동됩니다.</span>
          </div>
        )}

        {isConfigured && (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{ ...styles.googleBtn, opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <span style={styles.spinner} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.5 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.6 4.8-4.8 6.4l6.2 5.2C40.5 36.2 44 30.6 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
              )}
              <span>{isLoading ? '로그인 중...' : 'Google로 계속하기'}</span>
            </button>

            {error && <p style={styles.errorText}>{error}</p>}

            <p style={styles.loginNote}>
              교사 계정은 담당 목사님/부장님께 문의하세요.
            </p>
          </>
        )}

        <div style={styles.features}>
          {['📋 주보 & 알림장', '🏆 달란트 관리', '💬 1:1 소통 톡', '📸 활동 앨범'].map(f => (
            <span key={f} style={styles.featureChip}>{f}</span>
          ))}
        </div>
      </div>

      <p style={styles.footer}>© 2026 예수클래스 · JesusClass</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100dvh',
    background: 'var(--bg-main)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
    bottom: '-80px',
    left: '-80px',
    pointerEvents: 'none',
  },
  bgPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '28px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    marginBottom: '20px',
  },
  crossIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
    color: 'white',
    boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
  },
  appTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: '0 0 8px',
    letterSpacing: '-0.5px',
  },
  appSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '0 0 24px',
  },
  demoBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.25)',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '0.82rem',
    color: '#fbbf24',
    lineHeight: 1.6,
    width: '100%',
    marginBottom: '8px',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    color: 'var(--text-main)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  errorText: {
    color: '#f87171',
    fontSize: '0.85rem',
    textAlign: 'center',
    margin: '4px 0 8px',
  },
  loginNote: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    margin: '0 0 20px',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  featureChip: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  footer: {
    marginTop: '32px',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.2)',
    position: 'relative',
    zIndex: 1,
  },
  // 역할 선택 화면
  avatarBox: {
    marginBottom: '16px',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.15)',
    border: '2px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roleTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: '0 0 8px',
    textAlign: 'center',
  },
  roleSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: '0 0 28px',
  },
  roleGrid: {
    display: 'flex',
    gap: '16px',
    width: '100%',
  },
  roleCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '24px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    color: 'var(--text-main)',
  },
  roleIcon: { fontSize: '2.5rem' },
  roleLabel: { fontSize: '1rem', fontWeight: 700 },
  roleDesc: { fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 },
};
