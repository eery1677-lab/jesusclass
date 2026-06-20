import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Camera, Calendar, Plus, Send, Heart, MessageSquare } from 'lucide-react';

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
    url: 'https://images.unsplash.com/photo-1453733190148-c44698c265f8?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: '🎂 주일학교 친구 생일 축하',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000'
  }
];

export default function TeacherAlbum() {
  const { albums, addAlbum, likeAlbum, currentUser } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState('');

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalImage = customImage.trim() || selectedImage;
    addAlbum(newTitle, finalImage);
    
    setNewTitle('');
    setCustomImage('');
  };

  return (
    <div style={styles.container}>
      <section style={styles.headerPanel} className="card-solid">
        <Camera size={24} style={{ color: 'var(--primary)' }} />
        <div>
          <h2>📸 주일학교 활동 사진 업로드 & 관리</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            매주일 아이들의 예배 활동, 야외 탐방, 성경 공부 사진을 업로드해 학부모님들께 공유하세요!
          </p>
        </div>
      </section>

      {/* Upload Album Form */}
      <section style={styles.section} className="card-solid">
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
                  }}
                  style={styles.presetCard(selectedImage === img.url && !customImage)}
                >
                  <img src={img.url} alt={img.name} style={styles.presetThumb} />
                  <div style={styles.presetName}>{img.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="custom-image-url">또는 직접 이미지 URL 입력 (선택사항)</label>
            <input
              id="custom-image-url"
              type="text"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
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
                    <span style={styles.metaItem}><MessageSquare size={12} /><span>댓글 {album.comments.length}개</span></span>
                  </div>
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
    gap: '16px',
    padding: '16px',
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
    background: '#000',
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
  }
};
