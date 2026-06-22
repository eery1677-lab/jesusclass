import { create } from 'zustand';
import { collection, doc, onSnapshot, updateDoc, setDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';

// 로컬스토리지 헬퍼 (로그인 상태, 설정 등)
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
  // 1. 로컬 상태 (로그인, 설정 등)
  // currentUser: 초기값 null (인증 확인 전)
  currentUser: null,
  authLoading: true,
  teacherSettings: getLocalStorage('jc_teacher_settings', {
    dndEnabled: false,
    dndStart: '22:00',
    dndEnd: '08:00'
  }),
  churchName: getLocalStorage('jc_church_name', '양정교회'),
  churchContact: getLocalStorage('jc_church_contact', {
    phone: '02-123-4567',
    address: '서울특별시 은혜구 축복로 100\n지저스빌딩 3층',
    email: 'jesusclass@church.com'
  }),

  // 2. Firebase 상태 저장소
  students: [],
  notices: [],
  albums: [],
  messages: [],
  bulletins: [],
  snacks: [],
  snackRequests: [],
  schedules: [],
  scheduleMemos: [],
  
  // 데모용 자녀 로그인 코드 임시 저장소
  childLoginCodes: {},
  
  // 자녀용 코드 발급
  generateChildCode: (studentId) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤
    set(state => ({
      childLoginCodes: { ...state.childLoginCodes, [code]: studentId }
    }));
    return code;
  },
  
  // 자녀 전용 코드로 로그인
  loginWithChildCode: async (code) => {
    const studentId = get().childLoginCodes[code];
    if (studentId) {
      const student = get().students.find(s => s.id === studentId);
      set({
        currentUser: {
          uid: `child_${studentId}`,
          email: '',
          name: student?.name || '우리 아이',
          role: 'student',
          id: studentId,
          mode: 'child',
          isChildDirectLogin: true
        },
        authLoading: false
      });
      return true;
    }
    return false;
  },
  
  // 모드 전환 (부모 <-> 자녀)
  switchMode: (targetMode, pinCode) => {
    const user = get().currentUser;
    if (!user) return false;
    
    // 부모 -> 자녀 모드로 전환
    if (targetMode === 'child') {
      set({ currentUser: { ...user, mode: 'child' } });
      return true;
    }
    
    // 자녀 모드 -> 부모 모드로 전환
    if (targetMode === 'parent') {
      if (pinCode === '0000') {
        set({ currentUser: { ...user, mode: 'parent' } });
        return true;
      }
      return false; // 비밀번호 불일치
    }
    return false;
  },
  
  // 상태 업데이트 및 로컬스토리지 저장
  updateChurchName: (name) => {
    set({ churchName: name });
    setLocalStorage('jc_church_name', name);
  },
  updateChurchContact: (contact) => {
    set({ churchContact: contact });
    setLocalStorage('jc_church_contact', contact);
  },
  updateTeacherSettings: (settings) => {
    const newSettings = { ...get().teacherSettings, ...settings };
    set({ teacherSettings: newSettings });
    setLocalStorage('jc_teacher_settings', newSettings);
  },
  // Firebase 로그인 연동 (Google)
  loginWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Firebase 로그인 연동 (Email)
  loginWithEmail: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await signOut(auth);
      set({ currentUser: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // 3. Firebase 실시간 리스너 초기화
  initFirebaseListeners: () => {
    if (get()._listenersInitialized) return;
    set({ _listenersInitialized: true });

    // Firebase 인증 상태 리스너
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // users 컬렉션에서 권한 가져오기
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ 
            currentUser: { 
              uid: user.uid, 
              email: user.email,
              name: userData.name || user.displayName || '이름 없음',
              role: userData.role, 
              id: userData.studentId || user.uid, // 매칭된 학생 ID
              mode: userData.role === 'teacher' ? 'teacher' : 'parent',
              isChildDirectLogin: false
            },
            authLoading: false
          });
        } else {
          // 권한 정보가 없으면 임시로 학부모(parent)로 간주
          set({ 
            currentUser: { 
              uid: user.uid, 
              email: user.email,
              name: user.displayName || '학부모님',
              role: 'parent', 
              id: 'student1', // 임시 매핑
              mode: 'parent',
              isChildDirectLogin: false
            },
            authLoading: false
          });
        }
      } else {
        set({ currentUser: null, authLoading: false });
      }
    });

    const collections = [
      { name: 'students', stateKey: 'students' },
      { name: 'notices', stateKey: 'notices' },
      { name: 'albums', stateKey: 'albums' },
      { name: 'messages', stateKey: 'messages' },
      { name: 'bulletins', stateKey: 'bulletins' },
      { name: 'snacks', stateKey: 'snacks' },
      { name: 'snackRequests', stateKey: 'snackRequests' },
      { name: 'schedules', stateKey: 'schedules' },
      { name: 'scheduleMemos', stateKey: 'scheduleMemos' }
    ];

    collections.forEach(({ name, stateKey }) => {
      onSnapshot(collection(db, name), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 시간순 정렬 등 특정 컬렉션에 대한 후처리
        if (stateKey === 'notices' || stateKey === 'albums' || stateKey === 'bulletins') {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (stateKey === 'messages') {
          data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } else if (stateKey === 'schedules') {
          data.sort((a, b) => a.time.localeCompare(b.time));
        } else if (stateKey === 'snacks') {
          data.sort((a, b) => {
            const numA = parseInt(a.week) || 0;
            const numB = parseInt(b.week) || 0;
            return numA - numB;
          });
        }
        
        set({ [stateKey]: data });
      });
    });
  },

  // ==========================================
  // Firebase 뮤테이션 함수들
  // ==========================================

  // 1-1. 학생 프로필 업데이트
  updateStudentProfile: async (studentId, updates) => {
    try {
      await updateDoc(doc(db, "students", studentId), updates);
      
      const current = get().currentUser;
      if (current.role === 'student' && current.id === studentId && updates.name) {
        const newUser = { ...current, name: updates.name };
        set({ currentUser: newUser });
        setLocalStorage('jc_current_user', newUser);
      }
    } catch (e) { console.error(e); }
  },
  
  // 2. 일일 미션 제출
  submitMission: async (studentId, missionType, textContent = '') => {
    try {
      const student = get().students.find(s => s.id === studentId);
      if (!student) return;
      const now = new Date().toLocaleString();
      const dailyMissions = student.dailyMissions || {};
      
      await updateDoc(doc(db, "students", studentId), {
        [`dailyMissions.${missionType}`]: {
          status: 'pending',
          textContent: textContent,
          submittedAt: now
        }
      });
    } catch (e) { console.error(e); }
  },
  
  // 3. 일일 미션 승인
  approveMission: async (studentId, missionType) => {
    try {
      const student = get().students.find(s => s.id === studentId);
      if (!student) return;
      
      let extraAttendance = 0;
      let extraOffering = 0;
      let extraBible = 0;
      let extraDalant = 1;
      
      if (missionType === 'attendance') extraAttendance = 1;
      else if (missionType === 'offering') extraOffering = 1;
      else if (missionType === 'bible') { extraBible = 1; extraDalant = 2; }
      
      const newXp = (student.xp || 0) + 50;
      
      await updateDoc(doc(db, "students", studentId), {
        dalant: (student.dalant || 0) + extraDalant,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        attendanceCount: (student.attendanceCount || 0) + extraAttendance,
        offeringCount: (student.offeringCount || 0) + extraOffering,
        bibleCount: (student.bibleCount || 0) + extraBible,
        [`dailyMissions.${missionType}.status`]: 'completed'
      });
    } catch (e) { console.error(e); }
  },
  
  // 4. 일일 미션 반려
  rejectMission: async (studentId, missionType) => {
    try {
      await updateDoc(doc(db, "students", studentId), {
        [`dailyMissions.${missionType}`]: {
          status: 'none',
          textContent: '',
          submittedAt: null
        }
      });
    } catch (e) { console.error(e); }
  },
  
  // 5. 달란트 조정
  adjustDalant: async (studentId, amount, reason = '') => {
    try {
      const student = get().students.find(s => s.id === studentId);
      if (!student) return;
      
      const newDalant = Math.max(0, (student.dalant || 0) + amount);
      await updateDoc(doc(db, "students", studentId), { dalant: newDalant });
      
      get().sendMessage(
        studentId,
        'teacher1',
        '박사랑 선생님',
        `🎁 달란트가 변동되었습니다! [${amount > 0 ? '+' : ''}${amount} 달란트] 사유: ${reason}`
      );
    } catch (e) { console.error(e); }
  },
  
  // 6. 알림장 추가
  addNotice: async (title, content) => {
    try {
      const now = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, "notices", `notice_${Date.now()}`), {
        title,
        content,
        writer: '박사랑 선생님',
        createdAt: now,
        comments: []
      });
    } catch (e) { console.error(e); }
  },
  
  // 7. 알림장에 댓글 달기
  addCommentToNotice: async (noticeId, writer, content) => {
    try {
      const notice = get().notices.find(n => n.id === noticeId);
      if (!notice) return;
      
      const newComment = {
        id: `comment_${Date.now()}`,
        writer,
        content,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, "notices", noticeId), {
        comments: [...(notice.comments || []), newComment]
      });
    } catch (e) { console.error(e); }
  },
  
  // 8. 활동 사진 앨범 추가
  addAlbum: async (title, imageUrl) => {
    try {
      const now = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, "albums", `album_${Date.now()}`), {
        title,
        writer: '박사랑 선생님',
        createdAt: now,
        likes: 0,
        likedBy: [],
        image: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
        comments: []
      });
    } catch (e) { console.error(e); }
  },
  
  // 9. 앨범 좋아요 누르기
  likeAlbum: async (albumId, userId) => {
    try {
      const album = get().albums.find(a => a.id === albumId);
      if (!album) return;
      
      const hasLiked = (album.likedBy || []).includes(userId);
      const newLikedBy = hasLiked 
        ? album.likedBy.filter(id => id !== userId)
        : [...(album.likedBy || []), userId];
        
      await updateDoc(doc(db, "albums", albumId), {
        likes: hasLiked ? album.likes - 1 : album.likes + 1,
        likedBy: newLikedBy
      });
    } catch (e) { console.error(e); }
  },
  
  // 9-2. 앨범에 댓글 달기
  addCommentToAlbum: async (albumId, writer, content) => {
    try {
      const album = get().albums.find(a => a.id === albumId);
      if (!album) return;
      
      const newComment = {
        id: `comment_${Date.now()}`,
        writer,
        content,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, "albums", albumId), {
        comments: [...(album.comments || []), newComment]
      });
    } catch (e) { console.error(e); }
  },
  
  // 10. 1:1 톡 메시지 발송
  sendMessage: async (studentId, senderId, senderName, content, scheduledFor = null, imageUrl = null) => {
    try {
      await setDoc(doc(db, "messages", `msg_${Date.now()}`), {
        studentId,
        senderId,
        senderName,
        content,
        isRead: false,
        scheduledFor,
        imageUrl,
        timestamp: new Date().toISOString()
      });
    } catch (e) { console.error(e); }
  },

  // 11. 메시지 읽음 처리
  markMessagesAsRead: async (studentId, role) => {
    try {
      const messagesToUpdate = get().messages.filter(msg => {
        if (msg.studentId === studentId && !msg.isRead) {
          if (role === 'teacher' && msg.senderId !== 'teacher1') return true;
          if (role === 'student' && msg.senderId === 'teacher1') return true;
        }
        return false;
      });
      
      // 여러 개의 메시지를 한번에 업데이트
      for (const msg of messagesToUpdate) {
        await updateDoc(doc(db, "messages", msg.id), { isRead: true });
      }
    } catch (e) { console.error(e); }
  },

  // 12. 주보 관리
  addBulletin: async (title, content, imageUrl = null) => {
    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      await setDoc(doc(db, "bulletins", `bulletin_${Date.now()}`), {
        title,
        content,
        imageUrl,
        writer: get().currentUser?.name || '선생님',
        createdAt: formattedDate,
      });
    } catch (e) { console.error(e); }
  },

  deleteBulletin: async (id) => {
    try {
      await deleteDoc(doc(db, "bulletins", id));
    } catch (e) { console.error(e); }
  },

  // 13. 간식 후원 신청
  addSnackRequest: async (studentId, studentName, message) => {
    try {
      await setDoc(doc(db, "snackRequests", `req_${Date.now()}`), {
        studentId,
        studentName,
        message,
        createdAt: new Date().toISOString(),
        isRead: false
      });
    } catch (e) { console.error(e); }
  },

  // 14. 간식 메뉴 업데이트
  updateSnackMenu: async (snackId, updates) => {
    try {
      await updateDoc(doc(db, "snacks", snackId), updates);
    } catch (e) { console.error(e); }
  },

  // 15. 주일 일정 관리
  updateSchedule: async (scheduleId, updates) => {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), updates);
    } catch (e) { console.error(e); }
  },

  addSchedule: async (newSchedule) => {
    try {
      await setDoc(doc(db, "schedules", `schedule_${Date.now()}`), newSchedule);
    } catch (e) { console.error(e); }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      await deleteDoc(doc(db, "schedules", scheduleId));
    } catch (e) { console.error(e); }
  },

  // 16. 주일 일정 메모
  addScheduleMemo: async (studentId, studentName, message) => {
    try {
      await setDoc(doc(db, "scheduleMemos", `memo_${Date.now()}`), {
        studentId,
        studentName,
        message,
        createdAt: new Date().toISOString(),
        isRead: false
      });
    } catch (e) { console.error(e); }
  },

  markScheduleMemoAsRead: async (memoId) => {
    try {
      await updateDoc(doc(db, "scheduleMemos", memoId), { isRead: true });
    } catch (e) { console.error(e); }
  },

  // 17. 학생 결석 사유 및 심방 노트 업데이트
  updateStudentNote: async (studentId, noteType, content) => {
    try {
      await updateDoc(doc(db, "students", studentId), {
        [noteType]: content
      });
    } catch (e) { console.error(e); }
  },

  // 18. 교사 미션 상세 피드백 추가
  addMissionFeedback: async (studentId, missionType, feedback) => {
    try {
      await updateDoc(doc(db, "students", studentId), {
        [`dailyMissions.${missionType}.teacherFeedback`]: feedback
      });
    } catch (e) { console.error(e); }
  }
}));
