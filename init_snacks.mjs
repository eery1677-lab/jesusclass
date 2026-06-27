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

// 초기 snacks 데이터 (4주치)
const initialSnacks = [
  {
    id: 'snack_week1',
    week: '1주',
    date: '7월 6일',
    menu: '메뉴 미정',
    sponsor: '',
    emoji: '🍽️',
    isCurrent: true
  },
  {
    id: 'snack_week2',
    week: '2주',
    date: '7월 13일',
    menu: '메뉴 미정',
    sponsor: '',
    emoji: '🍽️',
    isCurrent: false
  },
  {
    id: 'snack_week3',
    week: '3주',
    date: '7월 20일',
    menu: '메뉴 미정',
    sponsor: '',
    emoji: '🍽️',
    isCurrent: false
  },
  {
    id: 'snack_week4',
    week: '4주',
    date: '7월 27일',
    menu: '메뉴 미정',
    sponsor: '',
    emoji: '🍽️',
    isCurrent: false
  }
];

async function initSnacks() {
  console.log('snacks 컬렉션 확인 중...');
  
  // 이미 데이터가 있는지 확인
  const existing = await getDocs(collection(db, 'snacks'));
  if (existing.size > 0) {
    console.log(`이미 ${existing.size}개의 snack 문서가 있습니다. 건너뜁니다.`);
    process.exit(0);
  }
  
  console.log('snacks 초기 데이터 삽입 중...');
  for (const snack of initialSnacks) {
    await setDoc(doc(db, 'snacks', snack.id), snack);
    console.log(`✅ ${snack.week} (${snack.date}) 추가됨`);
  }
  
  console.log('✅ snacks 초기화 완료!');
  process.exit(0);
}

initSnacks().catch(err => {
  console.error('오류:', err);
  process.exit(1);
});
