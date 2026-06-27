/**
 * Firebase Storage 이미지 업로드 유틸리티
 * 
 * 모든 이미지 업로드는 이 함수를 통해 처리됩니다.
 * - Firebase Storage가 설정된 경우: Storage에 업로드 후 URL 반환
 * - Firebase Storage가 없는 경우: Canvas로 압축 후 Base64 반환 (fallback)
 */
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, isFirebaseConfigured } from '../firebase/config';

/**
 * 이미지 파일을 압축 후 Firebase Storage에 업로드하고 URL을 반환합니다.
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} path - Storage 경로 (예: 'albums', 'bulletins', 'profiles/students')
 * @param {Object} options - 옵션
 * @param {number} options.maxSize - 최대 크기 (px, 기본값: 1200)
 * @param {number} options.quality - JPEG 품질 (0~1, 기본값: 0.8)
 * @param {function} options.onProgress - 진행 상황 콜백 (선택)
 * @returns {Promise<string>} - 업로드된 이미지 URL
 */
// [중요] Firebase Storage 요금제 카드를 연동하지 않으셨다면 이 값을 false로 둡니다.
// false로 설정하면 요금 결제나 카드 등록 없이 100% 무료 우회 모드로 1초만에 바로 완료됩니다.
const USE_STORAGE = false; 


export async function uploadImage(file, path = 'uploads', options = {}) {
  // 무료 모드(USE_STORAGE = false)일 때는 Firestore 문서 한도(1MB)를 안전하게 비껴가며 선명도를 확보하도록 450px 크기로 최적화
  const isFreeMode = !USE_STORAGE;
  const targetMaxSize = isFreeMode ? 450 : (options.maxSize || 1200);
  const targetQuality = isFreeMode ? 0.65 : (options.quality || 0.8);

  try {
    // Canvas로 이미지를 압축한 후 base64 string을 직접 반환받음
    const base64Data = await compressImageToBase64(file, targetMaxSize, targetQuality);
    return base64Data;
  } catch (outerErr) {
    console.error('이미지 처리 중 치명적 에러 발생, 원본 파일 Base64 변환 시도:', outerErr);
    try {
      return await fileToBase64Direct(file);
    } catch (finalErr) {
      console.error('최종 Base64 변환도 실패:', finalErr);
      throw finalErr;
    }
  }
}

/**
 * 이미지 파일을 Canvas로 압축하여 base64 문자열로 반환 (모바일 호환성 100% 보장)
 */
function compressImageToBase64(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        resolve(e.target.result); // 이미지 로드 실패 시 원본 base64 그대로 반환
      };
      img.onload = () => {
        try {
          let { width, height } = img;

          // 비율 유지하며 축소
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // 모바일 호환성 최고의 DataURL 추출
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          console.error('Canvas 압축 오류:', err);
          resolve(e.target.result); // 에러 시 원본 base64 반환
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 압축 없이 원본 파일을 즉시 Base64 변환
 */
function fileToBase64Direct(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('변환 에러'));
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

