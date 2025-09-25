let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

const timerDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

function formatTime(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}.${seconds}`;
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  timerDisplay.textContent = formatTime(elapsedTime);
}

function setButtonState(running) {
  startBtn.disabled = running;
  stopBtn.disabled = !running;
  resetBtn.disabled = running && elapsedTime === 0;
}

startBtn.addEventListener("click", () => {
  if (!timerInterval) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 200);
    setButtonState(true);
  }
});

stopBtn.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    setButtonState(false);
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  timerDisplay.textContent = "00:00:00";
  setButtonState(false);
});

// Initialize display and button states
timerDisplay.textContent = "00:00:00";
setButtonState(false);
formatTime;
// Pomodoro-like rest alert feature
const timeBeforeRest = document.getElementById("timeBeforeRest");
const timeBeforeWork = document.getElementById("timeBeforeWork");
let nextRestTime = 25 * 60 * 1000; // 25 minutes in ms
let restDuration = 5 * 60 * 1000; // 5 minutes in ms
let inRest = false;
let pomodoroCount = 0;
const maxPomodoros = 4;

function checkRest() {
  if (!inRest && elapsedTime >= nextRestTime && pomodoroCount < maxPomodoros) {
    inRest = true;
    pomodoroCount++;
    // Pause the countdown to rest
    const pausedRestTime =
      nextRestTime - elapsedTime > 0 ? nextRestTime - elapsedTime : 0;
    timeBeforeRest.textContent = formatTime(pausedRestTime);

    // Activate the rest timer
    let currentRest = restDuration;
    timeBeforeWork.textContent = formatTime(currentRest);

    clearInterval(timerInterval); // Pause work timer

    timerInterval = setInterval(() => {
      currentRest -= 200;
      timeBeforeWork.textContent = formatTime(currentRest);
      if (currentRest <= 0) {
        clearInterval(timerInterval);
        restDuration = 5 * 60 * 1000;
        inRest = false;
        if (pomodoroCount < maxPomodoros) {
          startTime = Date.now();
          elapsedTime = 0;
          nextRestTime = 25 * 60 * 1000;
          timerInterval = setInterval(updateTimer, 200);
        } else {
          // All pomodoros done, show 15 min rest timer before work
          let longRest = 15 * 60 * 1000;
          timeBeforeWork.textContent = formatTime(longRest);
          timerInterval = setInterval(() => {
            longRest -= 200;
            timeBeforeWork.textContent = formatTime(longRest);
            if (longRest <= 0) {
              clearInterval(timerInterval);
              timeBeforeWork.textContent = "You can start working again!";
              setButtonState(false);
            }
          }, 200);
        }
      }
    }, 200);
  }
}

// Show countdown to rest (25 min - elapsed)
function updateTimer() {
  elapsedTime = Date.now() - startTime;
  timerDisplay.textContent = formatTime(elapsedTime);

  // Calculate remaining time until rest
  const remaining = Math.max(nextRestTime - elapsedTime, 0);
  timeBeforeRest.textContent = formatTime(remaining);

  checkRest();
}
