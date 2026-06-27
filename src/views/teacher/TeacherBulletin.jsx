import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { FileText, Plus, Send, Trash2, ArrowLeft, Image as ImageIcon, X, Loader } from 'lucide-react';
import { uploadImage } from '../../utils/uploadImage';

export default function TeacherBulletin({ setActiveTab }) {
  const { bulletins, addBulletin, deleteBulletin } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const url = await uploadImage(file, 'bulletins', { maxSize: 1600, quality: 0.85 });
      setImagePreview(url);
    } catch (err) {
      console.error('주보 이미지 업로드 실패:', err);
      setUploadError('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateBulletin = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || (!newContent.trim() && !imagePreview)) return;

    await addBulletin(newTitle, newContent, imagePreview);
    setNewTitle('');
    setNewContent('');
    handleRemoveImage();
  };

  return (
    <div style={styles.container}>
      <section style={styles.headerPanel} className="card-solid hover-lift">
        <button 
          className="home-back-btn animate-pulse-border"
          onClick={() => setActiveTab('teacher-dashboard')} 
        >
          <ArrowLeft size={20} color="var(--primary)" />
        </button>
        <FileText size={24} style={{ color: '#8B5CF6' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#8B5CF6' }}>📜 모바일 주보 발행</h2>
          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'keep-all', lineHeight: '1.4' }}>
            이번 주일 예배 순서, 말씀, 광고가 담긴 주보를 발행하세요. 이미지나 텍스트로 등록할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Write New Bulletin Form */}
      <section style={styles.section} className="card-solid hover-lift">
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} style={{ color: '#8B5CF6' }} />
          <span>새 주보 등록</span>
        </h3>
        
        <form onSubmit={handleCreateBulletin} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="bulletin-title">주보 제목</label>
            <input
              id="bulletin-title"
              type="text"
              className="form-input"
              placeholder="예: 6월 3주차 주일학교 주보"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">주보 이미지 (선택)</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed var(--border-color)', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
              ⚠️ 갤럭시 울트라 등 <b>고해상도 모바일 원본 사진</b>은 용량이 커 업로드가 실패할 수 있습니다. 실패 시 <b>화면을 캡처(스크린샷)한 사진</b>이나 <b>카카오톡 다운로드 사진</b>을 이용하시면 즉시 업로드됩니다.
            </p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              ref={fileInputRef}
              disabled={isUploading}
              style={{ display: 'none' }}
              id="bulletin-image-upload"
            />
            
            {isUploading ? (
              <div style={{...styles.uploadBtn, cursor: 'not-allowed', opacity: 0.7}}>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                <span>업로드 중... 잠시만 기다려주세요</span>
              </div>
            ) : imagePreview ? (
              <div style={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="주보 미리보기" style={styles.imagePreview} />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  style={styles.removeImageBtn}
                >
                  <X size={16} />
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(16,185,129,0.9)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', padding: '6px' }}>
                  ✅ 업로드 완료!
                </div>
              </div>
            ) : (
              <label htmlFor="bulletin-image-upload" style={styles.uploadBtn}>
                <ImageIcon size={20} color="var(--text-muted)" />
                <span>📱 주보 이미지 첨부 (갤럭시/아이폰 사진 OK)</span>
              </label>
            )}
            {uploadError && (
              <div style={{ marginTop: '8px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {uploadError}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bulletin-content">예배 순서 및 광고 (텍스트)</label>
            <textarea
              id="bulletin-content"
              className="form-textarea"
              placeholder="1. 사도신경&#13;&#10;2. 찬양&#13;&#10;3. 말씀&#13;&#10;*이미지만 등록할 경우 비워두셔도 됩니다."
              rows="6"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ 
              alignSelf: 'flex-end',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: (isUploading || !newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 0.6 : 1,
              cursor: (isUploading || !newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'not-allowed' : 'pointer',
              background: (isUploading || !newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'rgba(139, 92, 246, 0.4)' : '#8B5CF6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '24px',
              fontWeight: '700',
              boxShadow: (isUploading || !newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'none' : '0 4px 6px rgba(139, 92, 246, 0.2)',
            }}
            disabled={isUploading || !newTitle.trim() || (!newContent.trim() && !imagePreview)}
          >
            <Send size={16} />
            <span>주보 발행하기</span>
          </button>
        </form>
      </section>

      {/* Posted Bulletins List */}
      <div style={styles.bulletinList}>
        <h3 style={{ margin: '12px 0 4px 8px' }}>발행된 주보 목록</h3>
        
        {bulletins.length === 0 ? (
          <div style={styles.emptyState} className="card-solid">
            <p>아직 발행된 주보가 없습니다. 주보를 등록해 보세요! 📜</p>
          </div>
        ) : (
          bulletins.map(bulletin => (
            <article key={bulletin.id} style={styles.bulletinCard} className="card-solid hover-lift">
              <div style={styles.bulletinHeader}>
                <h4 style={styles.bulletinTitle}>{bulletin.title}</h4>
                <div style={styles.bulletinMeta}>
                  <span>{bulletin.createdAt}</span>
                  <button 
                    style={styles.deleteBtn} 
                    onClick={() => {
                      if(window.confirm('정말 이 주보를 삭제하시겠습니까?')) {
                        deleteBulletin(bulletin.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {bulletin.imageUrl && (
                <div style={styles.bulletinImageWrapper}>
                  <img src={bulletin.imageUrl} alt="주보 이미지" style={styles.bulletinImage} />
                </div>
              )}
              
              {bulletin.content && (
                <div style={styles.bulletinContent}>
                  {bulletin.content}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '80px',
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: 'linear-gradient(135deg, #F5F3FF 0%, #ffffff 100%)',
    borderLeft: '4px solid #8B5CF6',
    borderRadius: 'var(--radius-lg)',
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  uploadBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '100px',
    border: '2px dashed #E5E7EB',
    borderRadius: '12px',
    background: '#F9FAFB',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-light)',
  },
  imagePreview: {
    width: '100%',
    display: 'block',
    maxHeight: '400px',
    objectFit: 'contain',
    background: '#f8fafc',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  },
  bulletinList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
  },
  bulletinCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
  },
  bulletinHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bulletinTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  bulletinMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  bulletinImageWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border-light)',
    marginTop: '8px',
  },
  bulletinImage: {
    width: '100%',
    display: 'block',
  },
  bulletinContent: {
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    background: '#F9FAFB',
    padding: '16px',
    borderRadius: '12px',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  }
};
