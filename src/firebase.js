// Firebase 구버전 호환용 진입점
// 실제 설정은 ./firebase/index.js 에서 모듈화하여 관리합니다.
export { auth, db, rtdb, app, isFirebaseConfigured, googleProvider } from './firebase/index.js';
