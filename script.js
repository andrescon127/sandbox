let workTime = 23 * 60; // 23 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let timeLeft = workTime; // Initialize timeLeft after workTime is defined
let isWorkTime = true;
let timerId = null;
let currentFocusTask = '';

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const toggleButton = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');
const focusTask = document.getElementById('focus-task');

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
    const icon = toggleButton.querySelector('i');

    if (isWorkTime) {
        icon.className = 'fas fa-bed';  // sleeping icon
        modeText.textContent = 'Rest Time';
        focusTask.textContent = ''; // Clear focus task during rest mode
        timeLeft = breakTime;
    } else {
        icon.className = 'fas fa-person-running';  // running icon
        modeText.textContent = 'Work Time';
        timeLeft = workTime;
    }
    isWorkTime = !isWorkTime;
    updateDisplay();
}

function showTaskModal() {
    const modal = document.getElementById('task-modal');
    const input = document.getElementById('task-input');
    modal.style.display = 'flex';
    input.focus();
    
    return new Promise((resolve) => {
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                resolve(null);
            }
        }

        function handleClickOutside(e) {
            if (e.target === modal) {
                closeModal();
                resolve(null);
            }
        }

        function closeModal() {
            modal.style.display = 'none';
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('click', handleClickOutside);
            input.value = '';
        }

        document.getElementById('confirm-task').onclick = () => {
            const task = input.value.trim();
            if (task) {
                closeModal();
                resolve(task);
            }
        };

        document.getElementById('cancel-task').onclick = () => {
            closeModal();
            resolve(null);
        };

        document.addEventListener('keydown', handleEscape);
        modal.addEventListener('click', handleClickOutside);
    });
}

async function startTimer() {
    if (isWorkTime && !timerId) {
        const task = await showTaskModal();
        if (!task) {
            return; // Don't start the timer if no task was entered
        }
        currentFocusTask = task;
        focusTask.textContent = `Focus: ${task}`;
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
    pauseButton.disabled = false;
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime;
    modeText.textContent = 'Work Time';
    focusTask.textContent = '';
    currentFocusTask = '';
    updateDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
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

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes (300 seconds)
    updateDisplay();
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);
const addTimeButton = document.getElementById('add-time');
addTimeButton.addEventListener('click', addFiveMinutes);

// Initialize the display
resetTimer(); 