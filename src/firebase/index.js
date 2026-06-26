// Firebase 모듈 통합 export
// useStore.js에서 '../firebase' 로 import할 때 이 파일이 사용됩니다.
export { auth, db, rtdb, app, isFirebaseConfigured } from './config';
import { GoogleAuthProvider } from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
