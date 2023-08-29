// global variables
let clockType = "use-clock";
let clock;
let timer;
let timerCounter = 0;
let lapCounter = 0;
let laps = {};
let totalLaps = 0;

// components
const hands = document.querySelectorAll(".hand");
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
const clockSwitch = document.querySelector("#clock-switch");

// event handlers
// clockTypeForm.addEventListener("change", setClockType);
clockSwitch.addEventListener("change", setClockType);
startPauseBtn.addEventListener("click", startPauseHandler);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);

// ################################################## Clock Functionality ####################################################################

// calls setClock every second on page load.
clock = setInterval(setClock, 1000);

// checks the state of the clock switch and uses the selected clock (clock/timer) accordingly. checked = use timer. clock selected as default.
function setClockType() {
  if (clockSwitch.checked) {
    clearInterval(clock);
    initialiseTimer();
  } else {
    hideTimer();
    resetTimer();
    clock = setInterval(setClock, 1000);
  }
}

/*
sets the time of the clock to the time at which it is called. 
only sets the time if the user has selected to use the clock.
*/
function setClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // converts the time to degress to set the angle of the clock hands
  const [secondsDegrees, minutesDegrees, hoursDegrees] = getDegrees(
    seconds,
    minutes,
    hours
  );

  // fixes glitch where hands transition from 12 to 1 anti-clockwise by removing the transition styles when the degrees are 90.
  if (secondsDegrees === 90) {
    secondHand.style.transition = "none";
  } else {
    secondHand.style.transition = "";
  }

  if (minutesDegrees === 90) {
    minuteHand.style.transition = "none";
  } else {
    minuteHand.style.transition = "";
  }

  if (hoursDegrees === 90) {
    hourHand.style.transition = "none";
  } else {
    hourHand.style.transition = "";
  }

  setClockHands(secondsDegrees, minutesDegrees, hoursDegrees);
}

// converts time into degrees so that the clock hands can be set
function getDegrees(seconds, minutes, hours) {
  const secondsDegrees = (seconds / 60) * 360 + 90;
  const minutesDegrees = (minutes / 60) * 360 + 90;
  const hoursDegrees = (hours / 12) * 360 + 90;
  return [secondsDegrees, minutesDegrees, hoursDegrees];
}

// takes degrees as arguments and sets the clock hands accordingly.
function setClockHands(secondsDegrees, minutesDegrees, hoursDegrees) {
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

// ################################################## Timer Functionality ####################################################################

// initialises the timer. sets the hands to 12.
function initialiseTimer() {
  timerControls.style.transform = "translateY(-240px)";
  digitalTimer.style.opacity = "1";
  setClockHands(90, 90, 90);
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
  const [secondsDegrees, minutesDegrees, hoursDegrees] = getDegrees(
    updSecond,
    minute,
    hour
  );

  // fixes glitch where hands transition from 12 to 1 anti-clockwise by removing the transition styles when the degrees are 90.
  if (secondsDegrees === 90) {
    secondHand.style.transition = "none";
  } else {
    secondHand.style.transition = "";
  }

  if (minutesDegrees === 90) {
    minuteHand.style.transition = "none";
  } else {
    minuteHand.style.transition = "";
  }

  if (hoursDegrees === 90) {
    hourHand.style.transition = "none";
  } else {
    hourHand.style.transition = "";
  }

  setClockHands(secondsDegrees, minutesDegrees, hoursDegrees);

  // sets the digital timer
  const digitalTime = formatDigitalTime(updSecond, minute, hour);
  digitalTimer.firstElementChild.innerHTML = digitalTime;
}

// converts time to digital format
function formatDigitalTime(seconds, minutes, hours) {
  const digitalSeconds = String(seconds).padStart(2, "0");
  const digitalMinutes = String(minutes).padStart(2, "0");
  const digitalHours = String(hours).padStart(2, "0");

  return `${digitalHours}:${digitalMinutes}:${digitalSeconds}`;
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
  setInactiveControls();
}

// set the styles for the timer controls when the timer is active.
function setActiveControls() {
  startPauseBtn.className = "btn pause-btn";
  startPauseBtn.innerHTML = "Pause";
  lapBtn.disabled = false;
  lapBtn.style.cursor = `pointer`;
}

// set the styles for the timer controls when the timer is inactive.
function setInactiveControls() {
  startPauseBtn.className = "btn start-btn";
  startPauseBtn.innerHTML = "Start";
  lapBtn.disabled = true;
  lapBtn.style.cursor = `not-allowed`;
}

function resetTimer() {
  clearInterval(timer);
  timerCounter = 0;
  laps = {};
  totalLaps = 0;
  setClockHands(90, 90, 90);
  digitalTimer.firstElementChild.innerHTML = "00:00:00";
  setInactiveControls();
  initialiseLapTable();
}

function initialiseLapTable() {
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

function addLap() {
  totalLaps++;
  const totalTime = digitalTimer.firstElementChild.innerHTML;

  // uses lapCounter to get the number of seconds, minutes, and hours elapsed in the lap.
  // *********** understand this ****************
  const hour = Math.floor(lapCounter / 3600);
  const minute = Math.floor((lapCounter - hour * 3600) / 60);
  const updSecond = lapCounter - (hour * 3600 + minute * 60);

  const lapTime = formatDigitalTime(updSecond, minute, hour);

  // add lap data to laps object
  // totalLaps keeps track of how many laps have been added and is also the index of the latest lap
  laps[totalLaps] = {
    lapTime: lapTime,
    totalTime: totalTime,
  };

  lapCounter = 0;
  displayLap();
}

// add the latest lap to the lap table
function displayLap() {
  const latestLap = getLapEntry();
  lapTable.innerHTML += latestLap;

  // before any laps have been added, lapsContainer is hidden by default.
  if ((lapsContainer.style.visibility = "hidden")) {
    lapsContainer.style.visibility = `visible`;
  }

  /*
  checks how many laps are in the lap table and adjusts the table container height accordingly.
  if there are 7 or less entries, container height is increased when a new lap is added.
  when there are more than 7 entries, the container height remains fixed and scroll is enabled to view further entries.
*/
  if (lapTable.rows.length <= 7) {
    lapsContainer.style.height = `calc(50px * ${lapTable.rows.length})`;
  } else {
    lapsContainer.style.overflow = `scroll`;
  }
}

// formats the latest lap into a table entry
// totalLaps will also be the index of the latest lap
function getLapEntry() {
  return `<tr>
    <td>${totalLaps}</td>
    <td>${laps[totalLaps].lapTime}</td>
    <td>${laps[totalLaps].totalTime}</td>
  </tr>`;
}

/*
TO DO:
understanding logic
clean up comments
modules? code organisation? refactoring functions? how should I order functions?
make responsive
*/

/*
Make notes/anki cards:
query selector
event listeners
changing css with js (individual styles and setting classes)
string literals
++ at start vs ++ at end
array destructuring
look in sandbox files for more notes
*/
