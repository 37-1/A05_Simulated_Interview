document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic (inherited from main.js but specific to this page)
    const toggleDarkMode = () => {
        const body = document.body;
        const icon = document.querySelector('#theme-toggle-btn i');
        if (!icon) return;
        
        body.classList.toggle('dark-mode');
    
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    };
    
    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const body = document.body;
        const icon = document.querySelector('#theme-toggle-btn i');
        if (!icon) return;
    
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else if (savedTheme === 'light') {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    };
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }
    loadTheme();

    // Home Icon Button Click Logic
    const homeIconBtn = document.getElementById('nav-home-icon-btn');
    let homeIconBtnClicked = false;
    if (homeIconBtn) {
        homeIconBtn.addEventListener('click', () => {
            if (homeIconBtnClicked) return;
            homeIconBtnClicked = true;
            
            // Navigate to home page
            window.location.href = '/';

            // Throttle reset
            setTimeout(() => {
                homeIconBtnClicked = false;
            }, 200);
        });
    }

    // 2. Timer & Interview Flow Logic
    let seconds = 0;
    const timerElement = document.getElementById('interview-timer');
    let timerInterval = null;
    let isInterviewStarted = false;

    const updateTimer = () => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        if (timerElement) {
            timerElement.textContent = `${mins}:${secs}`;
            if (seconds % 60 === 0) {
                timerElement.parentElement.setAttribute('aria-label', `面试已进行 ${mins} 分钟`);
            }
        }
    };

    // 3. Start/End Interview Logic & Modal
    const endInterviewBtn = document.getElementById('end-interview-btn');
    const btnIcon = document.getElementById('interview-btn-icon');
    const btnText = document.getElementById('interview-btn-text');
    const modal = document.getElementById('return-home-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const reviewBtn = document.getElementById('modal-review-btn');

    let lastDuration = 0;

    if (endInterviewBtn) {
        endInterviewBtn.addEventListener('click', () => {
            if (!isInterviewStarted) {
                // First click: Start interview
                isInterviewStarted = true;
                btnText.textContent = '结束面试';
                btnIcon.className = 'fas fa-power-off';
                endInterviewBtn.classList.remove('btn-primary');
                endInterviewBtn.classList.add('btn-danger');
                
                timerInterval = setInterval(updateTimer, 1000);
            } else {
                // Second click: Stop interview, show modal
                clearInterval(timerInterval);
                lastDuration = seconds;
                
                // Immediately reset timer
                seconds = 0;
                if (timerElement) {
                    timerElement.textContent = '00:00';
                    timerElement.parentElement.setAttribute('aria-label', `面试已进行 0 分钟`);
                }

                if (modal) {
                    modal.style.display = 'flex';
                    modal.setAttribute('aria-hidden', 'false');
                }
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            // Redirect back to home page with a smooth transition
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    }

    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            alert('本次复盘功能开发中...');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Close modal
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            }
            
            // Format the ended time
            const mins = Math.floor(lastDuration / 60).toString().padStart(2, '0');
            const secs = (lastDuration % 60).toString().padStart(2, '0');
            
            // Reset states
            isInterviewStarted = false;
            btnText.textContent = '开始面试';
            btnIcon.className = 'fas fa-play'; // Ensure this matches initial icon
            endInterviewBtn.classList.remove('btn-danger');
            endInterviewBtn.classList.add('btn-primary');
            
            // Append to history
            const historyList = document.querySelector('.history-list');
            if (historyList) {
                const li = document.createElement('li');
                li.className = 'history-item-ended';
                li.innerHTML = `
                    <div class="history-ended-time" style="color: #e74c3c; font-weight: bold; margin-bottom: 5px;"><i class="fas fa-stop-circle"></i> 上次面试结束 (用时 ${mins}:${secs})</div>
                    <a href="javascript:void(0)" class="history-ended-action" onclick="alert('查看表现功能开发中...')" style="color: #3498db; text-decoration: none; font-size: 0.9em;"><i class="fas fa-file-alt"></i> 查看表现</a>
                `;
                li.style.borderLeft = '3px solid #e74c3c';
                li.style.paddingLeft = '10px';
                li.style.marginBottom = '10px';
                li.style.backgroundColor = '#fdf2f2';
                li.style.padding = '10px';
                li.style.borderRadius = '5px';
                
                historyList.appendChild(li);
                
                const historyContent = document.querySelector('.history-content');
                if (historyContent) historyContent.scrollTop = historyContent.scrollHeight;
            }
        });
    }

    // 4. Chat Interaction & Clear Button
    const answerInput = document.querySelector('.answer-input');
    const sendBtn = document.querySelector('.btn-primary.action-btn');
    const clearBtn = document.getElementById('clear-answer-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const historyList = document.querySelector('.history-list');

    // Ensure no fixed heights interfere with flexbox layout
    const chatDiv = document.querySelector('.chat-history');
    const ansDiv = document.querySelector('.answer-box');
    if (chatDiv) chatDiv.style.height = '';
    if (ansDiv) ansDiv.style.height = '';

    // Setup hidden textarea for accurate height measurement without triggering transitions
    const hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.className = 'answer-input';
    hiddenTextarea.style.position = 'absolute';
    hiddenTextarea.style.visibility = 'hidden';
    hiddenTextarea.style.height = 'auto';
    hiddenTextarea.style.minHeight = '0';
    hiddenTextarea.style.pointerEvents = 'none';
    hiddenTextarea.style.zIndex = '-1000';
    hiddenTextarea.style.transition = 'none';
    hiddenTextarea.style.overflow = 'hidden';
    document.body.appendChild(hiddenTextarea);

    const baseHeight = 46; // Approximate base height
    const maxExpand = 300; // Requirement: max expand 300px
    
    if (answerInput) {
        // Enforce 200ms transition for smooth layout adjustments
        answerInput.style.transition = 'height 0.2s ease-in-out';
        if (ansDiv) ansDiv.style.transition = 'height 0.2s ease-in-out, min-height 0.2s ease-in-out';
        if (chatDiv) chatDiv.style.transition = 'height 0.2s ease-in-out, flex 0.2s ease-in-out';

        answerInput.addEventListener('input', function() {
            // Toggle clear button
            if (this.value.length > 0) {
                if (clearBtn) clearBtn.style.display = 'flex';
            } else {
                if (clearBtn) clearBtn.style.display = 'none';
            }

            // Sync hidden textarea width and content
            hiddenTextarea.style.width = this.offsetWidth + 'px';
            hiddenTextarea.value = this.value;
            // Also sync font-size, line-height, etc if needed. Assuming CSS classes match.
            
            let newScrollHeight = hiddenTextarea.scrollHeight;
            
            if (newScrollHeight > baseHeight) {
                let expandAmount = newScrollHeight - baseHeight;
                // Cap at maxExpand
                if (expandAmount > maxExpand) {
                    expandAmount = maxExpand;
                    this.style.overflowY = 'auto';
                } else {
                    this.style.overflowY = 'hidden';
                }
                
                this.style.height = (baseHeight + expandAmount) + 'px';
                // Sync the answer-box min-height as well if it was constrained, but usually it grows with content.
            } else {
                this.style.height = baseHeight + 'px';
                this.style.overflowY = 'hidden';
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (answerInput) {
                answerInput.value = '';
                clearBtn.style.display = 'none';
                
                // Reset textarea height
                answerInput.style.height = baseHeight + 'px';
                answerInput.style.overflowY = 'hidden';
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                answerInput.dispatchEvent(event);
            }
        });
    }

    // 8. Microphone Toggle
    const micBtn = document.getElementById('mic-btn');
    let isRecording = false;
    let mediaStream = null;
    let speechRecognition = null;

    if (micBtn) {
        micBtn.addEventListener('click', async () => {
            if (!isRecording) {
                try {
                    // Request microphone permission and start
                    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    isRecording = true;
                    micBtn.classList.add('mic-recording');
                    micBtn.setAttribute('aria-label', '停止语音输入');
                    
                    // Initialize Web Speech API if supported
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        speechRecognition = new SpeechRecognition();
                        speechRecognition.lang = 'zh-CN';
                        speechRecognition.continuous = true;
                        speechRecognition.interimResults = true;
                        
                        speechRecognition.onresult = (event) => {
                            let finalTranscript = '';
                            for (let i = event.resultIndex; i < event.results.length; ++i) {
                                if (event.results[i].isFinal) {
                                    finalTranscript += event.results[i][0].transcript;
                                }
                            }
                            if (finalTranscript && answerInput) {
                                answerInput.value += finalTranscript;
                                answerInput.dispatchEvent(new Event('input'));
                            }
                        };
                        speechRecognition.start();
                    }
                } catch (err) {
                    console.error('Microphone access error:', err);
                    alert('无法访问麦克风，请检查权限设置。');
                }
            } else {
                // Stop recording
                isRecording = false;
                micBtn.classList.remove('mic-recording');
                micBtn.setAttribute('aria-label', '开启语音输入');
                
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    mediaStream = null;
                }
                if (speechRecognition) {
                    speechRecognition.stop();
                    speechRecognition = null;
                }
            }
        });
    }

    const addMessage = (content, sender) => {
        if (!content.trim() || !chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);
        
        // Auto scroll to bottom
        const chatHistory = document.querySelector('.chat-history');
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    };

    const handleSend = () => {
        const text = answerInput.value;
        if (text.trim()) {
            // User message
            addMessage(text, 'user');
            answerInput.value = '';
            
            // Update history
            if (historyList) {
                const li = document.createElement('li');
                li.textContent = `回答: ${text.substring(0, 10)}...`;
                historyList.appendChild(li);
            }

            // Simulate AI response
            sendBtn.disabled = true;
            setTimeout(() => {
                addMessage('很好，那么请问你在之前的项目中遇到过最大的挑战是什么？', 'interviewer');
                sendBtn.disabled = false;
            }, 1500);
        }
    };

    if (sendBtn && answerInput) {
        sendBtn.addEventListener('click', handleSend);
        
        // Handle Ctrl+Enter to send
        answerInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                handleSend();
            }
        });
    }

    // Initialize page transition
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 50);
});