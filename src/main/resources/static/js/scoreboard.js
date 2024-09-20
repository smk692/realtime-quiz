// scoreboard.js

function connectScoreboard() {
    stompClient.subscribe('/topic/scoreboard', function (message) {
        var topUsers = JSON.parse(message.body);
        updateScoreboard(topUsers);
    });
}

function loadScoreboard() {
    fetch('/api/scoreboard')
        .then(response => response.json())
        .then(topUsers => {
            updateScoreboard(topUsers);
        })
        .catch(error => {
            console.error('점수판을 불러오는 중 오류 발생:', error);
        });
}

function updateScoreboard(topUsers) {
    var scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>순위</th>
                    <th>이름</th>
                    <th>점수</th>
                    <th>시간</th>
                </tr>
            </thead>
            <tbody>
                ${topUsers.map((user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.userName}</td>
                        <td>${user.score}</td>
                        <td>${user.timestamp}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

