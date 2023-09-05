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
clockSwitch.addEventListener("change", setClockType);
startPauseBtn.addEventListener("click", startPauseHandler);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);

// calls setClock every second on page load.
clock = setInterval(setClock, 1000);

// checks the state of the clock switch and uses the selected clock (clock/timer) accordingly. checked = use timer. clock selected as default.
function setClockType() {
  // checked means timer is selected, else clock is selected.
  if (clockSwitch.checked) {
    clearInterval(clock);
    initialiseTimer();
  } else {
    hideTimer();
    resetTimer();
    clock = setInterval(setClock, 1000);
  }
}

// sets the time of the clock to the time at which it is called.
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

/*
converts time into degrees so that the clock hands can be set.

LOGIC:
take the seconds, minutes, hours of the current time.
convert these into a percentage, where 1 = 100%, and multiply by 360 to get the degree.

e.g. 
there are 60 seconds in a minute.
we divide the number of seconds by 60 to get the percentage of seconds there have been in the current minute.
60 seconds / 60 = 1, i.e. 100% of the seconds.
1 * 360 = 360 degrees, i.e. a full rotation of the clock.

finally, we add 90 to the result to account for the 90 degree offset that the hands start with.
*/
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
called every second once the timer has started. calculates and tracks the current time. displays the time accordingly.
the number of seconds elapsed is kept in timerCounter, which is then converted to the degrees for the clock hands.
the elapsed seconds are also kept in lapCounter to keep track of seconds elapsed in a lap but are reset to zero when a new lap has started.
*/
function setTimer() {
  ++timerCounter;
  ++lapCounter;

  /* 
  gets the elapsed seconds, minutes, hours

  LOGIC: 
  timerCounter counts the number of seconds that have elapsed since the timer started.
  3600 = number of seconds in a hour.
  Math.floor rounds a number down to the nearest integer.
  
  To get the hours...
  divide the total number of seconds (timerCounter) by 3600 to get the number of elapsed hours.
  for every 3600 seconds in timerCounter, 1 hour has elapsed.
  e.g 3600 seconds / 3600 = 1 hour.
  round down using Math.floor to get the nearest whole hour.

  To get the minutes...
  hour * 3600 converts the number of whole hours back into seconds.
  we subtract this from the total number of seconds (timerCounter) to leave the elapsed seconds minus the hours that have already been counted.
  divide this by 60 and round down to get the number of whole minutes in the current hour.

  To get the seconds...
  convert the hours and minutes back into seconds by multiplying them by 3600 and 60 respectively.
  subtract the hours and minutes that have already been counted (in seconds) to get the remaining seconds.
  */
  const hour = Math.floor(timerCounter / 3600);
  const minute = Math.floor((timerCounter - hour * 3600) / 60);
  const updSecond = timerCounter - (hour * 3600 + minute * 60);

  // converts the time to degress to set the angle of the clock hands
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
  // stops calling setTimer but the timerCounter keeps the count at the point of pause so that timing can be resumed.
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
  const hour = Math.floor(lapCounter / 3600);
  const minute = Math.floor((lapCounter - hour * 3600) / 60);
  const updSecond = lapCounter - (hour * 3600 + minute * 60);

  const lapTime = formatDigitalTime(updSecond, minute, hour);

  // add lap data to laps object
  // totalLaps keeps track of how many laps have been added and is also the key of the latest lap
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
// totalLaps will also be the key of the latest lap
function getLapEntry() {
  return `<tr>
    <td>${totalLaps}</td>
    <td>${laps[totalLaps].lapTime}</td>
    <td>${laps[totalLaps].totalTime}</td>
  </tr>`;
}
