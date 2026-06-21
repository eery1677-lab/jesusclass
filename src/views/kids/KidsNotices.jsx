import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { BookOpen, Calendar, MessageSquare, Send, User, ChevronLeft } from 'lucide-react';

export default function KidsNotices({ setActiveTab }) {
  const { notices, addCommentToNotice, currentUser } = useStore();
  const [commentInputs, setCommentInputs] = useState({});

  const handleCommentChange = (noticeId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [noticeId]: value
    }));
  };

  const handleCommentSubmit = (noticeId) => {
    const text = commentInputs[noticeId] || '';
    if (!text.trim()) return;

    // 댓글 작성자 이름 구성 (예: '김예찬 학부모' 혹은 교사일 경우 교사 이름)
    const writerName = currentUser.role === 'teacher' 
      ? currentUser.name 
      : `${currentUser.name} 학부모`;

    addCommentToNotice(noticeId, writerName, text);
    handleCommentChange(noticeId, ''); // 인풋 초기화
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <BookOpen size={24} color="#6366F1" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>주간 알림장</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>공지사항과 준비물을 확인하세요</p>
          </div>
        </div>
      </header>

      <div style={styles.noticeList}>
        {notices.length === 0 ? (
          <div style={styles.emptyState} className="card-solid">
            <p>등록된 공지사항이 아직 없습니다. 📭</p>
          </div>
        ) : (
          notices.map(notice => (
            <article key={notice.id} style={styles.noticeCard} className="card-solid hover-lift">
              {/* Notice Header */}
              <div style={styles.noticeHeader}>
                <h3 style={styles.noticeTitle}>{notice.title}</h3>
                <div style={styles.metaRow}>
                  <span style={styles.metaItem}>
                    <User size={14} />
                    <span>{notice.writer}</span>
                  </span>
                  <span style={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{notice.createdAt}</span>
                  </span>
                </div>
              </div>

              {/* Notice Content */}
              <div style={styles.noticeContent}>
                {notice.content.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: '8px' }}>{line}</p>
                ))}
              </div>

              {/* Comments Section */}
              <div style={styles.commentsSection}>
                <div style={styles.commentHeader}>
                  <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                  <h4>댓글 ({notice.comments.length})</h4>
                </div>

                {notice.comments.length > 0 && (
                  <div style={styles.commentList}>
                    {notice.comments.map(comment => (
                      <div key={comment.id} style={styles.commentItem}>
                        <div style={styles.commentMeta}>
                          <span style={styles.commentWriter}>{comment.writer}</span>
                          <span style={styles.commentTime}>{comment.createdAt}</span>
                        </div>
                        <p style={styles.commentText}>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Write Form */}
                <div style={styles.commentForm}>
                  <input
                    type="text"
                    value={commentInputs[notice.id] || ''}
                    onChange={(e) => handleCommentChange(notice.id, e.target.value)}
                    placeholder="알림장 확인 댓글을 작성해 주세요..."
                    className="neon-input"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '12px',
                      background: 'var(--bg-main)',
                      color: 'var(--text-main)',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(notice.id);
                    }}
                  />
                  <button
                    style={{
                      ...styles.sendBtn,
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      opacity: (commentInputs[notice.id] || '').trim() ? 1 : 0.5,
                      cursor: (commentInputs[notice.id] || '').trim() ? 'pointer' : 'default',
                    }}
                    onClick={() => handleCommentSubmit(notice.id)}
                    disabled={!(commentInputs[notice.id] || '').trim()}
                  >
                    <Send size={14} />
                    <span className="hide-on-mobile">등록</span>
                  </button>
                </div>
              </div>
            </article>
          ))
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
    background: '#E0E7FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  noticeCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  noticeHeader: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  noticeTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  noticeContent: {
    fontSize: '1rem',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
    color: 'var(--text-main)',
  },
  commentsSection: {
    marginTop: '16px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-color)',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  commentItem: {
    background: 'var(--bg-main)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '4px',
  },
  commentWriter: {
    fontWeight: 700,
    color: 'var(--primary)',
  },
  commentTime: {
    color: 'var(--text-muted)',
  },
  commentText: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  commentForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    minWidth: 0,
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-main)',
    border: '1.5px solid var(--border-input)',
    color: 'var(--text-main)',
    outline: 'none',
    transition: 'var(--transition-smooth)',
    '&:focus': {
      borderColor: 'var(--primary)',
    }
  },
  sendBtn: {
    padding: '12px 16px',
    height: '100%',
  }
};
