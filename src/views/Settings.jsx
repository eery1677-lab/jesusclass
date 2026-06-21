import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Save } from 'lucide-react';

export default function Settings() {
  const { churchName, updateChurchName, churchContact, updateChurchContact } = useStore();
  const [localChurchName, setLocalChurchName] = useState(churchName);
  const [localPhone, setLocalPhone] = useState(churchContact?.phone || '');
  const [localAddress, setLocalAddress] = useState(churchContact?.address || '');
  const [localEmail, setLocalEmail] = useState(churchContact?.email || '');

  const handleSave = () => {
    updateChurchName(localChurchName);
    updateChurchContact({
      phone: localPhone,
      address: localAddress,
      email: localEmail
    });
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>앱 설정</h2>
      </div>

      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px', color: '#374151', borderBottom: '2px solid var(--border-light)', paddingBottom: '8px' }}>기본 설정</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px', fontWeight: 600 }}>
              교회 (또는 부서) 이름
            </label>
            <input 
              type="text" 
              value={localChurchName}
              onChange={(e) => setLocalChurchName(e.target.value)}
              className="form-input"
              placeholder="예: 양정교회 유초등부"
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              앱 메인 화면 상단에 표시될 이름을 설정합니다.
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px', color: '#374151', borderBottom: '2px solid var(--border-light)', paddingBottom: '8px' }}>연락처 및 오시는 길</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px', fontWeight: 600 }}>
              교회 사무실 전화번호
            </label>
            <input 
              type="text" 
              value={localPhone}
              onChange={(e) => setLocalPhone(e.target.value)}
              className="form-input"
              placeholder="예: 02-123-4567"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px', fontWeight: 600 }}>
              오시는 길 (주소)
            </label>
            <textarea 
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
              className="form-textarea"
              placeholder="예: 서울특별시 은혜구 축복로 100"
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px', fontWeight: 600 }}>
              대표 이메일
            </label>
            <input 
              type="text" 
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className="form-input"
              placeholder="예: jesusclass@church.com"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '1.05rem',
            fontWeight: 700,
            marginTop: '10px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
          onMouseOut={(e) => e.currentTarget.style.opacity = 1}
        >
          <Save size={20} />
          저장하기
        </button>
      </div>
    </div>
  );
}
