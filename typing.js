const quotes = [
    "In the heart of the digital jungle, TypingBeast challenges you to conquer your fears and master the keyboard. With every keystroke, you sharpen your mind and unleash your inner beast. Remember, speed is nothing without accuracy, and every champion was once a beginner. So take a deep breath, focus, and let your fingers dance across the keys. The journey to becoming a typing legend starts now!",
    "The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the alphabet and is a great way to warm up your fingers before a typing test. Keep practicing and you'll see your speed and accuracy improve in no time!",
    "Practice makes perfect. Consistency is the key to mastering any skill, and typing is no exception. Set aside a few minutes each day to practice, and you'll be amazed at how quickly you progress.",
    "Typing fast is a useful skill. In today's digital world, being able to type quickly and accurately can save you time and make you more productive. Challenge yourself to improve a little each day.",
    "Stay focused and keep improving. Distractions are everywhere, but if you stay focused and keep practicing, you'll reach your goals. Remember, every expert was once a beginner.",
    "Accuracy is more important than speed. It's better to type slowly and accurately than to rush and make mistakes. Focus on accuracy first, and speed will come with time."
];

let currentQuote = "";
let startTime, timerInterval;
let isRunning = false;
let history = [];

const quoteDisplay = document.getElementById('quoteDisplay');
const inputBox = document.getElementById('inputBox');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextBtn');
const themeBtn = document.getElementById('themeBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

function pickRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayQuote(quote) {
    quoteDisplay.innerHTML = '';
    quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        quoteDisplay.appendChild(span);
    });
}

let testDuration = 60;
let timeLeft = testDuration;

function startTest() {
    currentQuote = pickRandomQuote();
    displayQuote(currentQuote);
    inputBox.value = '';
    inputBox.disabled = false;
    inputBox.focus();
    wpmDisplay.innerText = '0';
    accuracyDisplay.innerText = '100';
    timerDisplay.innerText = testDuration;
    startTime = null;
    isRunning = false;
    clearInterval(timerInterval);
    timeLeft = testDuration;
    quoteDisplay.style.opacity = 1;
}

function nextParagraph() {
    startTest();
}

function addToHistory(wpm, accuracy, time) {
    history.unshift({ wpm, accuracy, time, date: new Date().toLocaleString() });
    if (history.length > 5) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `WPM: ${item.wpm}, Accuracy: ${item.accuracy}%, Time: ${item.time}s (${item.date})`;
        historyList.appendChild(li);
    });
}

let darkTheme = false;
function applyTheme() {
    if (darkTheme) {
        document.body.style.background = 'linear-gradient(135deg, #232526 0%, #1e3c72 100%)';
        document.body.style.color = '#fff';
        document.documentElement.style.setProperty('--primary', '#4f8cff');
        document.documentElement.style.setProperty('--accent', '#ffcb05');
        document.documentElement.style.setProperty('--card-bg', '#232a3a');
        document.documentElement.style.setProperty('--input-bg', '#1e2233');
        document.documentElement.style.setProperty('--text-main', '#fff');
        document.documentElement.style.setProperty('--text-secondary', '#b0b8c1');
    } else {
        document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)';
        document.body.style.color = '#232526';
        document.documentElement.style.setProperty('--primary', '#4f8cff');
        document.documentElement.style.setProperty('--accent', '#ffcb05');
        document.documentElement.style.setProperty('--card-bg', '#fff');
        document.documentElement.style.setProperty('--input-bg', '#f3f6fa');
        document.documentElement.style.setProperty('--text-main', '#232526');
        document.documentElement.style.setProperty('--text-secondary', '#4f5b6b');
    }
}
function switchTheme() {
    darkTheme = !darkTheme;
    applyTheme();
}
if (themeBtn) themeBtn.onclick = switchTheme;
applyTheme();

window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.display = '';
            startTest();
            renderHistory();
        }, 500);
    }, 1200);
});

function updateTimer() {
    if (!isRunning) return;
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        inputBox.disabled = true;
        const arrayQuote = currentQuote.split('');
        const arrayValue = inputBox.value.split('');
        let correct = 0;
        arrayQuote.forEach((char, idx) => {
            if (arrayValue[idx] === char) correct++;
        });
        const wordsTyped = arrayValue.length / 5;
        const wpm = Math.round(wordsTyped / (testDuration / 60));
        const accuracy = Math.round((correct / arrayValue.length) * 100) || 0;
        addToHistory(wpm, accuracy, testDuration);
    }
}

inputBox.addEventListener('input', () => {
    if (!isRunning) {
        startTime = new Date();
        isRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
    const arrayQuote = currentQuote.split('');
    const arrayValue = inputBox.value.split('');
    let correct = 0;
    let incorrect = 0;
    quoteDisplay.childNodes.forEach((span, idx) => {
        if (arrayValue[idx] == null) {
            span.className = '';
        } else if (arrayValue[idx] === arrayQuote[idx]) {
            span.className = 'correct';
            correct++;
        } else {
            span.className = 'incorrect';
            incorrect++;
        }
    });
    const timeElapsed = (testDuration - timeLeft) / 60 || 1/60;
    const wordsTyped = arrayValue.length / 5;
    const wpm = Math.round(wordsTyped / timeElapsed);
    wpmDisplay.innerText = wpm;
    const accuracy = Math.round((correct / arrayValue.length) * 100) || 100;
    accuracyDisplay.innerText = accuracy;
    if (inputBox.value === currentQuote) {
        clearInterval(timerInterval);
        inputBox.disabled = true;
        const totalTime = testDuration - timeLeft;
        addToHistory(wpm, accuracy, totalTime);
    }
});

restartBtn.addEventListener('click', startTest);
nextBtn.addEventListener('click', nextParagraph);
