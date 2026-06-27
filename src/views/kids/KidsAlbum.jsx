import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Camera, Heart, Calendar, User, MessageSquare, ChevronLeft, Send } from 'lucide-react';

export default function KidsAlbum({ setActiveTab }) {
  const { albums, likeAlbum, addCommentToAlbum, currentUser } = useStore();
  const [commentInputs, setCommentInputs] = useState({});

  const handleLike = (albumId) => {
    likeAlbum(albumId, currentUser.id);
  };

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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <Camera size={24} color="#3B82F6" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>활동 사진첩</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>우리 아이들의 예쁜 모습들</p>
          </div>
        </div>
      </header>

      <div style={styles.albumGrid}>
        {albums.length === 0 ? (
          <div style={styles.emptyState} className="card-solid">
            <p>등록된 사진이 아직 없습니다. 📷</p>
          </div>
        ) : (
          albums.map(album => {
            const hasLiked = album.likedBy.includes(currentUser.id);
            return (
              <article key={album.id} style={styles.albumCard} className="card-solid hover-lift">
                <div style={styles.imageWrapper}>
                  <img src={album.image} alt={album.title} style={styles.image} />
                </div>

                <div style={styles.albumBody}>
                  <h3 style={styles.albumTitle}>{album.title}</h3>
                  
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <User size={13} />
                      <span>{album.writer}</span>
                    </span>
                    <span style={styles.metaItem}>
                      <Calendar size={13} />
                      <span>{album.createdAt}</span>
                    </span>
                  </div>

                  {/* Album Footer: Like & Comments Info */}
                  <div style={styles.albumFooter}>
                    <button 
                      onClick={() => handleLike(album.id)}
                      style={styles.likeBtn(hasLiked)}
                    >
                      <Heart size={16} fill={hasLiked ? 'var(--accent-danger)' : 'transparent'} />
                      <span>좋아요 {album.likes}</span>
                    </button>

                    <div style={styles.commentsIndicator}>
                      <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        댓글 {album.comments.length}개
                      </span>
                    </div>
                  </div>

                  {/* Show existing comments */}
                  {album.comments.length > 0 && (
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
                      placeholder="따뜻한 댓글을 남겨주세요..." 
                      className="neon-input"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        width: '100%',
                        background: 'var(--bg-main)',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
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
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeUp 0.4s ease-out forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    background: '#DBEAFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    }
  },
  emptyState: {
    gridColumn: 'span 2',
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  albumCard: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-md)',
  },
  imageWrapper: {
    width: '100%',
    height: '240px',
    borderTopLeftRadius: 'calc(var(--radius-md) - 1px)',
    borderTopRightRadius: 'calc(var(--radius-md) - 1px)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-smooth)',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },
  albumBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  albumTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  albumFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px',
    marginTop: '8px',
  },
  likeBtn: (hasLiked) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: hasLiked ? 'var(--accent-danger-bg)' : 'transparent',
    border: '1px solid ' + (hasLiked ? 'var(--accent-danger)' : 'var(--border-color)'),
    padding: '6px 12px',
    borderRadius: '20px',
    color: hasLiked ? 'var(--accent-danger)' : 'var(--text-main)',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'var(--transition-bounce)',
  }),
  commentsIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  miniComments: {
    marginTop: '12px',
    background: 'var(--bg-main)',
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
  commentInput: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    background: 'var(--bg-main)',
    border: '1px solid var(--border-input)',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '0.9rem',
    outline: 'none',
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
