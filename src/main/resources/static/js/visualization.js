// visualization.js

// 전역 변수 선언
var svgWidth, svgHeight;
var svg = null;
var simulation = null;
var wordFrequencies = {};
var d3Data = [];
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width, height;

// 초기화 함수
function initVisualization() {
    var container = document.getElementById('visualization');

    // 부모 컨테이너의 크기 제대로 가져오기
    svgWidth = container.clientWidth || 400;  // 기본값 400px
    svgHeight = container.clientHeight || 400; // 기본값 400px

    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;

    svg = d3.select("#visualization")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("charge", d3.forceManyBody().strength(5))
        .force("collision", d3.forceCollide().radius(function(d) {
            return d.radius + 2;
        }));
}

// REST API를 통해 초기 단어 빈도수 데이터 가져오기
function fetchInitialWordFrequencies() {
    fetch('/api/word-frequencies/today')
        .then(response => response.json())
        .then(data => {
            wordFrequencies = data;
            convertToD3Data();
            updateVisualization();
        })
        .catch(error => {
            console.error('초기 단어 빈도수 데이터를 불러오는 중 오류 발생:', error);
        });
}

// D3 데이터 포맷으로 변환
function convertToD3Data() {
    d3Data = Object.entries(wordFrequencies).map(([word, count]) => ({
        word: word,
        count: count,
        radius: Math.min(30, count * 3 + 5) // 반지름 조정
    }));
}

// 단어 빈도수 그래프 업데이트 함수
function updateVisualization() {
    if (!svg) {
        console.error('svg is not defined');
        return;
    }

    var data = d3Data;

    if (data.length === 0) {
        return;
    }

    // 데이터 바인딩
    var circles = svg.selectAll("circle")
        .data(data, function(d) { return d.word; });

    var texts = svg.selectAll("text")
        .data(data, function(d) { return d.word; });

    // 새로운 원 추가
    var circlesEnter = circles.enter()
        .append("circle")
        .attr("r", 0)
        .attr("fill", function(d, i) {
            return d3.schemeCategory10[i % 10];
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    // 새로운 텍스트 추가
    var textsEnter = texts.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(function(d) { return d.word; })
        .style("font-size", "12px")
        .style("pointer-events", "none");

    // 기존 원과 텍스트와 병합
    circles = circlesEnter.merge(circles);
    texts = textsEnter.merge(texts);

    // 원의 속성 업데이트
    circles.transition()
        .duration(500)
        .attr("r", function(d) { return d.radius; });

    // 시뮬레이션에 데이터 적용
    simulation.nodes(data)
        .on("tick", ticked)
        .alpha(1)
        .restart();

    // 불필요한 원과 텍스트 제거
    circles.exit().remove();
    texts.exit().remove();

    function ticked() {
        circles
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        texts
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }
}

// WebSocket을 통해 실시간 단어 빈도수 데이터 받기
function setupWordFrequencyWebSocket() {
    var socket = new SockJS('/ws');
    var stompClientFreq = Stomp.over(socket);

    stompClientFreq.connect({}, function(frame) {
        stompClientFreq.subscribe('/topic/wordFrequencies', function(message) {
            var updatedFrequencies = JSON.parse(message.body);
            updatedFrequencies.forEach(item => {
                if (wordFrequencies[item.word]) {
                    wordFrequencies[item.word] += item.count; // 누적
                } else {
                    wordFrequencies[item.word] = item.count;
                }
            });
            convertToD3Data();
            updateVisualization();
        });
    }, function(error) {
        console.error('Word Frequency WebSocket 연결 오류:', error);
    });
}

// 초기화 및 데이터 로드
function initializeVisualization() {
    initVisualization();
    fetchInitialWordFrequencies();
    setupWordFrequencyWebSocket();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeVisualization);
