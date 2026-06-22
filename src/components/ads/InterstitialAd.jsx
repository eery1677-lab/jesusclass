import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function InterstitialAd({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div style={styles.overlay}>
      <div style={styles.container} className="animate-fade-in">
        <div style={styles.header}>
          <span style={styles.adLabel}>Sponsored</span>
          {timeLeft > 0 ? (
            <span style={styles.timer}>{timeLeft}초 후 닫기 가능</span>
          ) : (
            <button style={styles.closeBtn} onClick={onClose}>
              <X size={24} />
            </button>
          )}
        </div>
        <div style={styles.body}>
          <h2 style={{margin: 0, color: 'var(--text-main)'}}>여름 성경 학교 캠프 사전 접수</h2>
          <p style={{margin: 0, color: 'var(--text-muted)'}}>특별한 경험을 선물하세요!</p>
          <div style={styles.dummyImage}>
            <span>Ad Image Area</span>
          </div>
          <button style={styles.actionBtn}>자세히 보기</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  container: {
    width: '90%',
    maxWidth: '400px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
  },
  adLabel: {
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-main)',
    padding: '0',
    display: 'flex',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
  },
  dummyImage: {
    width: '100%',
    height: '200px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
  },
  actionBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  }
};
