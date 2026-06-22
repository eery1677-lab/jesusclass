import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Mic, 
  Send, 
  Play, 
  CheckCircle, 
  ChevronLeft,
  Camera,
  Upload,
  Film,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function KidsMemoryVerse({ setActiveTab }) {
  const { currentUser, students, submitMission, rejectMission } = useStore();
  const [verseText, setVerseText] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'voice' | 'media'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // 미디어 업로드 상태
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState(''); // 'image' | 'video'
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const student = students.find(s => s.id === currentUser.id);
  if (!student) return null;

  const missionStatus = student.dailyMissions.bible.status;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verseText.trim()) {
      // 텍스트 미션도 JSON 형태로 규격화하여 제출할 수 있음 (일관성 유지)
      const payload = JSON.stringify({
        type: 'text',
        text: verseText
      });
      submitMission(student.id, 'bible', payload);
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
    // 음성 녹음도 일관되게 JSON 페이로드로 제출 시뮬레이션
    const payload = JSON.stringify({
      type: 'voice',
      text: '[음성 녹음 제출 완료]'
    });
    submitMission(student.id, 'bible', payload);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMediaSubmit = (e) => {
    e.preventDefault();
    if (!mediaPreview) return;

    setUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // 미디어 정보 페이로드화하여 제출
        const payload = JSON.stringify({
          type: 'media',
          mediaType: mediaType,
          url: mediaPreview,
          text: `성경 암송 (${mediaType === 'video' ? '동영상' : '사진'} 제출)`
        });

        submitMission(student.id, 'bible', payload);
        
        // 초기화
        setUploading(false);
        setMediaFile(null);
        setMediaPreview('');
        setMediaType('');
      }
    }, 150);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 제출된 내역의 디코딩 및 미리보기 출력 헬퍼
  const renderSubmittedPreview = (content) => {
    if (!content) return null;
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === 'media') {
        return (
          <div style={styles.submittedPreviewContainer}>
            {parsed.mediaType === 'video' ? (
              <video src={parsed.url} controls style={styles.submittedMedia} />
            ) : (
              <img src={parsed.url} alt="제출 이미지" style={styles.submittedMedia} />
            )}
            <div style={styles.submittedPreviewLabel}>
              {parsed.mediaType === 'video' ? '🎥 동영상 숙제' : '🖼️ 인증 사진'}
            </div>
          </div>
        );
      } else if (parsed.type === 'voice') {
        return (
          <div style={styles.submittedVoiceContainer}>
            <span style={{ fontSize: '1.2rem' }}>🎙️</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>녹음된 암송 음성 파일</span>
          </div>
        );
      }
      return <div style={styles.submittedText}>“{parsed.text || content}”</div>;
    } catch (e) {
      // JSON 파싱 실패 시 예전 텍스트 형식으로 호환 처리
      return <div style={styles.submittedText}>“{content}”</div>;
    }
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

      <div style={styles.verseCard} className="card-solid hover-lift">
        <div style={styles.verseHeader}>
          <span style={styles.verseBadge}>이번 주 요절</span>
          <span style={styles.verseReference}>시편 23:1</span>
        </div>
        <h3 style={styles.verseText}>
          여호와는 나의 목자시니<br />
          내게 부족함이 없으리로다
        </h3>
      </div>

      <div style={styles.submitSection} className="hover-lift">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>암송 제출하기</h3>
        
        {missionStatus === 'completed' ? (
          <div style={styles.statusBox('success')}>
            <CheckCircle size={24} color="var(--accent-success)" />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-success)' }}>이번 주 암송 미션을 완료했어요!</div>
            
            {renderSubmittedPreview(student.dailyMissions.bible.textContent)}

            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>2 달란트를 받았습니다.</p>
          </div>
        ) : missionStatus === 'pending' ? (
          <div style={styles.statusBox('warning')}>
            <div className="animate-pulse-soft" style={{ fontSize: '1.8rem' }}>⏳</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#D97706' }}>선생님이 확인하고 있어요.</div>
            
            {renderSubmittedPreview(student.dailyMissions.bible.textContent)}

            <p style={{ margin: '8px 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>확인이 완료되면 달란트가 지급됩니다.</p>
            <button 
              className="btn hover-lift" 
              style={{ 
                padding: '8px 16px', 
                fontSize: '0.85rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                fontWeight: 700
              }}
              onClick={() => {
                // 이전 데이터 복구 시도
                const content = student.dailyMissions.bible.textContent;
                try {
                  const parsed = JSON.parse(content);
                  if (parsed.type === 'text') setVerseText(parsed.text);
                } catch (e) {
                  setVerseText(content || '');
                }
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
                <BookOpen size={15} /> 직접 쓰기
              </button>
              <button 
                type="button" 
                style={{...styles.tabBtn, ...(inputMode === 'voice' ? styles.activeTab : {})}}
                onClick={() => setInputMode('voice')}
              >
                <Mic size={15} /> 녹음하기
              </button>
              <button 
                type="button" 
                style={{...styles.tabBtn, ...(inputMode === 'media' ? styles.activeTab : {})}}
                onClick={() => setInputMode('media')}
              >
                <Camera size={15} /> 영상/사진 제출
              </button>
            </div>
            
            {inputMode === 'text' && (
              <form onSubmit={handleSubmit}>
                <textarea
                  className="neon-input form-textarea"
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
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    opacity: verseText.trim() ? 1 : 0.5,
                    cursor: verseText.trim() ? 'pointer' : 'default',
                  }}
                  disabled={!verseText.trim()}
                >
                  <Send size={18} /> 제출하기
                </button>
              </form>
            )}

            {inputMode === 'voice' && (
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
                
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {!isRecording ? "버튼을 눌러 말씀 암송을 시작하세요" : "녹음을 마치려면 버튼을 다시 누르세요"}
                </p>
              </div>
            )}

            {inputMode === 'media' && (
              <div style={styles.mediaUploadArea}>
                {uploading ? (
                  <div style={styles.uploadProgressContainer}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                      선생님께 숙제 전송 중... ({uploadProgress}%)
                    </div>
                    <div style={styles.progressBarWrapper}>
                      <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : mediaPreview ? (
                  <div style={styles.previewContainer}>
                    <div style={styles.previewHeader}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>선택된 파일 미리보기</span>
                      <button 
                        type="button" 
                        style={styles.deleteBtn}
                        onClick={() => {
                          setMediaFile(null);
                          setMediaPreview('');
                          setMediaType('');
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div style={styles.mediaContainer}>
                      {mediaType === 'video' ? (
                        <video src={mediaPreview} controls style={styles.previewMedia} />
                      ) : (
                        <img src={mediaPreview} alt="선택 이미지" style={styles.previewMedia} />
                      )}
                    </div>

                    <button 
                      type="button" 
                      onClick={handleMediaSubmit}
                      style={{
                        ...styles.submitBtn,
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        marginTop: '16px'
                      }}
                    >
                      <Upload size={18} /> 숙제 제출하기
                    </button>
                  </div>
                ) : (
                  <label style={styles.dropZone} className="hover-lift">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange}
                    />
                    <Upload size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '6px' }}>영상 또는 사진 올리기</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      클릭하여 성경 암송 비디오나 사진을 선택하세요
                    </p>
                  </label>
                )}
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
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
  },
  tabBtn: {
    flex: 1,
    padding: '10px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '12px',
    border: '1.5px solid var(--border-light)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontSize: '0.75rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-smooth)',
  },
  activeTab: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    borderRadius: '16px',
    background: 'var(--bg-app)',
    color: 'var(--text-main)',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '16px',
    fontWeight: 600,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  voiceRecordArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0',
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
    background: type === 'success' ? 'var(--accent-success-bg)' : 'rgba(245, 158, 11, 0.08)',
    border: `1.5px solid ${type === 'success' ? 'var(--accent-success)' : '#F59E0B'}`,
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  }),
  submittedText: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: '8px 0',
    lineHeight: '1.5',
    wordBreak: 'keep-all',
  },
  // 미디어 업로드 스타일
  mediaUploadArea: {
    padding: '8px 0',
  },
  dropZone: {
    width: '100%',
    height: '180px',
    border: '2.5px dashed var(--border-strong)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: 'var(--bg-app)',
    transition: 'var(--transition-smooth)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  deleteBtn: {
    background: '#FEF2F2',
    color: '#EF4444',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  mediaContainer: {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1.5px solid var(--border-light)',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '240px',
  },
  previewMedia: {
    width: '100%',
    maxHeight: '240px',
    objectFit: 'contain',
  },
  uploadProgressContainer: {
    padding: '30px 20px',
    textAlign: 'center',
  },
  progressBarWrapper: {
    width: '100%',
    height: '10px',
    background: 'var(--border-light)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'var(--primary)',
    transition: 'width 0.15s ease',
  },
  // 제출된 내역 미리보기 스타일
  submittedPreviewContainer: {
    width: '100%',
    maxWidth: '280px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1.5px solid var(--border-light)',
    background: '#000',
    boxShadow: 'var(--shadow-card)',
    marginTop: '6px',
  },
  submittedMedia: {
    width: '100%',
    maxHeight: '180px',
    objectFit: 'cover',
    display: 'block',
  },
  submittedPreviewLabel: {
    padding: '8px 12px',
    background: 'var(--bg-card)',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    borderTop: '1px solid var(--border-light)',
  },
  submittedVoiceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-light)',
    marginTop: '6px',
  }
};
