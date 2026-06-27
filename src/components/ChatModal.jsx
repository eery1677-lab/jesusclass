import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Send, X, MessageSquare, Clock, Moon, Check, CheckCheck, ChevronLeft, Menu, Plus, Smile, Bell, Loader } from 'lucide-react';
import { rtdb, isFirebaseConfigured } from '../firebase/config';
import { ref, onValue, off, push } from 'firebase/database';
import { uploadImage } from '../utils/uploadImage';

export default function ChatModal({ isOpen, onClose }) {
  const { 
    currentUser, 
    students, 
    messages: storeMessages,
    sendMessage,
    teacherSettings, 
    updateTeacherSettings,
    markMessagesAsRead,
    activeChatStudentId,
    setActiveChatStudentId
  } = useStore();

  // 실시간 메시지 상태 (Realtime DB 구독)
  const [realtimeMessages, setRealtimeMessages] = useState([]);

  // 현재 사용할 messages (Firebase 연결 여부에 따라)
  const messages = isFirebaseConfigured ? (realtimeMessages || []) : (storeMessages || []);
  
  const [inputText, setInputText] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showNoticeSender, setShowNoticeSender] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [noticeImage, setNoticeImage] = useState('');
  const [isSendingNotice, setIsSendingNotice] = useState(false);
  const [isChatImageUploading, setIsChatImageUploading] = useState(false);
  const [isNoticeImageUploading, setIsNoticeImageUploading] = useState(false);
  const [noticeImageError, setNoticeImageError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const noticeFileInputRef = useRef(null);

  const emojis = [
    '😀', '😂', '😍', '🥰', '😎', '😇', '🤔', '😊', '😉', '🤣',
    '🙏', '👍', '👏', '🙌', '💪', '🤝', '✌️', '👌', '🤞', '☝️',
    '💖', '❤️', '💕', '🎉', '🔥', '✨', '🌟', '🌈', '🎁', '🎈',
    '⛪', '✝️', '🕊️', '📖', '🎵'
  ];

  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatDateHeader = (timestamp) => {
    if (!timestamp) return '날짜 정보 없음';
    let date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    
    if (isNaN(date) && typeof timestamp === 'string') {
      const match = timestamp.match(/(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/);
      if (match) {
        date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      }
    }
    
    if (isNaN(date)) return '날짜 정보 없음';
    
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}`;
  };

  // 대화방 자동 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, activeChatStudentId, isOpen]);

  // 대기방 초기 선택 및 읽음 처리
  useEffect(() => {
    if (!isOpen) return;
    
    if (currentUser.role === 'teacher' && students.length > 0 && !activeChatStudentId) {
      setActiveChatStudentId(students[0].id);
    } else if (currentUser.role === 'student' || currentUser.role === 'parent') {
      // currentUser.id가 실제 student 문서 ID인지 확인
      // initFirebaseListeners에서 id: userData.studentId || user.uid 로 설정됨
      // students 목록에 있는 ID이면 그대로 사용, 없으면 첫번째 학생으로 fallback
      const matchedStudent = students.find(s => s.id === currentUser.id);
      const chatId = matchedStudent ? matchedStudent.id : (students[0]?.id || currentUser.id || currentUser.uid);
      setActiveChatStudentId(chatId);
    }
    
    if (activeChatStudentId) {
      markMessagesAsRead(activeChatStudentId, currentUser.role);
    }
  }, [currentUser, students, activeChatStudentId, isOpen, markMessagesAsRead]);

  // 🔥 Realtime DB 구독 — 대화방 변경 시 실시간 메시지 수신
  useEffect(() => {
    if (!isFirebaseConfigured || !rtdb || !activeChatStudentId) return;

    const chatRef = ref(rtdb, `chats/${activeChatStudentId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRealtimeMessages([]);
        return;
      }
      // key를 id로 변환하여 배열로 정렬
      const msgs = Object.entries(data).map(([key, val]) => ({
        id: key,
        ...val,
        studentId: activeChatStudentId,
      }));
      msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setRealtimeMessages(msgs);
    });

    return () => off(chatRef);
  }, [activeChatStudentId, isOpen]);

  if (!isOpen) return null;

  // 현재 대화방 필터링 (예약 메시지 처리)
  const filteredMessages = messages.filter(msg => {
    if (msg.studentId !== activeChatStudentId) return false;
    
    // 예약 발송 메시지인 경우
    if (msg.scheduledFor) {
      const now = new Date();
      const scheduledDate = new Date(msg.scheduledFor);
      
      // 예약 시간이 안 지났으면 보낸 사람(선생님)에게만 보이게 함
      if (now < scheduledDate) {
        return currentUser.role === 'teacher';
      }
    }
    return true;
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderId = currentUser.role === 'teacher' ? 'teacher1' : (currentUser.id || currentUser.uid);
    const senderName = currentUser.name;

    let scheduledFor = null;
    if (isScheduling && scheduledTime && currentUser.role === 'teacher') {
      // 날짜는 오늘로 가정하고 시간만 설정 (단순화된 데모)
      const date = new Date();
      const [hours, minutes] = scheduledTime.split(':');
      date.setHours(hours, minutes, 0);
      
      // 만약 과거 시간이면 내일로 설정
      if (date < new Date()) {
        date.setDate(date.getDate() + 1);
      }
      scheduledFor = date.toISOString();
    }

    sendMessage(activeChatStudentId, senderId, senderName, inputText, scheduledFor);
    setInputText('');
    setIsScheduling(false);
    setScheduledTime('');
  };

  // 지저스톡 채팅창 사진 업로드 (Firebase Storage)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;

    // 대표님 요청: 사진을 올리는 순간 미리 주의/권장 팝업창을 띄워 사용자에게 가이드를 제시합니다.
    alert(
      '📱 사진 전송 안내 📱\n\n' +
      '갤럭시 울트라 등 고해상도 카메라 원본 사진은 스마트폰 성능 및 용량 한계로 전송이 실패하거나 느려질 수 있습니다.\n\n' +
      '👉 전송이 안 되시는 경우:\n' +
      '1. 화면을 캡처(스크린샷)한 캡처 사진을 올려보세요.\n' +
      '2. 카카오톡 채팅방에 보낸 후 다운로드한 사진을 올려보세요.'
    );

    const senderId = currentUser.role === 'teacher' ? 'teacher1' : (currentUser.id || currentUser.uid);
    const senderName = currentUser.name;

    setIsChatImageUploading(true);
    try {
      const url = await uploadImage(file, 'chat_images', { maxSize: 1200, quality: 0.82 });
      await sendMessage(activeChatStudentId, senderId, senderName, `[사진 첨부됨: ${file.name}]`, null, url);
    } catch (err) {
      console.error('채팅 이미지 업로드 실패:', err);
      alert(
        '⚠️ 사진 전송에 실패했습니다.\n\n' +
        '갤럭시 울트라 등 고해상도 카메라 원본 사진은 용량이 너무 커 전송이 제한될 수 있습니다.\n\n' +
        '👉 해결 방법:\n' +
        '1. 화면을 캡처(스크린샷)한 캡처 사진을 전송해 보세요.\n' +
        '2. 카카오톡으로 전송한 후 다운로드받은 사진을 전송해 보세요.'
      );
    } finally {
      setIsChatImageUploading(false);
    }
  };

  // 전체 공지 이미지 업로드 (Firebase Storage)
  const handleNoticeImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (noticeFileInputRef.current) noticeFileInputRef.current.value = '';

    setIsNoticeImageUploading(true);
    setNoticeImageError('');
    try {
      const url = await uploadImage(file, 'notice_images', { maxSize: 1400, quality: 0.85 });
      setNoticeImage(url);
    } catch (err) {
      console.error('공지 이미지 업로드 실패:', err);
      setNoticeImageError('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsNoticeImageUploading(false);
    }
  };

  const handleSendNotice = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    setIsSendingNotice(true);

    const senderId = 'teacher1';
    const senderName = currentUser.name;

    try {
      for (const student of students) {
        await sendMessage(student.id, senderId, senderName, `[전체공지] ${noticeText}`, null, noticeImage || null);
      }
      alert('모든 학부모/학생 대화방으로 전체 공지사항이 전송되었습니다! 📢');
      setNoticeText('');
      setNoticeImage('');
      setShowNoticeSender(false);
    } catch (err) {
      console.error(err);
      alert('공지사항 발송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingNotice(false);
    }
  };

  // 대기 중인(매핑되지 않은) 학부모 대화방 목록 추출하여 교사 목록에 합치기
  const unmatchedChats = [];
  const studentIds = new Set(students?.map(s => s.id) || []);
  
  (storeMessages || []).forEach(msg => {
    if (msg.studentId && !studentIds.has(msg.studentId) && msg.studentId !== 'teacher1') {
      if (!unmatchedChats.some(c => c.id === msg.studentId)) {
        // 마지막 메시지를 발송한 학부모의 이름을 따옴
        const chatMsgs = (storeMessages || []).filter(m => m.studentId === msg.studentId);
        const lastParentMsg = [...chatMsgs].reverse().find(m => m.senderId !== 'teacher1');
        
        unmatchedChats.push({
          id: msg.studentId,
          name: lastParentMsg ? lastParentMsg.senderName : '대기 중인 학부모님',
          avatar: '👤',
          isUnmatchedParent: true
        });
      }
    }
  });

  const allChatsForTeacher = [...students, ...unmatchedChats];
  const selectedStudent = allChatsForTeacher.find(s => s.id === activeChatStudentId);

  // 안식일 모드(DND) 동작 여부 체크
  const isDNDActive = () => {
    if (!teacherSettings.dndEnabled) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = teacherSettings.dndStart.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    
    const [endH, endM] = teacherSettings.dndEnd.split(':').map(Number);
    const endTotal = endH * 60 + endM;

    if (startTotal <= endTotal) {
      return currentMinutes >= startTotal && currentMinutes <= endTotal;
    } else {
      // 자정 넘어가는 경우 (ex: 22:00 ~ 08:00)
      return currentMinutes >= startTotal || currentMinutes <= endTotal;
    }
  };

  const dndActive = isDNDActive();

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal} className="card-solid animate-fade-in hover-lift">
        {/* Modal Header */}
        <div style={{...styles.header, flexWrap: 'wrap', gap: '10px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <MessageSquare size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.role === 'teacher' 
                ? '학부모/학생 상담실' 
                : `${selectedStudent?.name || ''} 학생 상담실`}
            </h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {currentUser.role === 'teacher' && (
              <button 
                onClick={() => updateTeacherSettings({ dndEnabled: !teacherSettings.dndEnabled })}
                style={{
                  ...styles.dndToggleBtn,
                  background: teacherSettings.dndEnabled ? 'var(--primary)' : 'var(--bg-main)',
                  color: teacherSettings.dndEnabled ? 'white' : 'var(--text-muted)'
                }}
              >
                <Moon size={14} />
                <span className="hide-on-mobile">안식일 </span>
                <span>{teacherSettings.dndEnabled ? 'ON' : 'OFF'}</span>
              </button>
            )}
            <button style={styles.closeBtn} onClick={onClose}><X size={24} /></button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          {/* Teacher Side: Chat list on the left */}
          {currentUser.role === 'teacher' && !activeChatStudentId && (
            <div style={{...styles.studentList, width: '100%', borderRight: 'none'}}>
              <div style={styles.listTitle}>학생 대화방</div>
              {allChatsForTeacher.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💬</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-main)' }}>아직 대화방이 없습니다</div>
                  <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                    학부모/학생이 앱에 가입하면<br/>여기에 대화방이 생성됩니다.
                  </div>
                </div>
              ) : (
                allChatsForTeacher.map(s => {
                  const studentMsgs = (storeMessages || []).filter(m => m.studentId === s.id);
                  const lastMsg = studentMsgs[studentMsgs.length - 1];
                  const unreadCount = studentMsgs.filter(m => m.senderId !== 'teacher1' && !m.isRead).length;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveChatStudentId(s.id)}
                      style={styles.studentItem(activeChatStudentId === s.id)}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {s.imageUrl ? (
                          <img src={s.imageUrl} alt="student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.2rem' }}>{s.avatar || '👦'}</span>
                        )}
                      </div>
                      <div style={styles.studentItemText}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                          {s.name} {s.isUnmatchedParent ? '(신규 학부모)' : ''}
                          {unreadCount > 0 && (
                            <span style={styles.unreadBadge}>{unreadCount}</span>
                          )}
                        </div>
                        <div style={styles.lastMsgText}>
                          {lastMsg ? lastMsg.content : '대화 기록 없음'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Chat Room Area */}
          {(currentUser.role === 'student' || currentUser.role === 'parent' || activeChatStudentId) && (
            <div style={styles.chatArea}>
            {currentUser.role === 'teacher' && selectedStudent && (
              <div style={styles.chatRoomHeader}>
                <button style={styles.headerIconBtn} onClick={() => setActiveChatStudentId('')}>
                  <ChevronLeft size={24} />
                </button>
                <div style={styles.headerCenter}>
                  <strong style={{ fontSize: '1.05rem' }}>{selectedStudent.name} 학부모님</strong>
                  <span style={styles.statusText}>● 지저스톡 불가시간 ▾</span>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button style={styles.headerIconBtn} onClick={() => setShowNoticeSender(true)} title="전체 공지 보내기">
                    <Bell size={24} />
                  </button>
                  <button style={styles.headerIconBtn} onClick={() => setIsScheduling(!isScheduling)} title="예약 전송 설정">
                    <Clock size={24} />
                  </button>
                </div>
              </div>
            )}
            {(currentUser.role === 'student' || currentUser.role === 'parent') && (
              <div style={styles.chatRoomHeader}>
                <button style={styles.headerIconBtn}>
                  <ChevronLeft size={24} />
                </button>
                <div style={styles.headerCenter}>
                  <strong style={{ fontSize: '1.05rem' }}>박사랑 선생님</strong>
                  <span style={styles.statusText}>● 지저스톡 불가시간 ▾</span>
                </div>
                <div style={{width: 24}}></div>
              </div>
            )}
            
            {/* 학생용 DND 알림 배너 */}
            {(currentUser.role === 'student' || currentUser.role === 'parent') && dndActive && (
              <div style={styles.dndBanner}>
                <Moon size={16} />
                <span>지금은 선생님의 <b>안식일(휴식) 시간</b>입니다. 급한 용무가 아니면 답변이 늦어질 수 있습니다. ({teacherSettings.dndStart} ~ {teacherSettings.dndEnd})</span>
              </div>
            )}

            <div style={styles.messageList}>
              {filteredMessages.length === 0 ? (
                <div style={styles.emptyChat}>
                  <p>선생님과 1:1 대화방이 개설되었습니다. 🙌</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    예배 질문, 성경 공부 고민, 기도 제목을 남겨주시면 선생님이 확인해 드립니다!
                  </p>
                </div>
              ) : (
                (() => {
                  let currentDateHeader = '';
                  return filteredMessages.map((msg, index) => {
                    const isMe = msg.senderId === (currentUser.role === 'teacher' ? 'teacher1' : (currentUser.id || currentUser.uid));
                    const isScheduled = msg.scheduledFor && new Date(msg.scheduledFor) > new Date();
                    
                    const dateHeader = formatDateHeader(msg.timestamp);
                    const showDateHeader = dateHeader !== currentDateHeader;
                    if (showDateHeader) {
                      currentDateHeader = dateHeader;
                    }

                    // 시간 포맷 (오전 08:52)
                    let dateObj = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
                    if (isNaN(dateObj) && typeof msg.timestamp === 'string') {
                      const match = msg.timestamp.match(/(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/);
                      if (match) {
                        dateObj = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]));
                      }
                    }
                    let timeString = '방금 전';
                    if (!isNaN(dateObj)) {
                      let hours = dateObj.getHours();
                      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                      const ampm = hours >= 12 ? '오후' : '오전';
                      hours = hours % 12;
                      hours = hours ? hours : 12;
                      timeString = `${ampm} ${hours.toString().padStart(2, '0')}:${minutes}`;
                    }
                    
                    return (
                      <React.Fragment key={msg.id}>
                        {showDateHeader && (
                          <div style={styles.dateDividerWrapper}>
                            <div style={styles.dateDivider}>{dateHeader}</div>
                          </div>
                        )}
                        {/* 시스템 메시지는 첫 메시지 상단에 한 번만 표시 */}
                        {index === 0 && (
                          <div style={styles.systemMessageWrapper}>
                            <div style={styles.systemMessage}>
                              대화 시 서로 존중하는 마음으로 이용해 주세요.<br/>
                              욕설, 비방, 허위 내용 등의 불쾌감을 주거나<br/>
                              명예훼손의 내용은 작성할 수 없습니다.
                            </div>
                          </div>
                        )}
                        <div style={styles.messageBubbleWrapper(isMe)}>
                          {!isMe && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div style={{...styles.chatAvatar, overflow: 'hidden'}}>
                                {selectedStudent?.imageUrl ? (
                                  <img src={selectedStudent.imageUrl} alt="student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  selectedStudent?.avatar || '👦'
                                )}
                              </div>
                              <div style={styles.senderName}>{msg.senderName}</div>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', flexDirection: isMe ? 'row' : 'row-reverse', marginLeft: isMe ? 0 : '40px' }}>
                            {/* 읽음 표시 및 시간 (내 메시지일 때 좌측) */}
                            {isMe && !isScheduled && (
                              <div style={styles.metaColumnWrapper(isMe)}>
                                <span style={styles.timestamp}>{timeString}</span>
                              </div>
                            )}
                            
                            <div style={styles.messageBubble(isMe, isScheduled, !!msg.imageUrl)}>
                              {isScheduled && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginBottom: '4px', color: '#ffeb3b' }}>
                                  <Clock size={12} /> 예약 전송 대기 중 ({new Date(msg.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
                                </div>
                              )}
                              {msg.imageUrl ? (
                                <img src={msg.imageUrl} alt="첨부 이미지" style={{ maxWidth: '100%', borderRadius: '12px', display: 'block' }} />
                              ) : (
                                msg.content
                              )}
                            </div>

                            {/* 시간 (상대방 메시지일 때 우측) */}
                            {!isMe && (
                              <div style={styles.metaColumnWrapper(isMe)}>
                                <span style={styles.timestamp}>{timeString}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            {isScheduling && currentUser.role === 'teacher' && (
              <div style={styles.schedulePanel}>
                <Clock size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>예약 전송 시간:</span>
                <input 
                  type="time" 
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  style={styles.timeInput}
                />
                <button onClick={() => setIsScheduling(false)} style={styles.cancelScheduleBtn}>취소</button>
              </div>
            )}
            
            <div style={styles.inputAreaWrapper}>
              <form 
                onSubmit={handleSend} 
                style={{
                  ...styles.inputForm,
                  background: isInputFocused ? 'var(--bg-card)' : 'var(--bg-app)',
                }} 
                className="neon-input-container"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{display: 'none'}} 
                  onChange={handleFileUpload}
                  accept="image/*"
                  disabled={isChatImageUploading}
                />
                <button 
                  type="button" 
                  style={styles.iconBtn}
                  title={isChatImageUploading ? "업로드 중..." : "사진 첨부"}
                  onClick={() => !isChatImageUploading && fileInputRef.current?.click()}
                  disabled={isChatImageUploading}
                >
                  {isChatImageUploading ? (
                    <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Plus size={22} />
                  )}
                </button>
                
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="메시지를 입력해주세요."
                    style={styles.input}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                  />
                </div>

                <div style={styles.emojiWrapper}>
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={styles.iconBtn}
                  >
                    <Smile size={22} />
                  </button>
                  {showEmojiPicker && (
                    <div style={styles.emojiPicker}>
                      {emojis.map(emoji => (
                        <span 
                          key={emoji} 
                          onClick={() => handleEmojiClick(emoji)}
                          style={styles.emojiItem}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  style={{...styles.sendBtn, opacity: inputText.trim() ? 1 : 0.5}}
                >
                  <Send size={18} style={{ color: 'var(--text-white)' }} />
                </button>
              </form>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* 전체 공지사항 발송 모달 */}
      {showNoticeSender && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="card-solid animate-fade-up" style={{
            width: '100%',
            maxWidth: '450px',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} />
                <span>📢 지저스톡 전체 공지 발송</span>
              </h3>
              <button 
                onClick={() => { setShowNoticeSender(false); setNoticeText(''); setNoticeImage(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              작성하신 공지사항과 첨부한 사진은 현재 등록된 **모든 학생/학부모님의 1:1 대화방**으로 즉시 각각 발송됩니다.
            </p>

            <form onSubmit={handleSendNotice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>공지 내용</label>
                <textarea
                  value={noticeText}
                  onChange={e => setNoticeText(e.target.value)}
                  placeholder="모든 학부모님께 전달할 공지사항을 입력해주세요..."
                  rows={4}
                  required
                  className="schedule-input"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>사진 첨부 (선택)</label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed var(--border-color)', margin: '2px 0 6px 0', lineHeight: 1.4 }}>
                  ⚠️ 갤럭시 울트라 등 <b>고해상도 모바일 원본 사진</b>은 용량이 커 업로드가 실패할 수 있습니다. 실패 시 <b>화면을 캡처(스크린샷)한 사진</b>이나 <b>카카오톡 다운로드 사진</b>을 이용하시면 즉시 업로드됩니다.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => !isNoticeImageUploading && noticeFileInputRef.current?.click()}
                    disabled={isNoticeImageUploading}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: isNoticeImageUploading ? 'not-allowed' : 'pointer',
                      opacity: isNoticeImageUploading ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    {isNoticeImageUploading ? (
                      <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> 업로드 중...</>
                    ) : '📱 사진 선택하기 (갤럭시/아이폰 OK)'}
                  </button>
                  <input
                    type="file"
                    ref={noticeFileInputRef}
                    onChange={handleNoticeImageUpload}
                    accept="image/*"
                    disabled={isNoticeImageUploading}
                    style={{ display: 'none' }}
                  />
                  {noticeImage && !isNoticeImageUploading && (
                    <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                      ✅ 사진 첨부됨
                    </span>
                  )}
                </div>
                {noticeImageError && (
                  <div style={{ marginTop: '4px', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                    ⚠️ {noticeImageError}
                  </div>
                )}
                {noticeImage && !isNoticeImageUploading && (
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #10B981', marginTop: '8px' }}>
                    <img src={noticeImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setNoticeImage('')}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSendingNotice || !noticeText.trim()}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: (isSendingNotice || !noticeText.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isSendingNotice || !noticeText.trim()) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSendingNotice ? '발송 중...' : '공지사항 전체 발송'}
              </button>
            </form>
          </div>
        </div>
      )}
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
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '800px',
    height: '100%',
    maxHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '24px',
    overflow: 'hidden',
    background: 'var(--bg-card)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
  },
  dndToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  studentList: {
    width: '240px', // 넓이를 약간 키움 (안읽음 뱃지 공간)
    borderRight: '1px solid var(--border-color)',
    background: 'var(--bg-main)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  listTitle: {
    padding: '12px 16px',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
  },
  studentItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
    background: isActive ? 'var(--bg-card)' : 'transparent',
    borderLeft: '4px solid ' + (isActive ? 'var(--primary)' : 'transparent'),
    borderBottom: '1px solid var(--border-color)',
    transition: 'var(--transition-smooth)',
  }),
  studentItemText: {
    flex: 1,
    minWidth: 0,
  },
  unreadBadge: {
    background: 'var(--accent-error)',
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 700,
  },
  lastMsgText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '2px',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--bg-card)',
  },
  chatRoomHeader: {
    padding: '12px 20px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    background: 'var(--bg-main)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statusText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  dndBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(79, 70, 229, 0.1)',
    color: 'var(--primary)',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--border-color)',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyChat: {
    margin: 'auto',
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '24px',
  },
  messageBubbleWrapper: (isMe) => ({
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMe ? 'flex-end' : 'flex-start',
    maxWidth: '85%',
  }),
  senderName: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '4px',
    fontWeight: 700,
  },
  chatAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    border: '1px solid var(--border-color)',
    marginTop: '20px',
  },
  metaColumnWrapper: (isMe) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMe ? 'flex-end' : 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: '2px',
    minWidth: '40px',
  }),
  readStatus: {
    paddingBottom: '4px',
  },
  messageBubble: (isMe, isScheduled, hasImage) => ({
    background: hasImage ? 'transparent' : (isMe ? 'var(--primary)' : 'var(--bg-main)'),
    color: isMe ? 'var(--text-white)' : 'var(--text-main)',
    padding: hasImage ? '0px' : '10px 16px',
    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    fontSize: '0.9rem',
    lineHeight: 1.4,
    boxShadow: hasImage ? 'none' : 'var(--shadow-sm)',
    border: hasImage ? '1px solid var(--border-color)' : ('1px solid ' + (isMe ? 'transparent' : 'var(--border-color)')),
    opacity: isScheduled ? 0.7 : 1,
    borderStyle: isScheduled ? 'dashed' : 'solid',
    overflow: 'hidden',
  }),
  timestamp: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  dateDividerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0',
  },
  dateDivider: {
    background: 'var(--bg-main)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-color)',
  },
  systemMessageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0 20px',
  },
  systemMessage: {
    background: 'transparent',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: '1.5',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px 24px',
  },
  schedulePanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: 'var(--bg-main)',
    borderTop: '1px solid var(--border-color)',
    color: 'var(--primary)',
  },
  timeInput: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
    color: 'var(--text-main)',
    outline: 'none',
  },
  cancelScheduleBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  inputAreaWrapper: {
    borderTop: '1px solid var(--border-color)',
    background: 'var(--bg-card)', 
    padding: '12px 16px',
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 8px',
    gap: '6px',
    background: 'var(--bg-app)',
    width: '100%',
    boxSizing: 'border-box',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    flexShrink: 0,
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.95rem',
    padding: '8px 0',
  },
  emojiWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    width: '260px',
    gap: '8px',
    boxShadow: 'var(--shadow-md)',
    zIndex: 10,
  },
  emojiItem: {
    cursor: 'pointer',
    fontSize: '1.3rem',
    padding: '4px',
    transition: 'transform 0.1s',
  },
  sendBtn: {
    background: '#10B981',
    border: 'none',
    borderRadius: '20px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    transition: 'opacity 0.2s',
    flexShrink: 0,
  }
};
