// golobal variables
let clockType = "use-clock";
let timer;
let timerCounter = 0;
let lapCounter = 0;
let laps = {};
let totalLaps = 0;

// components
const secondHand = document.querySelector(".second-hand");
const minuteHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const clockTypeForm = document.querySelector("#clock-type");
const timerControls = document.querySelector(".timer-controls");
const startPauseBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");
const digitalTimer = document.querySelector(".digital-timer");
const lapBtn = document.querySelector(".lap-btn");
const lapTable = document.querySelector(".lap-table");
const lapsContainer = document.querySelector(".laps-container");

// event handlers
clockTypeForm.addEventListener("change", setClockType);
startPauseBtn.addEventListener("click", startPauseHandler);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);

// ################################################## Clock Functionality ####################################################################

// calls setClock every second. setClock only sets the current clock time if use-clock has been selected.
setInterval(setClock, 1000);

// checks the selected value of the clock-type input and uses the selected clock (clock/timer). Clock selected as default.
function setClockType() {
  clockType = document.querySelector('input[name="clock-type"]:checked').value;

  if (clockType == "use-timer") {
    initialiseTimer();
  } else if (clockType == "use-clock") {
    hideTimer();
    resetTimer();
  }
}
/*
sets the time of the clock to the current time of the second it is called. 
only sets the time if the user has selected to use the clock.
*/
function setClock() {
  if (clockType == "use-clock") {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // converts the time to degress to set the angle of the clock hands
    const secondsDegrees = (seconds / 60) * 360 + 90;
    const minutesDegrees = (minutes / 60) * 360 + 90;
    const hoursDegrees = (hours / 12) * 360 + 90;

    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
  }
}

// ################################################## Timer Functionality ####################################################################

// initialises the timer. sets the hands to 12.
function initialiseTimer() {
  timerControls.style.transform = "translateY(-240px)";
  digitalTimer.style.opacity = "1";
  secondHand.style.transform = `rotate(90deg)`;
  minuteHand.style.transform = `rotate(90deg)`;
  hourHand.style.transform = `rotate(90deg)`;
}

// hides the timer functionality
function hideTimer() {
  timerControls.style.transform = "translateY(200px)";
  digitalTimer.style.opacity = "0";
}

/*
when use-timer is selected, upTimer is called every second
the number of seconds elapsed is kept in timerCounter, which is then converted to the degrees for the clock hands.
the elapsed seconds are also kept in lapCounter to keep track of seconds elapsed in a lap but are reset to zero when a new lap has started.
*/
function setTimer() {
  ++timerCounter;
  ++lapCounter;

  // ****************  understand the logic for this  ********************
  // gets the elapsed time
  const hour = Math.floor(timerCounter / 3600);
  const minute = Math.floor((timerCounter - hour * 3600) / 60);
  const updSecond = timerCounter - (hour * 3600 + minute * 60);

  // sets the analog timer
  const secondsDegrees = (updSecond / 60) * 360 + 90;
  const minutesDegrees = (minute / 60) * 360 + 90;
  const hoursDegrees = (hour / 12) * 360 + 90;

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  // sets digital timer
  const digitalSecond = String(updSecond).padStart(2, "0");
  const digitalMinute = String(minute).padStart(2, "0");
  const digitalHour = String(hour).padStart(2, "0");

  const digitalTime = `${digitalHour}:${digitalMinute}:${digitalSecond}`;
  digitalTimer.firstElementChild.innerHTML = digitalTime;
}

function resetTimer() {
  clearInterval(timer);
  timerCounter = 0;
  laps = {};
  totalLaps = 0;
  secondHand.style.transform = `rotate(90deg)`;
  minuteHand.style.transform = `rotate(90deg)`;
  hourHand.style.transform = `rotate(90deg)`;
  digitalTimer.firstElementChild.innerHTML = "00:00:00";
  startPauseBtn.className = "btn start-btn";
  startPauseBtn.innerHTML = "Start";
  lapsContainer.style.height = 0;
  lapsContainer.style.visibility = `hidden`;
  lapTable.innerHTML = `<table class="lap-table">
    <tr class="table-header">
      <th>Lap</th>
      <th>Lap Time</th>
      <th>Total Time</th>
    </tr>
  </table>`;
}

function startPauseHandler() {
  // timer is currently paused, so start timer when clicked
  if (startPauseBtn.className == "btn start-btn") {
    startTimer();

    // timer is currently active, so pause timer when clicked
  } else {
    pauseTimer();
  }
}

function startTimer() {
  // interval ID is stored in global timer variable so that the interval can be cleared when necessary (pause, reset, or use clock)
  timer = setInterval(setTimer, 1000);
  setActiveControls();
}

function pauseTimer() {
  // stops calling setTimer but the timerCounter keeps the count so that timing can be resumed.
  clearInterval(timer);
  setPausedControls();
}

// set the styles for the timer controls when the timer is active.
function setActiveControls() {
  startPauseBtn.className = "btn pause-btn";
  startPauseBtn.innerHTML = "Pause";
  lapBtn.disabled = false;
  lapBtn.style.cursor = `default`;
}

// set the styles for the timer controls when the timer is paused.
function setPausedControls() {
  startPauseBtn.className = "btn start-btn";
  startPauseBtn.innerHTML = "Start";
  lapBtn.disabled = true;
  lapBtn.style.cursor = `not-allowed`;
}

function addLap() {
  totalLaps++;
  const totalTime = digitalTimer.firstElementChild.innerHTML;

  const hour = Math.floor(lapCounter / 3600);
  const minute = Math.floor((lapCounter - hour * 3600) / 60);
  const updSecond = lapCounter - (hour * 3600 + minute * 60);

  const digitalSecond = String(updSecond).padStart(2, "0");
  const digitalMinute = String(minute).padStart(2, "0");
  const digitalHour = String(hour).padStart(2, "0");

  const lapTime = `${digitalHour}:${digitalMinute}:${digitalSecond}`;

  laps[totalLaps] = {
    lapTime: lapTime,
    totalTime: totalTime,
  };

  lapCounter = 0;

  displayLap(totalLaps);
}

function displayLap(lapNumber) {
  const lap = `<tr class="lap">
    <td>${lapNumber}</td>
    <td>${laps[lapNumber].lapTime}</td>
    <td>${laps[lapNumber].totalTime}</td>
  </tr>`;
  lapTable.innerHTML += lap;
  lapsContainer.style.visibility = `visible`;

  if (lapTable.rows.length <= 7) {
    let lapsContainerHeight = 50 * lapTable.rows.length;
    lapsContainer.style.height = `${lapsContainerHeight}px`;
  } else {
    lapsContainer.style.overflow = `scroll`;
  }
  console.log(lapTable.rows.length);
  console.log(lapTable);
}
