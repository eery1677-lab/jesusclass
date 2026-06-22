import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Smile, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function TeacherProfileEditModal({ isOpen, onClose }) {
  const { currentUser, teacherSettings, updateTeacherSettings } = useStore();

  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showAvatars, setShowAvatars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(teacherSettings.name || currentUser.name || '박사랑 선생님');
      setClassName(teacherSettings.className || '열매 맺는 반');
      setAvatar(teacherSettings.avatar || '👩‍🏫');
      setImageUrl(teacherSettings.imageUrl || '');
    }
  }, [isOpen, teacherSettings, currentUser]);

  if (!isOpen || currentUser?.role !== 'teacher') return null;

  const avatars = ['👨‍🏫', '👩‍🏫', '🧑‍🏫', '🦁', '🐻', '🐼', '🐰', '🐯', '🦊', '🐱', '🐶', '🐹', '🐨', '🐢', '🦖'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 300;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImageUrl(dataUrl);
          setAvatar('');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateTeacherSettings({
      name,
      className,
      avatar,
      imageUrl
    });
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal} className="animate-fade-up">
        <div style={styles.header}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>교사 프로필 수정</h2>
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
              <button type="button" onClick={() => document.getElementById('teacher-profile-upload').click()} style={styles.uploadBtn}>
                <Camera size={16} color="white" />
              </button>
              <input 
                id="teacher-profile-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>사진을 업로드하거나 기본 아바타를 선택하세요.</p>
            
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
              <label style={styles.label}>이름 (직분 포함)</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                style={styles.input}
                placeholder="예: 박사랑 선생님"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>맡은 반 이름</label>
              <input 
                type="text" 
                value={className} 
                onChange={e => setClassName(e.target.value)}
                style={styles.input}
                placeholder="예: 열매 맺는 반"
              />
            </div>

            <button type="submit" style={styles.saveBtn}>
              <Check size={18} /> 저장하기
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
