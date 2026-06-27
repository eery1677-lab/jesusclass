import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CheckSquare, Calendar as CalendarIcon, User, CheckCircle, XCircle, Clock, ArrowLeft, X, MessageSquare, Save } from 'lucide-react';

export default function TeacherAttendance({ setActiveTab }) {
  const { students, updateStudentDalant } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 가상의 출석 상태 관리를 위한 로컬 상태 (실제 앱에서는 useStore의 각 학생별 출결 배열에 저장해야 함)
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    const key = `${selectedDate}_${studentId}`;
    setAttendanceRecords(prev => ({
      ...prev,
      [key]: status
    }));

    // 출석(present)일 경우 1달란트 자동 지급 (데모용 로직)
    if (status === 'present') {
      updateStudentDalant(studentId, 1, '주일예배 출석');
    } else if (status === 'absent' || status === 'late') {
      // 기존 출석을 취소하고 결석/지각으로 변경한 경우 달란트 회수(선택적)
      // 여기서는 복잡도를 줄이기 위해 생략
    }
  };

  const getStatus = (studentId) => {
    return attendanceRecords[`${selectedDate}_${studentId}`] || 'none';
  };

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [absenceInput, setAbsenceInput] = useState('');
  const [simbangInput, setSimbangInput] = useState('');
  const { updateStudentNote } = useStore();

  const openNoteModal = (student) => {
    setActiveStudent(student);
    setAbsenceInput(student.absenceReason || '');
    setSimbangInput(student.simbangNote || '');
    setNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setActiveStudent(null);
  };

  const saveNotes = () => {
    if (!activeStudent) return;
    updateStudentNote(activeStudent.id, 'absenceReason', absenceInput);
    updateStudentNote(activeStudent.id, 'simbangNote', simbangInput);
    closeNoteModal();
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
        <CheckSquare size={24} style={{ color: 'var(--primary)' }} />
        <div>
          <h2>우리 반 출결 관리</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            예배 출석, 지각, 결석을 체크하고 출석 시 자동으로 달란트를 지급하세요.
          </p>
        </div>
      </section>

      <div style={styles.datePickerCard} className="card-solid hover-lift">
        <label style={styles.dateLabel} htmlFor="date-select">
          <CalendarIcon size={18} />
          <span>날짜 선택</span>
        </label>
        <input 
          id="date-select"
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      <div style={styles.listContainer}>
        {students.map(student => {
          const status = getStatus(student.id);
          return (
            <div key={student.id} style={styles.studentCard} className="card-solid hover-lift">
              <div style={styles.studentInfo} onClick={() => openNoteModal(student)} className="cursor-pointer">
                <div style={{...styles.avatarMini, overflow: 'hidden'}}>
                  {student.imageUrl ? (
                    <img src={student.imageUrl} alt="student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    student.avatar || '👦'
                  )}
                </div>
                <div>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentMeta}>누적 출석: {student.attendanceCount}회</div>
                  {(student.absenceReason || student.simbangNote) && (
                    <div style={styles.noteIndicator}>
                      <MessageSquare size={12} color="#8B5CF6" /> 
                      <span style={{color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 600}}>노트 있음</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={styles.actionGroup}>
                <button 
                  style={{...styles.actionBtn, background: status === 'present' ? '#10B981' : '#F3F4F6', color: status === 'present' ? 'white' : 'var(--text-muted)'}}
                  onClick={() => handleAttendanceChange(student.id, 'present')}
                >
                  <CheckCircle size={16} />
                  출석
                </button>
                <button 
                  style={{...styles.actionBtn, background: status === 'late' ? '#F59E0B' : '#F3F4F6', color: status === 'late' ? 'white' : 'var(--text-muted)'}}
                  onClick={() => handleAttendanceChange(student.id, 'late')}
                >
                  <Clock size={16} />
                  지각
                </button>
                <button 
                  style={{...styles.actionBtn, background: status === 'absent' ? '#EF4444' : '#F3F4F6', color: status === 'absent' ? 'white' : 'var(--text-muted)'}}
                  onClick={() => handleAttendanceChange(student.id, 'absent')}
                >
                  <XCircle size={16} />
                  결석
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 심방/결석 사유 노트 모달 */}
      {noteModalOpen && activeStudent && (
        <div style={styles.modalOverlay} onClick={closeNoteModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {activeStudent.avatar} {activeStudent.name} 학생 노트
              </h3>
              <button style={styles.closeBtn} onClick={closeNoteModal}>
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#EF4444', fontWeight: 700 }}>
                  결석 사유
                </label>
                <input 
                  type="text" 
                  className="neon-input" 
                  placeholder="예: 감기몸살, 가족 여행 등" 
                  value={absenceInput}
                  onChange={e => setAbsenceInput(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label" style={{ color: '#8B5CF6', fontWeight: 700 }}>
                  심방 / 기도 노트
                </label>
                <textarea 
                  className="form-textarea" 
                  placeholder="아이를 위해 기도할 제목이나 심방 내용을 기록하세요." 
                  rows="4"
                  value={simbangInput}
                  onChange={e => setSimbangInput(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn" style={{background: '#E5E7EB', color: '#374151'}} onClick={closeNoteModal}>
                취소
              </button>
              <button className="btn" style={{background: '#8B5CF6', color: 'white', display: 'flex', alignItems: 'center', gap: '6px'}} onClick={saveNotes}>
                <Save size={16} /> 저장
              </button>
            </div>
          </div>
        </div>
      )}
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
    background: 'linear-gradient(135deg, #ECFDF5 0%, #ffffff 100%)',
    borderLeft: '4px solid #10B981',
  },
  datePickerCard: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  dateLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  dateInput: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--border-light)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '180px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  studentCard: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarMini: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'var(--bg-app)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    overflow: 'hidden',
  },
  studentName: {
    fontWeight: 700,
    fontSize: '1.05rem',
  },
  studentMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  actionGroup: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  noteIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
    background: '#EDE9FE',
    padding: '2px 6px',
    borderRadius: '4px',
    width: 'fit-content'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-light)',
    background: '#F9FAFB',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 800,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '4px',
  },
  modalBody: {
    padding: '20px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid var(--border-light)',
    background: '#F9FAFB',
  }
};
