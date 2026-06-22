import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "jesusclass-app-2026",
  appId: "1:54216310857:web:4f6d71dfee7df2d2febf98",
  storageBucket: "jesusclass-app-2026.firebasestorage.app",
  apiKey: "AIzaSyCiOEyKwlW8S-9nKq-_gRx6YOgbkiIo4kE",
  authDomain: "jesusclass-app-2026.firebaseapp.com",
  messagingSenderId: "54216310857"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAccounts() {
  try {
    console.log("계정 생성을 시작합니다...");

    // 1. 교사 계정
    try {
      const t1 = await createUserWithEmailAndPassword(auth, 'teacher@jesus.com', '123456');
      await setDoc(doc(db, 'users', t1.user.uid), {
        name: '박사랑 선생님',
        role: 'teacher',
        teacherId: 'teacher1',
        email: 'teacher@jesus.com'
      });
      console.log("✅ 교사 계정 생성 완료: teacher@jesus.com / 123456");
      await signOut(auth);
    } catch(e) {
      console.log("교사 계정 생성 에러 (이미 있을 수 있음):", e.message);
    }

    // 2. 학생(학부모) 계정
    try {
      const s1 = await createUserWithEmailAndPassword(auth, 'student@jesus.com', '123456');
      await setDoc(doc(db, 'users', s1.user.uid), {
        name: '김예찬',
        role: 'student',
        studentId: 'student1',
        email: 'student@jesus.com'
      });
      console.log("✅ 학생 계정 생성 완료: student@jesus.com / 123456");
      await signOut(auth);
    } catch(e) {
      console.log("학생 계정 생성 에러 (이미 있을 수 있음):", e.message);
    }

    console.log("✨ 모든 테스트 계정 세팅이 완료되었습니다!");
    process.exit(0);
  } catch (error) {
    console.error("전체 에러:", error);
    process.exit(1);
  }
}

createAccounts();
