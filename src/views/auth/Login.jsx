import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { LogIn, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 자녀 코드 로그인 관련 상태
  const [isChildMode, setIsChildMode] = useState(false);
  const [childCode, setChildCode] = useState('');
  const { loginWithChildCode } = useStore();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('구글 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleChildLogin = async (e) => {
    e.preventDefault();
    if (!childCode || childCode.length !== 6) {
      setError('6자리 접속 코드를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const success = await loginWithChildCode(childCode);
    if (!success) {
      setError('유효하지 않은 코드입니다. 코드를 다시 확인해주세요.');
      setIsLoading(false);
    }
  };

  const { currentUser, selectRole, logout } = useStore();

  const handleSelectRole = async (role) => {
    setIsLoading(true);
    setError('');
    try {
      await selectRole(role);
    } catch (err) {
      setError('역할 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 역할 선택 UI 분기 추가
  if (currentUser && currentUser.needsRoleSelection) {
    return (
      <div style={styles.container}>
        <div style={styles.card} className="card-solid animate-fade-in hover-lift">
          <div style={styles.header}>
            <div style={styles.logoCircle}>
              <span style={{ fontSize: '2rem' }}>👤</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>어떤 역할로 이용하시나요?</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 28px' }}>
              <strong>{currentUser.name || currentUser.email}</strong> 님, 환영합니다!<br />
              역할을 선택하시면 다음부터는 자동으로 로그인됩니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <button
              onClick={() => handleSelectRole('teacher')}
              disabled={isLoading}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '24px 16px',
                background: 'var(--bg-main)',
                border: '2px solid var(--border-color)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                color: 'var(--text-main)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <span style={{ fontSize: '2.5rem' }}>👩‍🏫</span>
              <strong style={{ fontSize: '1rem', fontWeight: 700 }}>교사</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                학생 관리, 알림장·앨범·달란트 운영
              </span>
            </button>

            <button
              onClick={() => handleSelectRole('parent')}
              disabled={isLoading}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '24px 16px',
                background: 'var(--bg-main)',
                border: '2px solid var(--border-color)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                color: 'var(--text-main)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <span style={{ fontSize: '2.5rem' }}>🙋</span>
              <strong style={{ fontSize: '1rem', fontWeight: 700 }}>학부모 / 학생</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                주보 확인, 알림장 열람, 1:1 톡
              </span>
            </button>
          </div>

          {error && (
            <div style={{ ...styles.errorBox, marginTop: '20px', marginBottom: 0 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={logout}
            style={{...styles.googleBtn, border: 'none', marginTop: '24px', background: 'transparent', color: 'var(--text-muted)'}}
          >
            취소하고 로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="card-solid animate-fade-in hover-lift">
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <span style={{ fontSize: '2rem' }}>⛪</span>
          </div>
          <h1 style={styles.title}>Jesus Class</h1>
          <p style={styles.subtitle}>주일학교의 모든 것, 실시간으로 연결되다</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isChildMode ? (
          <form onSubmit={handleChildLogin} style={styles.form}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                부모님 앱에서 발급받은 6자리 숫자를 입력하세요.
              </p>
            </div>
            
            <div style={styles.inputGroup} className="neon-input-container">
              <Lock size={18} style={styles.inputIcon} color="var(--primary)" />
              <input 
                type="text" 
                placeholder="6자리 숫자 코드 (예: 123456)" 
                value={childCode}
                onChange={(e) => setChildCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                style={{...styles.input, textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px'}}
              />
            </div>

            <button 
              type="submit" 
              style={{...styles.loginBtn, background: 'var(--primary)'}}
              disabled={isLoading}
            >
              {isLoading ? '접속 중...' : '자녀 코드로 시작하기'}
            </button>
            
            <button 
              type="button" 
              onClick={() => { setIsChildMode(false); setError(''); }}
              style={{...styles.googleBtn, border: 'none', marginTop: '8px'}}
            >
              이전으로 돌아가기
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleEmailLogin} style={styles.form}>
              <div style={styles.inputGroup} className="neon-input-container">
                <Mail size={18} style={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="이메일 주소" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup} className="neon-input-container">
                <Lock size={18} style={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              <button 
                type="submit" 
                style={styles.loginBtn}
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '이메일로 로그인'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>또는</span>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              style={styles.googleBtn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google 계정으로 계속하기
            </button>

            <button 
              onClick={() => { setIsChildMode(true); setError(''); }}
              style={{...styles.googleBtn, marginTop: '12px', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--primary)', border: '1px solid var(--primary)'}}
            >
              <User size={18} />
              자녀 코드로 접속하기 (아이용)
            </button>

            <div style={styles.footer}>
              계정이 없으신가요? 관리자에게 문의해주세요.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-main)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--bg-card)',
    borderRadius: '24px',
    padding: '40px 30px',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  logoCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(79, 70, 229, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: 'var(--neon-glow)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-1) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0 16px',
    transition: 'var(--transition-smooth)',
  },
  inputIcon: {
    color: 'var(--text-muted)',
    marginRight: '12px',
  },
  input: {
    flex: 1,
    height: '48px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.95rem',
  },
  loginBtn: {
    height: '50px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '24px 0',
  },
  dividerText: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    padding: '0 12px',
    background: 'var(--bg-card)',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto',
  },
  googleBtn: {
    width: '100%',
    height: '50px',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'var(--transition-smooth)',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--accent-error)',
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    marginBottom: '20px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  }
};
