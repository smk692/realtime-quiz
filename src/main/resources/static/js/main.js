// main.js

// 전역 변수 선언
var stompClient = null;
var username = null;

function init() {
    // 사용자명 입력 폼의 submit 이벤트 처리
    var usernameForm = document.getElementById('usernameForm');
    usernameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        username = document.getElementById('name').value.trim();

        if (username) {
            document.getElementById('username-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';

            // 채팅 연결
            connect();

            // 퀴즈 로드
            loadQuestions();

            // 점수판 로드
            loadScoreboard();

            // 단어 빈도수 그래프 초기화
            // Visualization.js는 DOMContentLoaded 이벤트를 통해 자동 초기화됨
        }
    }, true);
}

window.onload = init;
