import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { LogIn, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

        <div style={styles.footer}>
          계정이 없으신가요? 관리자에게 문의해주세요.
        </div>
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
