import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function BannerAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span style={styles.adLabel}>Ad</span>
        <span style={styles.adText}>어린이 성경 교재 특별 기획전! (예시 광고)</span>
      </div>
      <button style={styles.closeBtn} onClick={() => setIsVisible(false)}>
        <X size={16} />
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: 'var(--bg-card)',
    borderTop: '1px solid var(--border-color)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
    zIndex: 100,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  adLabel: {
    backgroundColor: '#FFD700',
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  adText: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
