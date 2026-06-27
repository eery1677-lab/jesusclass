import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BannerAd() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense Banner load error:', e);
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span style={styles.adLabel}>Ad</span>
        <div style={{ minWidth: '320px', minHeight: '50px' }}>
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '320px', height: '50px' }}
               data-ad-client="ca-pub-7007910390274539" // 대표님 애드몹 ca-pub 번호
               data-ad-slot="1376655256" // 발급받으신 하단 배너 광고 slot 번호
               ></ins>
        </div>
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
