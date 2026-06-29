import { create } from 'zustand';
import { collection, doc, onSnapshot, updateDoc, setDoc, deleteDoc, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { ref, remove } from 'firebase/database';
import { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import { rtdb, isFirebaseConfigured } from '../firebase/config';

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
  churchName: getLocalStorage('jc_church_name', ''),
  churchContact: getLocalStorage('jc_church_contact', {
    phone: '',
    address: '',
    email: ''
  }),
  isMoreMenuOpen: false,
  chatOpen: false,
  activeChatStudentId: '',

  // 2. Firebase 상태 저장소
  students: [],
  users: [],
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
  generateChildCode: async (studentId) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤
    try {
      await setDoc(doc(db, "childLoginCodes", code), {
        studentId,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("자녀 코드 저장 에러:", e);
    }
    set(state => ({
      childLoginCodes: { ...state.childLoginCodes, [code]: studentId }
    }));
    return code;
  },
  
  // 자녀 전용 코드로 로그인
  loginWithChildCode: async (code) => {
    // 1. 먼저 로컬 상태에서 코드 확인
    let studentId = get().childLoginCodes[code];
    
    // 2. 로컬에 없는 경우 Firestore에서 조회
    if (!studentId) {
      try {
        const codeDoc = await getDoc(doc(db, "childLoginCodes", code));
        if (codeDoc.exists()) {
          const data = codeDoc.data();
          // 만료 시간 체크 (15분 초과 시 만료)
          const createdAt = new Date(data.createdAt);
          const now = new Date();
          const diffMinutes = (now - createdAt) / (1000 * 60);
          if (diffMinutes < 15) {
            studentId = data.studentId;
          } else {
            console.log("코드가 만료되었습니다.");
          }
        }
      } catch (e) {
        console.error("자녀 코드 조회 에러:", e);
      }
    }

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
  updateTeacherSettings: async (settings) => {
    const newSettings = { ...get().teacherSettings, ...settings };
    set({ teacherSettings: newSettings });
    setLocalStorage('jc_teacher_settings', newSettings);
    
    // Firestore settings/teacher 문서에 실시간 동기화 저장
    try {
      await setDoc(doc(db, 'settings', 'teacher'), newSettings, { merge: true });
    } catch (e) {
      console.error('교사 설정 Firestore 저장 에러:', e);
    }
  },
  setMoreMenuOpen: (isOpen) => set({ isMoreMenuOpen: isOpen }),
  setChatOpen: (isOpen) => set({ chatOpen: isOpen }),
  setActiveChatStudentId: (id) => set({ activeChatStudentId: id }),
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

  // 역할 선택 (최초 1회)
  selectRole: async (role) => {
    const user = get().currentUser;
    if (!user) return;
    
    const userData = {
      role: role,
      name: user.name || '사용자',
      email: user.email || '',
      createdAt: new Date().toISOString(),
    };
    
    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      set({
        currentUser: {
          ...user,
          role: role,
          id: null,
          mode: role === 'teacher' ? 'teacher' : 'parent',
          needsRoleSelection: false
        }
      });
    } catch (e) {
      console.error('역할 저장 실패:', e);
      throw e;
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
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ 
            currentUser: { 
              uid: user.uid, 
              email: user.email,
              name: userData.name || user.displayName || '이름 없음',
              role: userData.role, 
              id: userData.studentId || null, // 매칭된 학생 ID (없으면 null)
              mode: userData.role === 'teacher' ? 'teacher' : 'parent',
              isChildDirectLogin: false
            },
            authLoading: false
          });
        } else {
          // 권한 정보가 전혀 없는 신규 가입자! (eery1677@gmail.com 도 처음 가입/로그인 시 여기에 진입합니다.)
          set({ 
            currentUser: { 
              uid: user.uid, 
              email: user.email,
              name: user.displayName || '신규 사용자',
              role: null,
              id: null,
              mode: null,
              isChildDirectLogin: false,
              needsRoleSelection: true
            },
            authLoading: false
          });
        }
      } else {
        set({ currentUser: null, authLoading: false });
      }
    });

    // 교사 설정 실시간 리스너 추가
    onSnapshot(doc(db, 'settings', 'teacher'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        set({ teacherSettings: data });
        setLocalStorage('jc_teacher_settings', data);
      }
    });

    const collections = [
      { name: 'students', stateKey: 'students' },
      { name: 'users', stateKey: 'users' },
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
  
  sendMessage: async (studentId, senderId, senderName, content, scheduledFor = null, imageUrl = null) => {
    const msgData = {
      studentId,
      senderId,
      senderName,
      content,
      isRead: false,
      scheduledFor,
      imageUrl,
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Firestore 저장
      await setDoc(doc(db, "messages", `msg_${Date.now()}`), msgData);
      
      // 2. Realtime Database 동기화 (활성화 시)
      if (isFirebaseConfigured && rtdb) {
        const { ref, push, set } = await import('firebase/database');
        const chatRef = ref(rtdb, `chats/${studentId}`);
        const newMsgRef = push(chatRef);
        await set(newMsgRef, msgData);
      }
    } catch (e) {
      console.error('메시지 전송 실패:', e);
    }
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

  addSnack: async (newSnack) => {
    try {
      await setDoc(doc(db, "snacks", newSnack.id || `snack_${Date.now()}`), newSnack);
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
  },

  // 19. 학생 추가 및 삭제
  addStudent: async (name, avatar = '👦') => {
    try {
      const studentId = `student_${Date.now()}`;
      await setDoc(doc(db, "students", studentId), {
        name,
        avatar,
        attendanceCount: 0,
        dalantBalance: 0,
        createdAt: new Date().toISOString(),
        dailyMissions: {}
      });
    } catch (e) { console.error('학생 추가 실패:', e); }
  },

  deleteStudent: async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
    } catch (e) { console.error('학생 삭제 실패:', e); }
  },

  // 20. 자녀정보 매핑 승인
  approveStudentMapping: async (userId, studentId) => {
    try {
      await updateDoc(doc(db, "users", userId), { studentId });
    } catch (e) {
      console.error('자녀 정보 매핑 승인 실패:', e);
    }
  }
}));
