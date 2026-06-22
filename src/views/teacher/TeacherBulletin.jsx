import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { FileText, Plus, Send, Trash2, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

export default function TeacherBulletin({ setActiveTab }) {
  const { bulletins, addBulletin, deleteBulletin } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateBulletin = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || (!newContent.trim() && !imagePreview)) return;

    addBulletin(newTitle, newContent, imagePreview);
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
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="bulletin-image-upload"
            />
            
            {imagePreview ? (
              <div style={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="주보 미리보기" style={styles.imagePreview} />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  style={styles.removeImageBtn}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label htmlFor="bulletin-image-upload" style={styles.uploadBtn}>
                <ImageIcon size={20} color="var(--text-muted)" />
                <span>주보 이미지 첨부하기</span>
              </label>
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
              opacity: (!newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 0.6 : 1,
              cursor: (!newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'not-allowed' : 'pointer',
              background: (!newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'rgba(139, 92, 246, 0.4)' : '#8B5CF6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '24px',
              fontWeight: '700',
              boxShadow: (!newTitle.trim() || (!newContent.trim() && !imagePreview)) ? 'none' : '0 4px 6px rgba(139, 92, 246, 0.2)',
            }}
            disabled={!newTitle.trim() || (!newContent.trim() && !imagePreview)}
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
    padding: '20px',
    paddingBottom: '100px', // 하단 잘림 방지
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: 'linear-gradient(135deg, #F5F3FF 0%, #ffffff 100%)',
    borderLeft: '4px solid #8B5CF6',
  },
  section: {
    background: 'white',
    padding: '24px 32px',
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
    padding: '24px',
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
