import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Smile, Check, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';
import { uploadImage } from '../utils/uploadImage';

export default function ProfileEditModal({ isOpen, onClose }) {
  const { currentUser, students, updateStudentProfile, churchName: storeChurchName, updateChurchName } = useStore();
  const student = students.find(s => s.id === currentUser?.id);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [churchName, setChurchName] = useState('');
  const [showAvatars, setShowAvatars] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (isOpen && student) {
      setName(student.name);
      setGrade(student.grade);
      setAvatar(student.avatar || '👦');
      setImageUrl(student.imageUrl || '');
      setAllergies(student.allergy || []);
      setChurchName(storeChurchName || '교회학교');
    }
  }, [isOpen, student, storeChurchName]);

  if (!isOpen || currentUser?.role !== 'student' || !student) return null;

  const avatars = [
    // 사람 & 어린이
    '👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '👱', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👱‍♂️', '👱‍♀️',
    // 꿈 & 판타지
    '👼', '🦸', '🦸‍♀️', '🧚', '🧚‍♂️', '🧙‍♂️', '🧙‍♀️', '🛸', '🚀', '👑',
    // 귀여운 동물
    '🦁', '🐻', '🐼', '🐰', '🐱', '🐶', '🐹', '🐨', '🦊', '🐯', '🦄', '🐳', '🐥', '🦖',
    // 일상 & 표정
    '😀', '😆', '😎', '🧸', '🎈', '🎨', '⚽', '🎹', '🎸', '📚'
  ];

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const url = await uploadImage(file, 'profiles/students', { maxSize: 600, quality: 0.85 });
      setImageUrl(url);
      setAvatar('');
    } catch (err) {
      console.error('학생 프로필 업로드 실패:', err);
      setUploadError('사진 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAllergy = (item) => {
    setAllergies(allergies.filter(a => a !== item));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStudentProfile(student.id, {
      name,
      grade,
      avatar,
      imageUrl,
      allergy: allergies
    });
    if (churchName !== storeChurchName) {
      updateChurchName(churchName);
    }
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>프로필 수정</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarPreviewContainer}>
              <div style={styles.avatarPreview}>
                {imageUrl ? (
                  <img src={imageUrl} alt="profile" style={styles.uploadedImage} />
                ) : (
                  avatar
                )}
              </div>
              <button type="button" onClick={() => !isUploading && document.getElementById('profile-upload').click()} style={styles.uploadBtn} disabled={isUploading}>
                {isUploading ? (
                  <Loader size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Camera size={16} color="white" />
                )}
              </button>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={isUploading}
                style={{ display: 'none' }} 
              />
            </div>
            {uploadError && (
              <div style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 600, textAlign: 'center', marginTop: '4px' }}>
                ⚠️ {uploadError}
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0 0' }}>
              {isUploading ? '📤 업로드 중...' : '사진을 업로드하거나 기본 아바타를 선택하세요.'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed var(--border-color)', margin: '8px 16px 0', lineHeight: 1.4, textAlign: 'center' }}>
              ⚠️ 갤럭시 울트라 등 <b>고해상도 모바일 사진</b>은 용량이 너무 커 업로드가 실패할 수 있습니다. 안 되시는 경우 <b>캡처(스크린샷) 사진</b>이나 <b>카카오톡 다운로드 사진</b>을 올리시거나 아래 <b>기본 아바타</b>를 선택해 주세요!
            </p>
            
            <button 
              type="button" 
              onClick={() => setShowAvatars(!showAvatars)}
              style={styles.toggleAvatarsBtn}
            >
              {showAvatars ? '아바타 선택 닫기' : '기본 아바타 선택하기'}
            </button>

            {showAvatars && (
              <div style={styles.avatarGrid}>
                {avatars.map(a => (
                  <button 
                    key={a} 
                    type="button"
                    style={{...styles.avatarOption, border: (avatar === a && !imageUrl) ? '2px solid var(--primary)' : '1px solid var(--border-color)'}}
                    onClick={() => { setAvatar(a); setImageUrl(''); }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>교회 (또는 부서) 이름</label>
              <input 
                type="text" 
                value={churchName} 
                onChange={e => setChurchName(e.target.value)}
                style={styles.input}
                placeholder="예: 양정교회"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>이름</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>반(소속)</label>
              <input 
                type="text" 
                value={grade} 
                onChange={e => setGrade(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>알레르기 정보</label>
              <div style={styles.allergyFormWrapper}>
                <input 
                  type="text" 
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(e); } }}
                  placeholder="예: 땅콩, 복숭아, 우유" 
                  style={{...styles.input, flex: 1}}
                />
                <button type="button" style={styles.addBtn} onClick={handleAddAllergy}>추가</button>
              </div>
              <div style={styles.allergyTags}>
                {allergies.map(item => (
                  <div key={item} style={styles.allergyTag}>
                    {item} 
                    <button type="button" style={styles.tagRemoveBtn} onClick={() => handleRemoveAllergy(item)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {allergies.length === 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>등록된 알레르기가 없습니다.</div>
                )}
              </div>
            </div>

            <button type="submit" style={styles.saveBtn} disabled={isUploading}>
              {isUploading ? '업로드 중...' : <><Check size={18} /> 저장하기</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '400px',
    maxHeight: '90vh',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid var(--border-color)',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  avatarPreviewContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatarPreview: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'var(--bg-app)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.8rem',
    border: '2px solid var(--primary)',
    boxShadow: '0 4px 14px rgba(123, 61, 255, 0.25)',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid white',
    boxShadow: 'var(--shadow-card)',
  },
  avatarGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '10px',
  },
  avatarOption: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'var(--bg-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toggleAvatarsBtn: {
    background: 'var(--bg-main)',
    border: '1.5px solid var(--border-input)',
    color: 'var(--text-main)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '5px'
  },
  allergyFormWrapper: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  addBtn: {
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    border: '1.5px solid var(--border-input)',
    padding: '0 16px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    cursor: 'pointer',
  },
  allergyTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  allergyTag: {
    background: 'rgba(244, 63, 94, 0.1)',
    color: '#F43F5E',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tagRemoveBtn: {
    background: 'transparent',
    border: 'none',
    color: '#F43F5E',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  input: {
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border-input)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
  }
};
