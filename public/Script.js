const welcomeScreen = document.getElementById('welcome-screen');
const mainChat = document.getElementById('main-chat');
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('user-name-input');

const chatContent = document.getElementById('chat-content');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const fileInput = document.getElementById('file-input');
const typingIndicator = document.getElementById('typing-indicator');

let currentUserName = "";

// 1. د ویلکم سکرین عملیات
startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.style.borderColor = "red";
        return;
    }
    currentUserName = name;
    welcomeScreen.classList.add('hidden');
    mainChat.classList.remove('hidden');
    
    // د AI لخوا د کاروونکي په نوم لومړنی ښه راغلاست
    typeAIResponse(`سلام ${currentUserName}! هبا AI ته ښه راغلاست. زه ستا په خدمت کې یم، څنګه کولی شم مرسته درکړم؟`);
});

// د Enter بټن لپاره په ویلکم سکرین کې
nameInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') startBtn.click(); });

// 2. د پیغام استولو عملیات
async function sendMessage() {
    const text = userInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    // د کاروونکي پیغام ښودل
    addUserMessage(text);
    userInput.value = '';
    
    typingIndicator.style.display = 'block';
    chatContent.scrollTop = chatContent.scrollHeight;

    const formData = new FormData();
    formData.append('prompt', text);
    formData.append('userName', currentUserName); // د کاروونکي نوم سرور ته لیږل کیږي
    if (file) formData.append('image', file);

    try {

const response = await fetch('/chat', {
    method: 'POST',
});





        const data = await response.json();
        
        typingIndicator.style.display = 'none';
        typeAIResponse(data.reply);
    } catch (error) {
        typingIndicator.style.display = 'none';
        typeAIResponse("بښنه غواړم، د سرور په اړیکه کې ستونزه ده.");
    }
}

// د کاروونکي پیغام اضافه کول
function addUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'msg-row msg-user';
    row.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatContent.appendChild(row);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// د AI ځواب او د کاپي کولو (Copy) بټن
function typeAIResponse(text) {
    const row = document.createElement('div');
    row.className = 'msg-row msg-ai';
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    const tools = document.createElement('div');
    tools.className = 'msg-tools';
    
    // د کاپي بټن جوړول
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="far fa-copy"></i> کاپي';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = '<i class="fas fa-check"></i> کاپي شو';
        copyBtn.style.color = '#00ff88';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i> کاپي';
            copyBtn.style.color = 'inherit';
        }, 2000);
    };

    tools.appendChild(copyBtn);
    row.appendChild(bubble);
    row.appendChild(tools);
    chatContent.appendChild(row);

    // د ټایپینګ اغېز
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            bubble.innerHTML += text.charAt(index);
            index++;
            chatContent.scrollTop = chatContent.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
