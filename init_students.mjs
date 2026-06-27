import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCiOEyKwlW8S-9nKq-_gRx6YOgbkiIo4kE",
  authDomain: "jesusclass-app-2026.firebaseapp.com",
  projectId: "jesusclass-app-2026",
  storageBucket: "jesusclass-app-2026.firebasestorage.app",
  messagingSenderId: "54216310857",
  appId: "1:54216310857:web:4f6d71dfee7df2d2febf98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialStudents = [
  {
    id: 'student1',
    name: '김예찬',
    avatar: '👦',
    dalant: 15,
    attendanceCount: 12,
    absenceReason: '',
    simbangNote: '',
    dailyMissions: {
      attendance: { status: 'idle', submittedAt: '' },
      offering: { status: 'idle', submittedAt: '' },
      bible: { status: 'idle', submittedAt: '' }
    }
  },
  {
    id: 'student2',
    name: '박온유',
    avatar: '👧',
    dalant: 20,
    attendanceCount: 15,
    absenceReason: '',
    simbangNote: '',
    dailyMissions: {
      attendance: { status: 'idle', submittedAt: '' },
      offering: { status: 'idle', submittedAt: '' },
      bible: { status: 'idle', submittedAt: '' }
    }
  },
  {
    id: 'student3',
    name: '이주원',
    avatar: '👦',
    dalant: 18,
    attendanceCount: 14,
    absenceReason: '',
    simbangNote: '',
    dailyMissions: {
      attendance: { status: 'idle', submittedAt: '' },
      offering: { status: 'idle', submittedAt: '' },
      bible: { status: 'idle', submittedAt: '' }
    }
  },
  {
    id: 'student4',
    name: '최다온',
    avatar: '👧',
    dalant: 22,
    attendanceCount: 16,
    absenceReason: '',
    simbangNote: '',
    dailyMissions: {
      attendance: { status: 'idle', submittedAt: '' },
      offering: { status: 'idle', submittedAt: '' },
      bible: { status: 'idle', submittedAt: '' }
    }
  }
];

async function initStudents() {
  console.log('students 컬렉션 확인 중...');
  
  console.log('students 초기 데이터 삽입 중...');
  for (const student of initialStudents) {
    await setDoc(doc(db, 'students', student.id), student);
    console.log(`✅ ${student.name} 추가됨`);
  }
  
  console.log('✅ students 초기화 완료!');
  process.exit(0);
}

initStudents().catch(err => {
  console.error('오류:', err);
  process.exit(1);
});
