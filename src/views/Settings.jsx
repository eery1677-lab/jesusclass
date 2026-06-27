import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { Save, LogOut, User, Shield } from 'lucide-react';

export default function Settings({ setActiveTab }) {
  const { churchName, updateChurchName, churchContact, updateChurchContact, setMoreMenuOpen } = useStore();
  const { firebaseUser, userRole, signOut, isConfigured } = useAuth();
  const [localChurchName, setLocalChurchName] = useState(churchName);
  const [localPhone, setLocalPhone] = useState(churchContact?.phone || '');
  const [localAddress, setLocalAddress] = useState(churchContact?.address || '');
  const [localEmail, setLocalEmail] = useState(churchContact?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateChurchName(localChurchName);
    await updateChurchContact({ phone: localPhone, address: localAddress, email: localEmail });
    setSaving(false);
    alert('설정이 저장되었습니다.');
    
    // 저장 후 원래 대시보드로 돌아가면서 더보기 메인 화면 띄워주기
    if (setActiveTab) {
      if (userRole === 'teacher') {
        setActiveTab('teacher-dashboard');
      } else {
        setActiveTab('kids-dashboard');
      }
    }
    if (setMoreMenuOpen) {
      setMoreMenuOpen(true);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    await signOut();
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>앱 설정</h2>
      </div>

      {/* 계정 정보 카드 */}
      {isConfigured && firebaseUser && (
        <div className="card" style={{ padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {firebaseUser.photoURL
            ? <img src={firebaseUser.photoURL} alt="프로필" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border-color)' }} />
            : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={24} color="white" /></div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              {firebaseUser.displayName || '사용자'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{firebaseUser.email}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.12)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
            <Shield size={12} />
            {userRole === 'teacher' ? '교사' : '학부모'}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px', color: 'var(--text-main)', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>기본 설정</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '8px', fontWeight: 600 }}>교회 (또는 부서) 이름</label>
            <input type="text" value={localChurchName} onChange={(e) => setLocalChurchName(e.target.value)} className="form-input" placeholder="예: 양정교회 유초등부" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>앱 메인 화면 상단에 표시될 이름을 설정합니다.</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px', color: 'var(--text-main)', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>연락처 및 오시는 길</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '8px', fontWeight: 600 }}>교회 사무실 전화번호</label>
            <input type="text" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} className="form-input" placeholder="예: 02-123-4567" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '8px', fontWeight: 600 }}>오시는 길 (주소)</label>
            <textarea value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} className="form-textarea" placeholder="예: 서울특별시 은혜구 축복로 100" style={{ minHeight: '80px', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '8px', fontWeight: 600 }}>대표 이메일</label>
            <input type="text" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} className="form-input" placeholder="예: jesusclass@church.com" />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={20} />
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      {isConfigured && (
        <button
          onClick={handleSignOut}
          style={{ marginTop: '16px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'transparent', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', padding: '14px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      )}

      {!isConfigured && (
        <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', fontSize: '0.83rem', color: '#fbbf24', lineHeight: 1.6 }}>
          ⚡ 현재 <strong>데모 모드</strong>로 실행 중입니다.<br />
          .env 파일에 Firebase 설정값을 입력하면 실제 DB와 연동됩니다.
        </div>
      )}
    </div>
  );
}
