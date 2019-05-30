let pomodoro = 25 * 60 * 1000;
let breakTime = 5 * 60 * 1000;
let pomodoroID, breakID;

//start-btn
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
    const mask = document.createElement("div");
    mask.id = "mask";
    const timer = document.createElement("div");
    timer.id = "timer";
    timer.innerHTML = `
        <div id="audio-skin" class="clearfix">
            <button id="play-btn" class="play"></button>
            <div id="volume-ctrl">
                <img id="volume-icon" src="./i/volume.png" alt="">
                <input id="volume-range" type="range" min="0" max="1" step="0.01" value="1">
            </div>
        </div>
        <audio id="audioplayer" loop>
            <source src="./audio/FLYING IN THE SKY.mp3" type="audio/mp3">
            Your browser does not support the audio element.
        </audio>
        <p></p>
        <div id='time-counter'></div>
        <button id='stop-btn'>Stop</button>
    `;
    mask.appendChild(timer);
    document.body.appendChild(mask);

    let player = document.getElementById("audioplayer");
    let playBtn = document.getElementById("play-btn");
    let stopBtn = document.getElementById("stop-btn");
    let volumeRange = document.getElementById("volume-range");
    let volumeIcon = document.getElementById("volume-icon");
    let volumePrev = player.volume;

    playBtn.addEventListener("click", () => {
        if (player.paused) {
            playBtn.className = "pause";
            player.play();
        } else {
            playBtn.className = "play";
            player.pause();
        }
    });

    volumeIcon.addEventListener("click", () => {
        if (player.volume) {
            volumeIcon.src = "./i/mute.png";
            player.volume = volumeRange.value = 0;
        } else {
            volumeIcon.src = "./i/volume.png";
            player.volume = volumeRange.value = volumePrev;
        }
    });

    volumeRange.addEventListener("input", () => {
        volumePrev = player.volume = volumeRange.value;
        if (player.volume) {
            volumeIcon.src = "./i/volume.png";
        } else {
            volumeIcon.src = "./i/mute.png";
        }
    });

    stopBtn.addEventListener("click", () => {
        document.body.removeChild(mask);
        if (pomodoroID) {
            clearInterval(pomodoroID);
        }
        if (breakID) {
            clearInterval(breakID);
        }
    });

    tomatoLoop(pomodoro, breakTime);
});

function tomatoLoop() {
    pomodoroRound();
    setTimeout(breakRound, pomodoro);
    setTimeout(tomatoLoop, pomodoro+breakTime);
}

function pomodoroRound() {
    //console.log("pomodoroRound");
    if (breakID) {
        clearInterval(breakID);
    }
    let status = document.querySelector('#timer>p');
    status.className = 'work';
    status.textContent = 'work time';
    let pomodoroCD = countDown(pomodoro);
    displayTime(pomodoroCD);
    pomodoroID = setInterval(displayTime, 1000, pomodoroCD);

    let player = document.getElementById("audioplayer");
    let playBtn = document.getElementById("play-btn");
    playBtn.className = "play";
    player.pause();
}

function breakRound() {
    //console.log("breakRound");
    if (pomodoroID) {
        clearInterval(pomodoroID);
    }
    let status = document.querySelector('#timer>p');
    status.className = 'break';
    status.textContent = 'break time';
    let breakCD = countDown(breakTime);
    displayTime(breakCD);
    breakID = setInterval(displayTime, 1000, breakCD);

    let player = document.getElementById("audioplayer");
    let playBtn = document.getElementById("play-btn");
    playBtn.className = "pause";
    player.play();
}

function displayTime(couter) {
    const time = new Date(couter());
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const timeCounter = document.getElementById("time-counter");
    timeCounter.textContent = `${timeFormatFixed(minute)}:${timeFormatFixed(second)}`;
}

function timeFormatFixed(num) {
    var str = String(num);
    return str.length<2 ? '0'+str : str;
}

function countDown(ms) {
    let time = ms;
    return function() {
        time -= 1000;
        return time >= 0 ? time : 0;
    };
}
