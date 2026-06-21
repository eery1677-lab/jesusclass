import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { BookOpen, Calendar, MessageSquare, Plus, Send, Trash2, User, ArrowLeft } from 'lucide-react';

export default function TeacherNotices({ setActiveTab }) {
  const { notices, addNotice, addCommentToNotice, currentUser } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNotice(newTitle, newContent);
    setNewTitle('');
    setNewContent('');
  };

  const handleCommentSubmit = (noticeId) => {
    const text = commentInputs[noticeId] || '';
    if (!text.trim()) return;

    addCommentToNotice(noticeId, currentUser.name, text);
    setCommentInputs(prev => ({ ...prev, [noticeId]: '' }));
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
        <BookOpen size={24} style={{ color: 'var(--primary)' }} />
        <div>
          <h2>📢 주간 알림장 작성 & 관리</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            새로운 공지사항과 성경 암송 요절을 등록하고 학부모 및 학생들과 댓글로 실시간 의견을 나눠보세요.
          </p>
        </div>
      </section>

      {/* Write New Notice Form */}
      <section style={styles.section} className="card-solid hover-lift">
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} style={{ color: 'var(--primary)' }} />
          <span>새 알림장(공지) 등록</span>
        </h3>
        
        <form onSubmit={handleCreateNotice} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="notice-title">알림장 제목</label>
            <input
              id="notice-title"
              type="text"
              className="form-input"
              placeholder="예: 📢 6월 4주차 야외 특별예배 준비물 안내"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notice-content">알림 내용 및 안내 사항</label>
            <textarea
              id="notice-content"
              className="form-textarea"
              placeholder="준비물, 행사 일시, 상세 장소 등을 줄바꿈하여 자유롭게 적어주세요..."
              rows="5"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              alignSelf: 'flex-end',
              opacity: (!newTitle.trim() || !newContent.trim()) ? 0.6 : 1,
              cursor: (!newTitle.trim() || !newContent.trim()) ? 'not-allowed' : 'pointer',
              background: (!newTitle.trim() || !newContent.trim()) ? 'rgba(16, 185, 129, 0.4)' : 'var(--primary)',
              border: 'none',
              boxShadow: (!newTitle.trim() || !newContent.trim()) ? 'none' : 'var(--shadow-sm)',
            }}
            disabled={!newTitle.trim() || !newContent.trim()}
          >
            <Send size={16} />
            <span>알림장 발행하기</span>
          </button>
        </form>
      </section>

      {/* Posted Notices List */}
      <div style={styles.noticeList}>
        <h3 style={{ margin: '12px 0 4px 8px' }}>발행된 알림장 목록</h3>
        
        {notices.length === 0 ? (
          <div style={styles.emptyState} className="card-solid hover-lift">
            <p>아직 발행된 알림장이 없습니다. 첫 알림장을 등록해 보세요! 📭</p>
          </div>
        ) : (
          notices.map(notice => (
            <article key={notice.id} style={styles.noticeCard} className="card-solid hover-lift">
              <div style={styles.noticeHeader}>
                <h4 style={styles.noticeTitle}>{notice.title}</h4>
                <div style={styles.metaRow}>
                  <span style={styles.metaItem}>
                    <User size={13} />
                    <span>{notice.writer}</span>
                  </span>
                  <span style={styles.metaItem}>
                    <Calendar size={13} />
                    <span>{notice.createdAt}</span>
                  </span>
                </div>
              </div>

              <div style={styles.noticeContent}>
                {notice.content.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: '6px' }}>{line}</p>
                ))}
              </div>

              {/* Comments Section */}
              <div style={styles.commentsSection}>
                <div style={styles.commentHeader}>
                  <MessageSquare size={14} style={{ color: 'var(--primary)' }} />
                  <h5>댓글 피드 ({notice.comments.length})</h5>
                </div>

                {notice.comments.length > 0 && (
                  <div style={styles.commentList}>
                    {notice.comments.map(c => (
                      <div key={c.id} style={styles.commentItem}>
                        <div style={styles.commentMeta}>
                          <span style={styles.commentWriter} style={{ color: c.writer.includes('선생님') ? 'var(--primary)' : 'var(--secondary)', fontWeight: 700 }}>
                            {c.writer}
                          </span>
                          <span style={styles.commentTime}>{c.createdAt}</span>
                        </div>
                        <p style={styles.commentText}>{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Teacher Comment Write Form */}
                <div style={styles.commentForm}>
                  <input
                    type="text"
                    value={commentInputs[notice.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [notice.id]: e.target.value })}
                    placeholder="학부모 질문에 답변을 달거나 공지를 남겨주세요..."
                    className="neon-input"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '12px',
                      background: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(notice.id);
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(notice.id)}
                    disabled={!(commentInputs[notice.id] || '').trim()}
                    style={{ 
                      padding: '10px 16px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      opacity: (commentInputs[notice.id] || '').trim() ? 1 : 0.5,
                      cursor: (commentInputs[notice.id] || '').trim() ? 'pointer' : 'default',
                    }}
                  >
                    <Send size={14} />
                    <span>답변</span>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px 32px',
    background: 'white',
    borderRadius: '16px',
  },
  section: {
    padding: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noticeHeader: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  noticeTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '6px',
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
  noticeContent: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  commentsSection: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    marginTop: '8px',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '14px',
  },
  commentItem: {
    background: 'var(--bg-main)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    marginBottom: '2px',
  },
  commentTime: {
    color: 'var(--text-muted)',
  },
  commentText: {
    fontSize: '0.85rem',
  },
  commentForm: {
    display: 'flex',
    gap: '8px',
  },
  commentInput: {
    flex: 1,
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-main)',
    border: '1.5px solid var(--border-input)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.9rem',
  }
};
