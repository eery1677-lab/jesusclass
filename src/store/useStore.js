import { create } from 'zustand';

// 초기 가상 데이터베이스 구성
const initialStudents = [
  {
    id: 'student1',
    name: '김예찬',
    grade: '초등부 3학년',
    avatar: '🐑',
    level: 2,
    xp: 150,
    dalant: 18,
    attendanceCount: 15,
    offeringCount: 14,
    bibleCount: 12,
    dailyMissions: {
      attendance: { status: 'none', submittedAt: null },
      offering: { status: 'none', submittedAt: null },
      bible: { status: 'none', textContent: '', submittedAt: null }
    },
    allergy: ['땅콩', '우유']
  },
  {
    id: 'student2',
    name: '이주은',
    grade: '초등부 5학년',
    avatar: '🦁',
    level: 3,
    xp: 280,
    dalant: 25,
    attendanceCount: 18,
    offeringCount: 16,
    bibleCount: 15,
    dailyMissions: {
      attendance: { status: 'completed', submittedAt: '2026-06-20 09:00' },
      offering: { status: 'pending', submittedAt: '2026-06-20 09:15' },
      bible: { status: 'pending', textContent: '여호와는 나의 목자시니 내게 부족함이 없으리로다 (시 23:1)', submittedAt: '2026-06-20 09:20' }
    },
    allergy: []
  },
  {
    id: 'student3',
    name: '박민우',
    grade: '중등부 1학년',
    avatar: '🦅',
    level: 1,
    xp: 60,
    dalant: 9,
    attendanceCount: 8,
    offeringCount: 8,
    bibleCount: 5,
    dailyMissions: {
      attendance: { status: 'none', submittedAt: null },
      offering: { status: 'none', submittedAt: null },
      bible: { status: 'none', textContent: '', submittedAt: null }
    },
    allergy: ['복숭아']
  }
];

const initialNotices = [
  {
    id: 1,
    title: '📢 이번 주일 야외 특별 예배 및 준비물 안내',
    content: '샬롬! 이번 주일(6월 21일)은 교회 앞 푸른 언덕 공원에서 야외 예배로 드려집니다. 아이들이 뜨거운 햇빛을 피할 수 있도록 개인 모자와 돗자리를 지참할 수 있게 지도해 주세요! 예배 후에 맛있는 피자 간식 시간도 준비되어 있습니다! 🍕',
    writer: '박사랑 선생님',
    createdAt: '2026-06-20',
    comments: [
      { id: 101, writer: '김예찬 학부모', content: '알겠습니다, 선생님! 예찬이 모자 씌워서 보내겠습니다. 😊', createdAt: '2026-06-20 10:15' },
      { id: 102, writer: '이주은 학부모', content: '돗자리도 하나 챙겨 보낼게요. 감사합니다!', createdAt: '2026-06-20 11:30' }
    ]
  },
  {
    id: 2,
    title: '📜 6월 3주차 성경 암송 요절',
    content: '“하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라” (요한복음 3장 16절 말씀) \n\n매일 스스로 외워보고 미션 창에 입력해 보세요! 성공 시 2달란트가 지급됩니다.',
    writer: '박사랑 선생님',
    createdAt: '2026-06-18',
    comments: []
  }
];

const initialAlbums = [
  {
    id: 1,
    title: '🌿 지난 주일 신나는 성경 퀴즈 골든벨 현장!',
    writer: '박사랑 선생님',
    createdAt: '2026-06-14',
    likes: 15,
    likedBy: [],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    comments: [
      { id: 201, writer: '김예찬 학부모', content: '아이들이 정말 신나 보이네요! 말씀 공부가 재밌나 봐요.', createdAt: '2026-06-14 15:40' }
    ]
  },
  {
    id: 2,
    title: '🎈 초등부 여름 성경학교 준비를 위한 풍선 데코 완료',
    writer: '이주은 선생님',
    createdAt: '2026-06-12',
    likes: 9,
    likedBy: [],
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000',
    comments: []
  }
];

const initialMessages = [
  {
    id: 1,
    studentId: 'student1',
    senderId: 'teacher1',
    senderName: '박사랑 선생님',
    content: '예찬아! 지난주에 아프다고 들었는데, 몸은 좀 괜찮아졌니? 주일에 건강한 모습으로 보자!',
    timestamp: '2026-06-20 09:30'
  },
  {
    id: 2,
    studentId: 'student1',
    senderId: 'student1',
    senderName: '김예찬',
    content: '네 선생님! 이제 다 나았어요. 주일에 교회 일찍 갈게요!',
    timestamp: '2026-06-20 10:02'
  }
];

// 로컬스토리지 복원 헬퍼
const getLocalStorage = (key, initial) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    return initial;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export const useStore = create((set, get) => ({
  // 사용자 상태 ('student' / 'teacher')
  currentUser: getLocalStorage('jc_current_user', {
    id: 'student1',
    role: 'student',
    name: '김예찬'
  }),
  
  // 교사 전용 설정 (안식일 모드 등)
  teacherSettings: getLocalStorage('jc_teacher_settings', {
    dndEnabled: false,
    dndStart: '22:00',
    dndEnd: '08:00'
  }),
  
  churchName: getLocalStorage('jc_church_name', '양정교회'),

  students: getLocalStorage('jc_students', initialStudents),
  notices: getLocalStorage('jc_notices', initialNotices),
  albums: getLocalStorage('jc_albums', initialAlbums),
  messages: getLocalStorage('jc_messages', initialMessages),
  
  // 설정 업데이트
  updateChurchName: (name) => {
    set({ churchName: name });
    setLocalStorage('jc_church_name', name);
  },

  // 교사 설정 업데이트
  updateTeacherSettings: (settings) => {
    const newSettings = { ...get().teacherSettings, ...settings };
    set({ teacherSettings: newSettings });
    setLocalStorage('jc_teacher_settings', newSettings);
  },
  
  // 1. 유저 역할 전환
  switchUser: (role, id) => {
    let name = '박사랑 선생님';
    if (role === 'student') {
      const student = get().students.find(s => s.id === id);
      name = student ? student.name : '학생';
    }
    const newUser = { id, role, name };
    set({ currentUser: newUser });
    setLocalStorage('jc_current_user', newUser);
  },
  
  // 1-1. 학생 프로필 업데이트
  updateStudentProfile: (studentId, updates) => {
    const updatedStudents = get().students.map(student => {
      if (student.id === studentId) {
        return { ...student, ...updates };
      }
      return student;
    });
    set({ students: updatedStudents });
    setLocalStorage('jc_students', updatedStudents);

    // 현재 접속자가 수정된 학생이라면 currentUser 이름도 업데이트
    const current = get().currentUser;
    if (current.role === 'student' && current.id === studentId && updates.name) {
      const newUser = { ...current, name: updates.name };
      set({ currentUser: newUser });
      setLocalStorage('jc_current_user', newUser);
    }
  },
  
  // 2. 일일 미션 제출 (학생용)
  submitMission: (studentId, missionType, textContent = '') => {
    const updatedStudents = get().students.map(student => {
      if (student.id === studentId) {
        const now = new Date().toLocaleString();
        return {
          ...student,
          dailyMissions: {
            ...student.dailyMissions,
            [missionType]: {
              status: 'pending',
              textContent: textContent,
              submittedAt: now
            }
          }
        };
      }
      return student;
    });
    
    set({ students: updatedStudents });
    setLocalStorage('jc_students', updatedStudents);
  },
  
  // 3. 일일 미션 승인 (교사용)
  approveMission: (studentId, missionType) => {
    const updatedStudents = get().students.map(student => {
      if (student.id === studentId) {
        // 기존 획득 횟수 증가
        let extraAttendance = 0;
        let extraOffering = 0;
        let extraBible = 0;
        let extraDalant = 1; // 기본 1달란트 지급
        
        if (missionType === 'attendance') {
          extraAttendance = 1;
        } else if (missionType === 'offering') {
          extraOffering = 1;
        } else if (missionType === 'bible') {
          extraBible = 1;
          extraDalant = 2; // 요절 암송은 2달란트!
        }
        
        return {
          ...student,
          dalant: student.dalant + extraDalant,
          xp: student.xp + 50,
          level: Math.floor((student.xp + 50) / 100) + 1, // 100XP당 1레벨업
          attendanceCount: student.attendanceCount + extraAttendance,
          offeringCount: student.offeringCount + extraOffering,
          bibleCount: student.bibleCount + extraBible,
          dailyMissions: {
            ...student.dailyMissions,
            [missionType]: {
              ...student.dailyMissions[missionType],
              status: 'completed'
            }
          }
        };
      }
      return student;
    });
    
    set({ students: updatedStudents });
    setLocalStorage('jc_students', updatedStudents);
  },
  
  // 4. 일일 미션 반려/취소 (교사용)
  rejectMission: (studentId, missionType) => {
    const updatedStudents = get().students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          dailyMissions: {
            ...student.dailyMissions,
            [missionType]: {
              status: 'none',
              textContent: '',
              submittedAt: null
            }
          }
        };
      }
      return student;
    });
    
    set({ students: updatedStudents });
    setLocalStorage('jc_students', updatedStudents);
  },
  
  // 5. 달란트 직접 지급/차감 (교사 선물 수여 등)
  adjustDalant: (studentId, amount, reason = '') => {
    const updatedStudents = get().students.map(student => {
      if (student.id === studentId) {
        const newDalant = Math.max(0, student.dalant + amount);
        return {
          ...student,
          dalant: newDalant
        };
      }
      return student;
    });
    
    set({ students: updatedStudents });
    setLocalStorage('jc_students', updatedStudents);
    
    // 알림 메시지 자동 전송
    const student = get().students.find(s => s.id === studentId);
    if (student) {
      get().sendMessage(
        studentId,
        'teacher1',
        '박사랑 선생님',
        `🎁 달란트가 변동되었습니다! [${amount > 0 ? '+' : ''}${amount} 달란트] 사유: ${reason}`
      );
    }
  },
  
  // 6. 알림장 추가 (교사)
  addNotice: (title, content) => {
    const now = new Date().toISOString().split('T')[0];
    const newNotice = {
      id: Date.now(),
      title,
      content,
      writer: '박사랑 선생님',
      createdAt: now,
      comments: []
    };
    
    const updatedNotices = [newNotice, ...get().notices];
    set({ notices: updatedNotices });
    setLocalStorage('jc_notices', updatedNotices);
  },
  
  // 7. 알림장에 댓글 달기
  addCommentToNotice: (noticeId, writer, content) => {
    const updatedNotices = get().notices.map(notice => {
      if (notice.id === noticeId) {
        const newComment = {
          id: Date.now(),
          writer,
          content,
          createdAt: new Date().toLocaleString()
        };
        return {
          ...notice,
          comments: [...notice.comments, newComment]
        };
      }
      return notice;
    });
    
    set({ notices: updatedNotices });
    setLocalStorage('jc_notices', updatedNotices);
  },
  
  // 8. 활동 사진 앨범 추가 (교사)
  addAlbum: (title, imageUrl) => {
    const now = new Date().toISOString().split('T')[0];
    const newAlbum = {
      id: Date.now(),
      title,
      writer: '박사랑 선생님',
      createdAt: now,
      likes: 0,
      likedBy: [],
      image: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
      comments: []
    };
    
    const updatedAlbums = [newAlbum, ...get().albums];
    set({ albums: updatedAlbums });
    setLocalStorage('jc_albums', updatedAlbums);
  },
  
  // 9. 앨범 좋아요 누르기
  likeAlbum: (albumId, userId) => {
    const updatedAlbums = get().albums.map(album => {
      if (album.id === albumId) {
        const hasLiked = album.likedBy.includes(userId);
        const newLikedBy = hasLiked 
          ? album.likedBy.filter(id => id !== userId)
          : [...album.likedBy, userId];
        
        return {
          ...album,
          likes: hasLiked ? album.likes - 1 : album.likes + 1,
          likedBy: newLikedBy
        };
      }
      return album;
    });
    
    set({ albums: updatedAlbums });
    setLocalStorage('jc_albums', updatedAlbums);
  },
  
  // 10. 1:1 톡 메시지 발송
  sendMessage: (studentId, senderId, senderName, content, scheduledFor = null) => {
    const newMsg = {
      id: Date.now(),
      studentId,
      senderId,
      senderName,
      content,
      isRead: false,
      scheduledFor, // 예약 발송 시간
      timestamp: new Date().toLocaleString()
    };
    
    const updatedMessages = [...get().messages, newMsg];
    set({ messages: updatedMessages });
    setLocalStorage('jc_messages', updatedMessages);
  },

  // 11. 메시지 읽음 처리
  markMessagesAsRead: (studentId, role) => {
    const updatedMessages = get().messages.map(msg => {
      // 해당 대화방에서 내가 보낸 메시지가 아닌 것을 읽음 처리
      if (msg.studentId === studentId) {
        if (role === 'teacher' && msg.senderId !== 'teacher1') {
          return { ...msg, isRead: true };
        } else if (role === 'student' && msg.senderId === 'teacher1') {
          return { ...msg, isRead: true };
        }
      }
      return msg;
    });
    set({ messages: updatedMessages });
    setLocalStorage('jc_messages', updatedMessages);
  }
}));
