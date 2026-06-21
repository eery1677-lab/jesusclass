import React, { useState, useEffect } from 'react';
import { BookOpen, Mic, Send, Play, CheckCircle, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function KidsMemoryVerse({ setActiveTab }) {
  const { currentUser, students, submitMission, rejectMission } = useStore();
  const [verseText, setVerseText] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'voice'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const student = students.find(s => s.id === currentUser.id);
  if (!student) return null;

  const missionStatus = student.dailyMissions.bible.status;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verseText.trim()) {
      submitMission(student.id, 'bible', verseText);
      setVerseText('');
    }
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate submitting the voice record
    submitMission(student.id, 'bible', '[음성 녹음 제출 완료]');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <BookOpen size={24} color="#10B981" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>이번 주 암송 요절</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>하나님 말씀을 마음에 새겨요 (+2달란트)</p>
          </div>
        </div>
      </header>

      <div style={styles.verseCard} className="card-solid">
        <div style={styles.verseHeader}>
          <span style={styles.verseBadge}>이번 주 요절</span>
          <span style={styles.verseReference}>시편 23:1</span>
        </div>
        <h3 style={styles.verseText}>
          여호와는 나의 목자시니<br />
          내게 부족함이 없으리로다
        </h3>
      </div>

      <div style={styles.submitSection}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>암송 제출하기</h3>
        
        {missionStatus === 'completed' ? (
          <div style={styles.statusBox('success')}>
            <CheckCircle size={24} color="var(--accent-success)" />
            <div style={{ fontWeight: 600 }}>이번 주 암송 미션을 완료했어요!</div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>2 달란트를 받았습니다.</p>
          </div>
        ) : missionStatus === 'pending' ? (
          <div style={styles.statusBox('warning')}>
            <div className="animate-pulse-soft" style={{ fontSize: '1.5rem' }}>⏳</div>
            <div style={{ fontWeight: 600 }}>선생님이 확인하고 있어요.</div>
            <p style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>확인이 완료되면 달란트가 지급됩니다.</p>
            <button 
              className="btn hover-lift" 
              style={{ 
                padding: '8px 16px', 
                fontSize: '0.85rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700
              }}
              onClick={() => {
                setVerseText(student.dailyMissions.bible.textContent || '');
                rejectMission(student.id, 'bible');
              }}
            >
              제출 취소하고 수정하기
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.tabs}>
              <button 
                type="button" 
                style={{...styles.tabBtn, ...(inputMode === 'text' ? styles.activeTab : {})}}
                onClick={() => setInputMode('text')}
              >
                <BookOpen size={16} /> 직접 쓰기
              </button>
              <button 
                type="button" 
                style={{...styles.tabBtn, ...(inputMode === 'voice' ? styles.activeTab : {})}}
                onClick={() => setInputMode('voice')}
              >
                <Mic size={16} /> 녹음하기
              </button>
            </div>
            
            {inputMode === 'text' ? (
              <form onSubmit={handleSubmit}>
                <textarea
                  className="neon-input"
                  style={styles.textarea}
                  placeholder="외운 말씀을 또박또박 적어보세요..."
                  value={verseText}
                  onChange={e => setVerseText(e.target.value)}
                  rows={4}
                />
                
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitBtn,
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    opacity: verseText.trim() ? 1 : 0.5,
                    cursor: verseText.trim() ? 'pointer' : 'default',
                  }}
                  disabled={!verseText.trim()}
                >
                  <Send size={18} /> 제출하기
                </button>
              </form>
            ) : (
              <div style={styles.voiceRecordArea}>
                <div style={styles.recordingTime}>
                  {isRecording ? formatTime(recordingTime) : "00:00"}
                </div>
                {isRecording && <div style={styles.recordingWave}>🎙️ 녹음 중...</div>}
                
                {!isRecording ? (
                  <button type="button" style={styles.recordStartBtn} onClick={handleStartRecording}>
                    <Mic size={32} color="white" />
                  </button>
                ) : (
                  <button type="button" style={styles.recordStopBtn} onClick={handleStopRecording}>
                    <div style={styles.stopSquare}></div>
                  </button>
                )}
                
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {!isRecording ? "버튼을 눌러 말씀 암송을 시작하세요" : "녹음을 마치려면 버튼을 다시 누르세요"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeUp 0.4s ease-out forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-main)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    background: '#D1FAE5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseCard: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: '30px',
    marginBottom: '30px',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
    textAlign: 'center',
  },
  verseHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  verseBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  verseReference: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  verseText: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 800,
    lineHeight: '1.6',
    wordBreak: 'keep-all',
  },
  submitSection: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  activeTab: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--accent-success)',
    border: '1px solid var(--accent-success)',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '16px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  voiceRecordArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 0',
  },
  recordingTime: {
    fontSize: '2.5rem',
    fontWeight: 800,
    fontFamily: 'monospace',
    color: 'var(--text-main)',
    marginBottom: '10px',
  },
  recordingWave: {
    color: '#EF4444',
    fontWeight: 700,
    marginBottom: '20px',
    animation: 'pulse 1s infinite alternate',
  },
  recordStartBtn: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#EF4444',
    border: '4px solid #FCA5A5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
  },
  recordStopBtn: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '4px solid #EF4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    animation: 'pulse 1.5s infinite',
  },
  stopSquare: {
    width: '24px',
    height: '24px',
    backgroundColor: '#EF4444',
    borderRadius: '4px',
  },
  statusBox: (type) => ({
    background: type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    border: `1px solid ${type === 'success' ? 'var(--accent-success)' : 'var(--accent-warning)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  })
};
