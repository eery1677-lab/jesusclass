import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Calendar, Edit2, Check, MessageSquare, Plus, Trash2, X, Clock, MapPin, Users } from 'lucide-react';

export default function TeacherSchedule({ setActiveTab }) {
  const { schedules, scheduleMemos, updateSchedule, addSchedule, deleteSchedule, markScheduleMemoAsRead } = useStore();
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ time: '', title: '', location: '', iconType: 'Calendar', color: '#3B82F6', bg: '#DBEAFE' });
  
  const [isAdding, setIsAdding] = useState(false);

  const iconOptions = [
    { label: '일정 (달력)', value: 'Calendar', icon: Calendar },
    { label: '시간 (시계)', value: 'Clock', icon: Clock },
    { label: '장소 (지도핀)', value: 'MapPin', icon: MapPin },
    { label: '참여자 (그룹)', value: 'Users', icon: Users },
  ];

  const colorOptions = [
    { color: '#10B981', bg: '#D1FAE5', name: 'Green' },
    { color: '#3B82F6', bg: '#DBEAFE', name: 'Blue' },
    { color: '#F59E0B', bg: '#FEF3C7', name: 'Orange' },
    { color: '#6B7280', bg: '#F3F4F6', name: 'Gray' },
    { color: '#8B5CF6', bg: '#EDE9FE', name: 'Purple' },
    { color: '#EC4899', bg: '#FCE7F3', name: 'Pink' },
  ];

  const startEdit = (schedule) => {
    setEditingId(schedule.id);
    setEditForm({ ...schedule });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ time: '09:00', title: '', location: '', iconType: 'Calendar', color: '#3B82F6', bg: '#DBEAFE' });
  };

  const saveEdit = (id) => {
    updateSchedule(id, { ...editForm });
    setEditingId(null);
  };

  const saveAdd = () => {
    if (!editForm.time || !editForm.title) return;
    addSchedule({ ...editForm });
    setIsAdding(false);
  };

  const renderIcon = (iconType, props) => {
    const option = iconOptions.find(o => o.value === iconType) || iconOptions[0];
    const IconComponent = option.icon;
    return <IconComponent {...props} />;
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
        <Calendar size={24} style={{ color: '#0EA5E9' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0EA5E9' }}>📅 주일 일정 관리</h2>
          <p style={{ margin: 0, marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-muted)', wordBreak: 'keep-all', lineHeight: '1.4' }}>
            주일학교 일정을 설정하고 학부모 문의를 확인하세요.
          </p>
        </div>
      </section>

      <div style={styles.contentLayout}>
        {/* 일정 시간표 관리 영역 */}
        <section style={styles.leftSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>
              <Edit2 size={18} color="#0EA5E9" />
              <span>일정 시간표 설정</span>
            </h3>
            {!isAdding && (
              <button style={styles.addBtn} onClick={startAdd}>
                <Plus size={16} color="#8D6E63" /> 일정 추가
              </button>
            )}
          </div>
          
          <div style={styles.scheduleList}>
            {isAdding && (
              <div style={styles.scheduleCard} className="card-solid">
                <div style={styles.editForm}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>시간 (HH:MM)</label>
                    <input 
                      type="time" 
                      style={styles.input} 
                      value={editForm.time}
                      onChange={e => setEditForm({...editForm, time: e.target.value})}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>일정 제목</label>
                    <input 
                      type="text" 
                      style={styles.input} 
                      placeholder="예: 주일학교 예배"
                      value={editForm.title}
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>장소</label>
                    <input 
                      type="text" 
                      style={styles.input} 
                      placeholder="예: 소예배실"
                      value={editForm.location}
                      onChange={e => setEditForm({...editForm, location: e.target.value})}
                    />
                  </div>
                  <div style={styles.rowGroup}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>아이콘</label>
                      <select 
                        style={styles.input}
                        value={editForm.iconType}
                        onChange={e => setEditForm({...editForm, iconType: e.target.value})}
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>테마 컬러</label>
                      <div style={styles.colorPicker}>
                        {colorOptions.map(opt => (
                          <button
                            key={opt.color}
                            type="button"
                            style={{
                              ...styles.colorBtn,
                              background: opt.color,
                              border: 'none',
                              boxShadow: editForm.color === opt.color ? `0 0 0 2px var(--bg-card), 0 0 0 3px ${opt.color}` : 'none',
                              transform: editForm.color === opt.color ? 'scale(1.15)' : 'scale(1)',
                              transition: 'all 0.2s',
                            }}
                            onClick={() => setEditForm({...editForm, color: opt.color, bg: opt.bg})}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={styles.editActions}>
                    <button style={styles.cancelBtn} onClick={cancelEdit}>취소</button>
                    <button 
                      style={styles.saveBtn} 
                      onClick={saveAdd}
                      disabled={!editForm.time || !editForm.title}
                    >
                      <Check size={16} /> 추가하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(schedules || []).map(schedule => (
              <div key={schedule.id} style={styles.scheduleCard} className="card-solid hover-lift">
                {editingId === schedule.id ? (
                  <div style={styles.editForm}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>시간 (HH:MM)</label>
                      <input 
                        type="time" 
                        style={styles.input} 
                        value={editForm.time}
                        onChange={e => setEditForm({...editForm, time: e.target.value})}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>일정 제목</label>
                      <input 
                        type="text" 
                        style={styles.input} 
                        value={editForm.title}
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>장소</label>
                      <input 
                        type="text" 
                        style={styles.input} 
                        value={editForm.location}
                        onChange={e => setEditForm({...editForm, location: e.target.value})}
                      />
                    </div>
                    <div style={styles.rowGroup}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>아이콘</label>
                        <select 
                          style={styles.input}
                          value={editForm.iconType}
                          onChange={e => setEditForm({...editForm, iconType: e.target.value})}
                        >
                          {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>테마 컬러</label>
                        <div style={styles.colorPicker}>
                          {colorOptions.map(opt => (
                            <button
                              key={opt.color}
                              type="button"
                              style={{
                                ...styles.colorBtn,
                                background: opt.color,
                                border: 'none',
                                boxShadow: editForm.color === opt.color ? `0 0 0 2px var(--bg-card), 0 0 0 3px ${opt.color}` : 'none',
                                transform: editForm.color === opt.color ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 0.2s',
                              }}
                              onClick={() => setEditForm({...editForm, color: opt.color, bg: opt.bg})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.editActions}>
                      <button style={styles.deleteBtn} onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 size={16} /> 삭제
                      </button>
                      <div style={{display: 'flex', gap: '8px', marginLeft: 'auto'}}>
                        <button style={styles.cancelBtn} onClick={cancelEdit}>취소</button>
                        <button style={styles.saveBtn} onClick={() => saveEdit(schedule.id)}>
                          <Check size={16} /> 저장
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.scheduleDisplay}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                      <div style={{...styles.iconWrapper, background: schedule.bg, color: schedule.color}}>
                        {renderIcon(schedule.iconType, { size: 20 })}
                      </div>
                      <div>
                        <div style={styles.scheduleTime}>{schedule.time}</div>
                        <h4 style={styles.scheduleTitle}>{schedule.title}</h4>
                        <div style={styles.scheduleLocation}>
                          <MapPin size={14} /> {schedule.location}
                        </div>
                      </div>
                    </div>
                    <button style={styles.editIconButton} onClick={() => startEdit(schedule)}>
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 일정 관련 메모 확인 영역 */}
        <section style={styles.rightSection}>
          <h3 style={styles.sectionTitle}>
            <MessageSquare size={18} color="#0EA5E9" />
            <span>학부모 문의/메모</span>
            {scheduleMemos?.filter(m => !m.isRead).length > 0 && (
              <span style={styles.badge}>{scheduleMemos.filter(m => !m.isRead).length}</span>
            )}
          </h3>

          <div 
            style={styles.memoList} 
            className="card-solid hover-lift"
          >
            {!scheduleMemos || scheduleMemos.length === 0 ? (
              <div style={styles.emptyState}>
                도착한 메모가 없습니다.
              </div>
            ) : (
              scheduleMemos.map(memo => (
                <div key={memo.id} className="hover-lift" style={{
                  ...styles.memoCard,
                  opacity: memo.isRead ? 0.6 : 1,
                  background: memo.isRead ? '#F9FAFB' : 'white',
                  borderLeft: memo.isRead ? '4px solid #E5E7EB' : '4px solid #0EA5E9'
                }}>
                  <div style={styles.memoHeader}>
                    <span style={styles.memoStudent}>{memo.studentName} 학부모님</span>
                    <span style={styles.memoTime}>{memo.createdAt}</span>
                  </div>
                  <p style={styles.memoContent}>{memo.message}</p>
                  
                  {!memo.isRead && (
                    <button 
                      style={styles.checkBtn}
                      onClick={() => markScheduleMemoAsRead(memo.id)}
                    >
                      <Check size={14} /> 확인 완료
                    </button>
                  )}
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
    padding: '20px',
    paddingBottom: '100px',
    maxWidth: '1200px',
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
    background: 'linear-gradient(135deg, #F0F9FF 0%, #ffffff 100%)',
    borderLeft: '4px solid #0EA5E9',
  },
  backBtn: {
    marginRight: '8px',
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
    color: 'var(--text-main)',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: '#F5F5F4',
    color: '#8D6E63',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  badge: {
    background: '#EF4444',
    color: 'white',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  scheduleCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
  },
  scheduleDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  scheduleTitle: {
    margin: '2px 0',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  scheduleLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  editIconButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rowGroup: {
    display: 'flex',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  input: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  colorPicker: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    height: '100%',
    flexWrap: 'wrap',
  },
  colorBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  editActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-light)',
  },
  cancelBtn: {
    background: '#F3F4F6',
    color: 'var(--text-main)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#0EA5E9',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: '#FEF2F2',
    color: '#EF4444',
    border: '1px solid #FEE2E2',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  memoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
  },
  memoCard: {
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s',
  },
  memoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  memoStudent: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  memoTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  memoContent: {
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  checkBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    padding: '8px',
    background: '#F0F9FF',
    color: '#0EA5E9',
    border: '1px solid #BAE6FD',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    background: '#F9FAFB',
    borderRadius: '12px',
  }
};
