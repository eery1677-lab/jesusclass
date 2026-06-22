import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";

// 초기 가상 데이터베이스 구성
export const initialStudents = [
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
      bible: { status: 'none', textContent: '', submittedAt: null, teacherFeedback: null }
    },
    allergy: ['땅콩', '우유'],
    absenceReason: '',
    simbangNote: '새학기 적응 중, 기도 부탁드림'
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
      bible: { status: 'pending', textContent: '여호와는 나의 목자시니 내게 부족함이 없으리로다 (시 23:1)', submittedAt: '2026-06-20 09:20', teacherFeedback: null }
    },
    allergy: [],
    absenceReason: '',
    simbangNote: ''
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
      bible: { status: 'none', textContent: '', submittedAt: null, teacherFeedback: null }
    },
    allergy: ['복숭아'],
    absenceReason: '가족 여행',
    simbangNote: '여행 중 건강을 위해 기도'
  }
];

export const initialNotices = [
  {
    id: "notice_1",
    title: '📢 이번 주일 야외 특별 예배 및 준비물 안내',
    content: '샬롬! 이번 주일(6월 21일)은 교회 앞 푸른 언덕 공원에서 야외 예배로 드려집니다. 아이들이 뜨거운 햇빛을 피할 수 있도록 개인 모자와 돗자리를 지참할 수 있게 지도해 주세요! 예배 후에 맛있는 피자 간식 시간도 준비되어 있습니다! 🍕',
    writer: '박사랑 선생님',
    createdAt: '2026-06-20',
    comments: [
      { id: "comment_101", writer: '김예찬 학부모', content: '알겠습니다, 선생님! 예찬이 모자 씌워서 보내겠습니다. 😊', createdAt: '2026-06-20 10:15' },
      { id: "comment_102", writer: '이주은 학부모', content: '돗자리도 하나 챙겨 보낼게요. 감사합니다!', createdAt: '2026-06-20 11:30' }
    ]
  },
  {
    id: "notice_2",
    title: '📜 6월 3주차 성경 암송 요절',
    content: '“하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라” (요한복음 3장 16절 말씀) \n\n매일 스스로 외워보고 미션 창에 입력해 보세요! 성공 시 2달란트가 지급됩니다.',
    writer: '박사랑 선생님',
    createdAt: '2026-06-18',
    comments: []
  }
];

export const initialAlbums = [
  {
    id: "album_1",
    title: '🌿 지난 주일 신나는 성경 퀴즈 골든벨 현장!',
    writer: '박사랑 선생님',
    createdAt: '2026-06-14',
    likes: 15,
    likedBy: [],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    comments: [
      { id: "comment_201", writer: '김예찬 학부모', content: '아이들이 정말 신나 보이네요! 말씀 공부가 재밌나 봐요.', createdAt: '2026-06-14 15:40' }
    ]
  },
  {
    id: "album_2",
    title: '🎈 초등부 여름 성경학교 준비를 위한 풍선 데코 완료',
    writer: '이주은 선생님',
    createdAt: '2026-06-12',
    likes: 9,
    likedBy: [],
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000',
    comments: []
  }
];

export const initialMessages = [
  {
    id: "msg_1",
    studentId: 'student1',
    senderId: 'teacher1',
    senderName: '박사랑 선생님',
    content: '예찬아! 지난주에 아프다고 들었는데, 몸은 좀 괜찮아졌니? 주일에 건강한 모습으로 보자!',
    timestamp: '2026-06-20 09:30'
  },
  {
    id: "msg_2",
    studentId: 'student1',
    senderId: 'student1',
    senderName: '김예찬',
    content: '네 선생님! 이제 다 나았어요. 주일에 교회 일찍 갈게요!',
    timestamp: '2026-06-20 10:02'
  }
];

export const initialBulletins = [
  {
    id: "bulletin_1",
    title: '6월 3주차 주일학교 주보',
    content: '1. 사도신경\n2. 찬양 (예수 사랑하심은)\n3. 대표기도 (이주은 어린이)\n4. 말씀 (마태복음 5장 13-16절)\n5. 헌금 및 주기도문',
    imageUrl: null,
    writer: '박사랑 선생님',
    createdAt: '2026-06-20',
  }
];

export const initialSnacks = [
  { id: "snack_1", week: '1주차', date: '6월 6일', menu: '햄버거 세트, 과일 주스', sponsor: '김예찬 학생 가정', emoji: '🍔', isCurrent: false },
  { id: "snack_2", week: '2주차', date: '6월 13일', menu: '피자, 콜라', sponsor: '이하늘 학생 가정', emoji: '🍕', isCurrent: false },
  { id: "snack_3", week: '3주차', date: '6월 20일 (이번주)', menu: '샌드위치, 우유', sponsor: '주일학교 교사 일동', emoji: '🥪', isCurrent: true },
  { id: "snack_4", week: '4주차', date: '6월 27일', menu: '떡볶이, 튀김', sponsor: '박준영 학생 가정', emoji: '떡', isCurrent: false },
];

export const initialSchedules = [
  { id: "schedule_1", time: '09:00', title: '주일학교 찬양 및 예배', location: '소예배실', iconType: 'Users', color: '#10B981', bg: '#D1FAE5' },
  { id: "schedule_2", time: '10:00', title: '반별 공과 공부', location: '각 반 교실', iconType: 'Calendar', color: '#3B82F6', bg: '#DBEAFE' },
  { id: "schedule_3", time: '10:40', title: '간식 및 친교 시간', location: '친교실', iconType: 'Clock', color: '#F59E0B', bg: '#FEF3C7' },
  { id: "schedule_4", time: '11:00', title: '오후 활동 (체육/미술)', location: '야외 및 체육관', iconType: 'MapPin', color: '#10B981', bg: '#D1FAE5' },
  { id: "schedule_5", time: '12:00', title: '귀가', location: '본당 앞', iconType: 'Users', color: '#6B7280', bg: '#F3F4F6' },
];

export async function uploadInitialDataToFirestore() {
  console.log("🔥 Starting data migration to Firestore...");
  try {
    for (const student of initialStudents) {
      await setDoc(doc(db, "students", student.id), student);
    }
    for (const notice of initialNotices) {
      await setDoc(doc(db, "notices", notice.id), notice);
    }
    for (const album of initialAlbums) {
      await setDoc(doc(db, "albums", album.id), album);
    }
    for (const msg of initialMessages) {
      await setDoc(doc(db, "messages", msg.id), msg);
    }
    for (const bulletin of initialBulletins) {
      await setDoc(doc(db, "bulletins", bulletin.id), bulletin);
    }
    for (const snack of initialSnacks) {
      await setDoc(doc(db, "snacks", snack.id), snack);
    }
    for (const schedule of initialSchedules) {
      await setDoc(doc(db, "schedules", schedule.id), schedule);
    }
    console.log("✅ Data migration successful!");
    alert("Firebase 데이터 초기화가 완료되었습니다!");
  } catch (error) {
    console.error("❌ Error migrating data:", error);
    alert("오류가 발생했습니다: " + error.message);
  }
}
