import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Save } from 'lucide-react';

export default function Settings() {
  const { churchName, updateChurchName } = useStore();
  const [localChurchName, setLocalChurchName] = useState(churchName);

  const handleSave = () => {
    updateChurchName(localChurchName);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>앱 설정</h2>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px', color: '#374151' }}>기본 설정</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px', fontWeight: 500 }}>
            교회 (또는 부서) 이름
          </label>
          <input 
            type="text" 
            value={localChurchName}
            onChange={(e) => setLocalChurchName(e.target.value)}
            className="form-input"
            placeholder="예: 양정교회 유초등부"
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            앱 메인 화면 상단에 표시될 이름을 설정합니다.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          저장하기
        </button>
      </div>
    </div>
  );
}
