import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Coffee, Search, Check, Edit2, Gift, Save, Plus } from 'lucide-react';

export default function TeacherSnack({ setActiveTab }) {
  const { snacks, snackRequests, updateSnackMenu, addSnack, setChatOpen, setActiveChatStudentId } = useStore();
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ menu: '', sponsor: '', emoji: '', date: '' });

  // 간단한 이모지 자동 매칭 사전
  const emojiDict = {
    '햄버거': '🍔', '피자': '🍕', '샌드위치': '🥪', '핫도그': '🌭',
    '떡볶이': '🥘', '치킨': '🍗', '과자': '🍪', '사탕': '🍬',
    '아이스크림': '🍦', '케이크': '🍰', '빵': '🥐', '음료': '🧃',
    '우유': '🥛', '과일': '🍎', '김밥': '🍙'
  };

  const getAutoEmoji = (menuText) => {
    for (const [key, value] of Object.entries(emojiDict)) {
      if (menuText.includes(key)) return value;
    }
    // 사전에 없으면 첫 글자 추출
    if (menuText.trim().length > 0) {
      return menuText.trim().charAt(0);
    }
    return '🍽️';
  };

  const startEdit = (snack) => {
    setEditingId(snack.id);
    setEditForm({ menu: snack.menu, sponsor: snack.sponsor, emoji: snack.emoji, date: snack.date || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleMenuChange = (e) => {
    const val = e.target.value;
    setEditForm(prev => ({
      ...prev,
      menu: val,
      // 메뉴가 바뀔 때마다 이모지도 자동으로 추천 변경 (수동 수정 안 했을 경우를 가정하지만 단순화)
      emoji: getAutoEmoji(val)
    }));
  };

  const saveEdit = (id) => {
    updateSnackMenu(id, {
      menu: editForm.menu,
      sponsor: editForm.sponsor,
      emoji: editForm.emoji,
      date: editForm.date
    });
    setEditingId(null);
  };

  return (
    <div style={styles.container}>
      <section style={styles.headerPanel} className="card-solid hover-lift">
        <button 
          className="home-back-btn animate-pulse-border"
          onClick={() => setActiveTab('teacher-dashboard')} 
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color="var(--primary)" />
        </button>
        <Coffee size={24} style={{ color: '#F43F5E' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#F43F5E' }}>🍩 주간 간식 관리</h2>
          <p style={{ margin: 0, marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-muted)', wordBreak: 'keep-all', lineHeight: '1.4' }}>
            간식 메뉴를 설정하고 후원 신청을 확인하세요.
          </p>
        </div>
      </section>

      <div style={styles.contentLayout}>
        {/* 간식 메뉴 관리 영역 */}
        <section style={styles.leftSection}>
          <h3 style={styles.sectionTitle}>
            <Edit2 size={18} color="#F43F5E" />
            <span>이달의 간식 메뉴 설정</span>
          </h3>
          
          <div style={styles.snackList}>
            {(snacks || []).map(snack => (
              <div key={snack.id} style={{
                ...styles.snackCard, 
                border: snack.isCurrent ? '2px solid #F43F5E' : '1px solid var(--border-color)'
              }} className="card-solid hover-lift">
                
                {editingId === snack.id ? (
                  <div style={styles.editForm}>
                    <div style={styles.editRow}>
                      <span style={styles.weekLabel}>{snack.week}</span>
                      <input 
                        type="text" 
                        value={editForm.date}
                        onChange={e => setEditForm({...editForm, date: e.target.value})}
                        style={{...styles.input, width: '100px'}}
                        className="form-input neon-input"
                        placeholder="예: 7월 6일"
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>메뉴 이름</label>
                      <input 
                        type="text" 
                        value={editForm.menu}
                        onChange={handleMenuChange}
                        style={styles.input}
                        className="form-input neon-input"
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>아이콘 (이모지 자동 추천)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={styles.emojiPreview}>{editForm.emoji}</div>
                        <input 
                          type="text" 
                          value={editForm.emoji}
                          onChange={e => setEditForm({...editForm, emoji: e.target.value})}
                          style={{...styles.input, width: '60px', textAlign: 'center'}}
                          className="form-input neon-input"
                          maxLength={2}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        메뉴를 입력하면 자동으로 아이콘이 매칭됩니다. 원하시면 직접 다른 이모지를 넣거나 글자로 수정하세요.
                      </span>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>후원자</label>
                      <input 
                        type="text" 
                        value={editForm.sponsor}
                        onChange={e => setEditForm({...editForm, sponsor: e.target.value})}
                        style={styles.input}
                        className="form-input neon-input"
                      />
                    </div>
                    
                    <div style={styles.actionButtons}>
                      <button onClick={cancelEdit} style={styles.cancelBtn}>취소</button>
                      <button onClick={() => saveEdit(snack.id)} style={styles.saveBtn}>
                        <Save size={16} /> 저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.snackHeader}>
                      <div>
                        <span style={{...styles.weekLabel, background: snack.isCurrent ? '#F43F5E' : 'var(--bg-app)', color: snack.isCurrent ? 'white' : 'var(--text-main)'}}>
                          {snack.week} {snack.isCurrent && '(이번주)'}
                        </span>
                        <span style={styles.dateLabel}>{snack.date}</span>
                      </div>
                      <button onClick={() => startEdit(snack)} style={styles.editBtn}>
                        <Edit2 size={16} /> 수정
                      </button>
                    </div>
                    
                    <div style={styles.snackBody}>
                      <div style={styles.emojiCircle}>{snack.emoji}</div>
                      <div style={styles.snackInfo}>
                        <div style={styles.snackMenu}>{snack.menu || '메뉴 미정'}</div>
                        <div style={styles.snackSponsor}>
                          <Gift size={12} /> {snack.sponsor || '후원자를 기다립니다'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            <button 
              onClick={() => {
                const nextWeekNum = (snacks?.length || 0) + 1;
                addSnack({
                  id: `snack_week${nextWeekNum}_${Date.now()}`,
                  week: `${nextWeekNum}주`,
                  date: '날짜 미정',
                  menu: '메뉴 미정',
                  sponsor: '',
                  emoji: '🍽️',
                  isCurrent: false
                });
              }}
              style={styles.addWeekBtn}
              className="hover-lift"
            >
              <Plus size={20} />
              <span>새 주차 추가하기</span>
            </button>
          </div>
        </section>

        {/* 간식 후원 신청 내역 영역 */}
        <section style={styles.rightSection}>
          <h3 style={styles.sectionTitle}>
            <Gift size={18} color="#10B981" />
            <span>학부모 간식 후원 신청</span>
          </h3>
          
          <div 
            style={styles.requestList} 
            className="card-solid hover-lift"
          >
            {!(snackRequests && snackRequests.length > 0) ? (
              <div style={styles.emptyState}>
                <Coffee size={40} color="var(--border-color)" />
                <p>아직 접수된 간식 후원 신청이 없습니다.</p>
              </div>
            ) : (
              (snackRequests || []).map(req => (
                <div key={req.id} style={styles.requestCard} className="card-solid hover-lift">
                  <div style={styles.requestHeader}>
                    <div style={styles.requestStudent}>
                      <strong>{req.studentName}</strong> 학생 가정
                    </div>
                    <span style={styles.requestDate}>{req.createdAt}</span>
                  </div>
                  <div style={styles.requestMessage}>
                    "{req.message}"
                  </div>
                  <div style={styles.requestActions}>
                    <button 
                      style={styles.replyBtn}
                      onClick={() => {
                        setActiveChatStudentId(req.studentId);
                        setChatOpen(true);
                      }}
                    >
                      답장하기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
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
    background: 'linear-gradient(135deg, #FFF1F2 0%, #ffffff 100%)',
    borderLeft: '4px solid #F43F5E',
  },
  backBtn: {
    background: 'white', 
    border: '2px solid var(--primary)', 
    borderRadius: '50%',
    cursor: 'pointer', 
    width: '40px',
    height: '40px',
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  contentLayout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rightSection: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0',
    padding: '0 8px',
  },
  snackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  snackCard: {
    padding: '20px',
    background: 'white',
    borderRadius: 'var(--radius-lg)',
  },
  snackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  weekLabel: {
    fontWeight: 800,
    fontSize: '0.9rem',
    background: 'var(--bg-app)',
    padding: '4px 10px',
    borderRadius: '12px',
    marginRight: '8px',
  },
  dateLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  editBtn: {
    background: 'transparent',
    border: '1px solid var(--border-light)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--text-main)',
    transition: 'all 0.2s',
  },
  snackBody: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  emojiCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(244, 63, 94, 0.1)',
    color: '#F43F5E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: 800,
  },
  snackInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  snackMenu: {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--text-main)',
  },
  snackSponsor: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  editRow: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--border-input)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  emojiPreview: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(244, 63, 94, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#F43F5E',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  saveBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#F43F5E',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  requestList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
  },
  requestCard: {
    padding: '16px',
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    borderLeft: '4px solid #10B981',
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  requestStudent: {
    fontSize: '0.95rem',
  },
  requestDate: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  requestMessage: {
    padding: '12px',
    background: 'var(--bg-app)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  requestActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  replyBtn: {
    background: 'white',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--border-light)',
  },
  addWeekBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    background: 'transparent',
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};
