// quiz.js

// 전역 변수 선언
var currentQuestionIndex = 0;
var userAnswers = [];
var questions = [];
var username = null;
let scoreMap = {}; // 제출 후 정답 여부 저장
let isSubmitted = false; // 퀴즈 제출 여부 플래그

// 퀴즈 데이터를 로드하는 함수
function loadQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            if (questions.length > 0) {
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                alert('문제가 없습니다.');
            }
        })
        .catch(error => {
            console.error('문제를 불러오는 중 오류 발생:', error);
        });
}

// 문제를 화면에 표시하는 함수
function displayQuestion(question) {
    renderQuestionHeader();
    renderOptions(question);
    renderNavigationButtons();
}

// 질문 헤더 렌더링 함수
function renderQuestionHeader() {
    var problemContent = document.getElementById('problem-content');
    problemContent.innerHTML = '<p><strong>문제 ' + (currentQuestionIndex + 1) + ' / ' + questions.length + '</strong></p>';
    problemContent.innerHTML += '<p>' + questions[currentQuestionIndex].content + '</p>';
}

// 선택지를 렌더링하는 함수
function renderOptions(question) {
    var optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach(function(optionText, index) {
        var optionNumber = index + 1;
        var optionElement = document.createElement('button');
        optionElement.textContent = optionNumber + '. ' + optionText;
        optionElement.classList.add('quiz-option-btn'); // 클래스 추가

        // 선택한 답변이면 선택된 스타일 적용
        if (userAnswers[currentQuestionIndex] === optionNumber) {
            optionElement.classList.add('selected-option');
        }

        // 제출 후 정답 여부 표시
        if (isSubmitted && scoreMap.hasOwnProperty(currentQuestionIndex)) {
            var isCorrect = scoreMap[currentQuestionIndex];
            if (userAnswers[currentQuestionIndex] === optionNumber) {
                var correctnessSpan = document.createElement('span');
                correctnessSpan.classList.add(isCorrect ? 'correct' : 'incorrect');
                correctnessSpan.textContent = isCorrect ? ' 맞았습니다!' : ' 틀렸습니다!';
                optionElement.appendChild(correctnessSpan);

                // 버튼 배경색 변경
                if (isCorrect) {
                    optionElement.classList.add('correct-answer');
                } else {
                    optionElement.classList.add('incorrect-answer');
                }

                optionElement.disabled = true; // 버튼 비활성화
            }
        } else {
            // 제출 전 답변 선택 이벤트
            optionElement.addEventListener('click', function() {
                selectAnswer(currentQuestionIndex, optionNumber);
                displaySelectedOption(optionNumber);
                highlightSelectedOption(optionsContainer, optionElement);
            });
        }

        optionsContainer.appendChild(optionElement);
    });

    // 이전에 선택한 답변 번호가 있으면 표시
    if (userAnswers[currentQuestionIndex]) {
        displaySelectedOption(userAnswers[currentQuestionIndex]);
    }
}

// 선택한 답변을 강조 표시하는 함수
function highlightSelectedOption(optionsContainer, selectedButton) {
    var optionButtons = optionsContainer.getElementsByTagName('button');
    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].classList.remove('selected-option');
    }
    selectedButton.classList.add('selected-option');
}

// 내비게이션 버튼을 렌더링하는 함수
function renderNavigationButtons() {
    var navigationContainer = document.getElementById('navigation-container');
    navigationContainer.innerHTML = '';

    // 이전 버튼
    if (currentQuestionIndex > 0) {
        var prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.classList.add('quiz-nav-btn', 'prev-btn'); // 클래스 추가
        prevButton.addEventListener('click', function() {
            currentQuestionIndex--;
            displayQuestion(questions[currentQuestionIndex]);
        });
        navigationContainer.appendChild(prevButton);
    }

    var nextButton = document.createElement('button');
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.textContent = '다음';
        nextButton.classList.add('quiz-nav-btn', 'next-btn'); // 클래스 추가
        nextButton.addEventListener('click', function() {
            if (!userAnswers[currentQuestionIndex]) {
                alert('답변을 선택해 주세요.');
                return;
            }
            currentQuestionIndex++;
            displayQuestion(questions[currentQuestionIndex]);
        });
    } else if (!isSubmitted) {
        nextButton.textContent = '제출';
        nextButton.classList.add('quiz-submit-btn'); // 클래스 추가
        nextButton.addEventListener('click', submitAnswers);
    }
    navigationContainer.appendChild(nextButton);
}

// 사용자가 답변을 선택했을 때 호출되는 함수
function selectAnswer(questionIndex, selectedOption) {
    userAnswers[questionIndex] = selectedOption;
    // 선택한 답변을 강조 표시하기 위해 다시 렌더링하지 않고 스타일만 변경
}

// 선택한 답변 번호를 표시하는 함수
function displaySelectedOption(selectedOptionNumber) {
    var selectedOptionDisplay = document.getElementById('selected-option-display');
    if (!selectedOptionDisplay) {
        selectedOptionDisplay = document.createElement('p');
        selectedOptionDisplay.id = 'selected-option-display';
        selectedOptionDisplay.style.fontWeight = 'bold';
        selectedOptionDisplay.style.color = '#28a745';
        var problemContent = document.getElementById('problem-content');
        problemContent.appendChild(selectedOptionDisplay);
    }
    selectedOptionDisplay.textContent = '선택한 번호: ' + selectedOptionNumber;
}

// 답안을 서버로 제출하는 함수
function submitAnswers() {
    // 모든 질문에 답변이 선택되었는지 확인
    if (userAnswers.length < questions.length || userAnswers.includes(undefined)) {
        alert('모든 문항에 답변해 주세요.');
        return;
    }

    fetch('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: username,
            answers: userAnswers
        })
    })
        .then(response => response.json())
        .then(result => {
            scoreMap = result;
            isSubmitted = true; // 퀴즈가 제출되었음을 표시

            alert('답안이 제출되었습니다. 점수: ' + result.size + '점');

            // 제출 버튼만 숨기기
            var navigationContainer = document.getElementById('navigation-container');
            var submitButton = navigationContainer.querySelector('.quiz-submit-btn');
            if (submitButton) {
                submitButton.style.display = 'none';
            }

            // 모든 질문을 다시 렌더링하여 정답/오답 표시
            displayQuestion(questions[currentQuestionIndex]);

            // 점수판 즉시 업데이트 (웹소켓 사용 시 필요 없음)
            loadScoreboard();
        })
        .catch(error => {
            console.error('답안 제출 중 오류 발생:', error);
            alert('답안 제출 중 오류가 발생했습니다.');
        });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 사용자명 입력 폼 제출 처리
    var usernameForm = document.getElementById('usernameForm');
    usernameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var nameInput = document.getElementById('name');
        username = nameInput.value.trim();
        if (username) {
            document.getElementById('username-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';
            loadQuestions();
            loadScoreboard();
            connectScoreboard();
        } else {
            alert('이름을 입력해 주세요.');
        }
    });

    // 초기 로드 시 점수판 불러오기
    loadScoreboard();
});
