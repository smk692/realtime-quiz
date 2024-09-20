// chat.js

function connect() {
    username = document.getElementById('name').value.trim();

    if (username) {
        document.getElementById('username-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'block';

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    // 채팅 방에 가입
    stompClient.subscribe('/topic/public', onMessageReceived);

    // 사용자 등록
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN' }));

    // 메시지 폼의 submit 이벤트 처리
    var messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', sendMessage, true);

    // 단어 빈도수 그래프 초기화는 visualization.js에서 처리
}

function sendMessage(event) {
    event.preventDefault(); // 기본 동작 막기

    var messageContent = document.getElementById('message').value.trim();

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById('message').value = '';
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const usernameElement = document.createElement('strong');
    usernameElement.textContent = message.sender + ': ';
    messageElement.appendChild(usernameElement);

    const textElement = document.createElement('span');
    textElement.textContent = message.content;
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function onError(error) {
    console.error('연결 오류:', error);
}
