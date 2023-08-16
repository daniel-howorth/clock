let clockType = "use-clock";
let timer;
let timerCounter = 0;
let lapCounter = 0;
let laps = {};
let totalLaps = 0;
const clockTypeForm = document.querySelector("#clock-type");
const timerControls = document.querySelector(".timer-controls");
const startPauseBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");
const digitalTimer = document.querySelector(".digital-timer");
const lapBtn = document.querySelector(".lap-btn");
const lapTable = document.querySelector(".lap-table");
const lapsContainer = document.querySelector(".laps-container");

clockTypeForm.addEventListener("change", function () {
  clockType = document.querySelector('input[name="clock-type"]:checked').value;

  if (clockType == "use-timer") {
    setTimer();
  } else if (clockType == "use-clock") {
    hideTimer();
    resetTimer();
  }
});

const secondHand = document.querySelector(".second-hand");
const minuteHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");

function setClock() {
  if (clockType == "use-clock") {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondsDegrees = (seconds / 60) * 360 + 90;
    const minutesDegrees = (minutes / 60) * 360 + 90;
    const hoursDegrees = (hours / 12) * 360 + 90;

    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
  }
}

setInterval(setClock, 1000);

function setTimer() {
  timerControls.style.transform = "translateY(-240px)";
  digitalTimer.style.opacity = "1";
  secondHand.style.transform = `rotate(90deg)`;
  minuteHand.style.transform = `rotate(90deg)`;
  hourHand.style.transform = `rotate(90deg)`;
}

function hideTimer() {
  timerControls.style.transform = "translateY(200px)";
  digitalTimer.style.opacity = "0";
}

/*
understand the logic for this.
*/
function upTimer() {
  ++timerCounter;
  ++lapCounter;

  const hour = Math.floor(timerCounter / 3600);
  const minute = Math.floor((timerCounter - hour * 3600) / 60);
  const updSecond = timerCounter - (hour * 3600 + minute * 60);

  const secondsDegrees = (updSecond / 60) * 360 + 90;
  const minutesDegrees = (minute / 60) * 360 + 90;
  const hoursDegrees = (hour / 12) * 360 + 90;

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  const digitalSecond = String(updSecond).padStart(2, "0");
  const digitalMinute = String(minute).padStart(2, "0");
  const digitalHour = String(hour).padStart(2, "0");

  const digitalTime = `${digitalHour}:${digitalMinute}:${digitalSecond}`;
  digitalTimer.firstElementChild.innerHTML = digitalTime;
}

function startTimer() {
  return setInterval(upTimer, 1000);
}

// function pauseTimer() {
//   clearInterval(timer);
// }

function resetTimer() {
  clearInterval(timer);
  timerCounter = 0;
  laps = {};
  totalLaps = 0;
  // secondHand.style.transform = `rotate(90deg)`;
  // minuteHand.style.transform = `rotate(90deg)`;
  // hourHand.style.transform = `rotate(90deg)`;
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

startPauseBtn.addEventListener("click", function () {
  if (startPauseBtn.className == "btn start-btn") {
    startPauseBtn.className = "btn pause-btn";
    startPauseBtn.innerHTML = "Pause";
    lapBtn.disabled = false;
    lapBtn.style.cursor = `default`;
    timer = setInterval(upTimer, 1000);
  } else {
    startPauseBtn.className = "btn start-btn";
    startPauseBtn.innerHTML = "Start";
    lapBtn.disabled = true;
    lapBtn.style.cursor = `not-allowed`;
    clearInterval(timer);
  }
});

resetBtn.addEventListener("click", resetTimer);

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

lapBtn.addEventListener("click", addLap);

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
