import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Camera, Calendar, Plus, Send, Heart, MessageSquare, ArrowLeft, Loader } from 'lucide-react';
import { uploadImage } from '../../utils/uploadImage';

const PRESET_IMAGES = [
  {
    name: '🎨 어린이 성경 골든벨',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: '🌳 공원 야외 예배 활동',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: '🎶 어린이 성가대 찬양 연습',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: '🎂 주일학교 친구 생일 축하',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000'
  }
];

export default function TeacherAlbum({ setActiveTab }) {
  const { albums, addAlbum, likeAlbum, addCommentToAlbum, currentUser } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleCommentChange = (albumId, value) => {
    setCommentInputs(prev => ({...prev, [albumId]: value}));
  };

  const handleCommentSubmit = (e, albumId) => {
    e.preventDefault();
    const content = commentInputs[albumId];
    if (content && content.trim()) {
      addCommentToAlbum(albumId, currentUser.name, content.trim());
      setCommentInputs(prev => ({...prev, [albumId]: ''}));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const url = await uploadImage(file, 'albums', { maxSize: 1200, quality: 0.82 });
      setUploadedImage(url);
      setCustomImage('');
      setSelectedImage('');
    } catch (err) {
      console.error('앨범 이미지 업로드 실패:', err);
      setUploadError('사진 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      // 같은 파일 재선택을 위해 input 초기화
      e.target.value = '';
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalImage = uploadedImage || customImage.trim() || selectedImage;
    await addAlbum(newTitle, finalImage);
    
    setNewTitle('');
    setCustomImage('');
    setUploadedImage(null);
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
        <Camera size={24} style={{ color: 'var(--primary)' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#EC4899' }}>📸 주일학교 활동 사진 업로드 & 관리</h2>
          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'keep-all', lineHeight: '1.4' }}>
            매주일 아이들의 예배 활동, 야외 탐방, 성경 공부 사진을 업로드해 학부모님들께 공유하세요!
          </p>
        </div>
      </section>

      {/* Upload Album Form */}
      <section style={styles.section} className="card-solid hover-lift">
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} style={{ color: 'var(--primary)' }} />
          <span>새 앨범 등록하기</span>
        </h3>

        <form onSubmit={handleCreateAlbum} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="album-title">앨범 제목 (활동명)</label>
            <input
              id="album-title"
              type="text"
              className="form-input"
              placeholder="예: 🎈 즐거운 6월 요절 복습 & 피자 파티 현장!"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">활동 이미지 프리셋 선택 (편리한 데모용)</label>
            <div style={styles.presetGrid}>
              {PRESET_IMAGES.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img.url);
                    setCustomImage('');
                    setUploadedImage(null);
                  }}
                  style={styles.presetCard(selectedImage === img.url && !customImage && !uploadedImage)}
                >
                  <img src={img.url} alt={img.name} style={styles.presetThumb} />
                  <div style={styles.presetName}>{img.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="custom-image-url">또는 직접 사진 업로드 (추천)</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed var(--border-color)', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
              ⚠️ 갤럭시 울트라 등 <b>고해상도 모바일 원본 사진</b>은 용량이 커 업로드가 실패할 수 있습니다. 실패 시 <b>화면을 캡처(스크린샷)한 사진</b>이나 <b>카카오톡 다운로드 사진</b>을 이용하시면 즉시 업로드됩니다.
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" style={{...styles.uploadBtn, opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer'}}>
              {isUploading ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  업로드 중...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  {uploadedImage ? '사진 변경하기' : '📱 기기에서 사진 선택 (갤럭시/아이폰 OK)'}
                </>
              )}
            </label>
            {uploadError && (
              <div style={{ marginTop: '8px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {uploadError}
              </div>
            )}
            {uploadedImage && !isUploading && (
              <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #10B981' }}>
                <img src={uploadedImage} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '6px 12px', background: '#10B981', color: 'white', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>
                  ✅ 업로드 완료! 사진이 준비되었습니다.
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }} disabled={isUploading}>
            <Send size={16} />
            <span>사진첩 발행하기</span>
          </button>
        </form>
      </section>

      {/* Album List Preview */}
      <div>
        <h3 style={{ margin: '12px 0 12px 8px' }}>등록된 사진첩</h3>
        <div style={styles.albumGrid}>
          {albums.map(album => {
            const hasLiked = album.likedBy.includes(currentUser.id);
            return (
              <article key={album.id} style={styles.albumCard} className="card-solid hover-lift">
                <div style={styles.imageWrapper}>
                  <img src={album.image} alt={album.title} style={styles.image} />
                </div>
                <div style={styles.albumBody}>
                  <h4 style={styles.albumTitle}>{album.title}</h4>
                  
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}><Calendar size={12} /><span>{album.createdAt}</span></span>
                    <span style={styles.metaItem}><Heart size={12} fill="var(--accent-danger)" style={{ color: 'var(--accent-danger)' }} /><span>좋아요 {album.likes}개</span></span>
                    <span style={styles.metaItem}><MessageSquare size={12} /><span>댓글 {album.comments?.length || 0}개</span></span>
                  </div>

                  {/* Show existing comments */}
                  {album.comments && album.comments.length > 0 && (
                    <div style={styles.miniComments}>
                      {album.comments.map(c => (
                        <div key={c.id} style={styles.miniCommentItem}>
                          <strong style={{ color: 'var(--text-main)' }}>{c.writer}</strong> 
                          <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{c.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <form style={styles.commentForm} onSubmit={(e) => handleCommentSubmit(e, album.id)}>
                    <input 
                      type="text" 
                      placeholder="선생님도 따뜻한 댓글을 남겨보세요..." 
                      className="neon-input"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        width: '100%',
                        background: 'var(--bg-main)',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        border: '1px solid var(--border-input)',
                        borderRadius: '20px',
                      }}
                      value={commentInputs[album.id] || ''}
                      onChange={(e) => handleCommentChange(album.id, e.target.value)}
                    />
                    <button 
                      type="submit" 
                      style={styles.commentSubmitBtn(!!commentInputs[album.id]?.trim())}
                      disabled={!commentInputs[album.id]?.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: 'linear-gradient(135deg, #FDF2F8 0%, #ffffff 100%)',
    borderLeft: '4px solid #EC4899',
  },
  section: {
    padding: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    margin: '8px 0',
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
    }
  },
  presetCard: (isSelected) => ({
    border: '2px solid ' + (isSelected ? 'var(--primary)' : 'var(--border-color)'),
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'var(--bg-card)',
    transition: 'var(--transition-bounce)',
    transform: isSelected ? 'scale(1.02)' : 'none',
    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
  }),
  presetThumb: {
    width: '100%',
    height: '80px',
    objectFit: 'cover',
  },
  presetName: {
    padding: '6px 8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textAlign: 'center',
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
    }
  },
  albumCard: {
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '180px',
    borderTopLeftRadius: 'calc(var(--radius-md) - 1px)',
    borderTopRightRadius: 'calc(var(--radius-md) - 1px)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  albumBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  albumTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    alignItems: 'center',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#F3F4F6',
    border: '2px dashed #D1D5DB',
    padding: '16px',
    borderRadius: '12px',
    color: '#4B5563',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  miniComments: {
    marginTop: '12px',
    background: '#F9FAFB',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    fontSize: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  miniCommentItem: {
    lineHeight: 1.4,
    fontSize: '0.9rem',
  },
  commentForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px',
  },
  commentSubmitBtn: (isActive) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--primary)',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isActive ? 'pointer' : 'default',
    opacity: isActive ? 1 : 0.5,
    transition: 'all 0.2s',
  })
};
