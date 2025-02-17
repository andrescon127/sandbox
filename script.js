let workTime = 23 * 60; // 23 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let timeLeft = workTime; // Initialize timeLeft after workTime is defined
let isWorkTime = true;
let timerId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const toggleButton = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display in the app
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the browser tab title
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `${timeString} - ${mode} | Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workTime : breakTime;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    updateDisplay();
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = workTime;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                switchMode();
                startTimer();
            }
        }, 1000);
        startButton.disabled = true;
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime;
    modeText.textContent = 'Work Time';
    updateDisplay();
    startButton.disabled = false;
}

function toggleMode() {
    console.log('Toggle mode clicked');
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.disabled = false;
    }
    switchMode();
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);

// Initialize the display
resetTimer(); 