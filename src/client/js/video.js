const playBtn = document.querySelector(".playBtn");
const video = document.querySelector("video");
const muteBtn = document.querySelector(".muteBtn");
const soundBar = document.querySelector(".soundBar");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const fullScreenBtn = document.querySelector(".fullScreenBtn");
const videoContainer = document.querySelector(".watchVideo");
const controls = document.querySelector(".controls");
const timeRange = document.querySelector("#videoPlayBar");
let volumeLevel;

video.volume = soundBar.value;
//play
const handlePlayBtn = () => {
  if (video.paused === true) {
    video.play();
    playBtn.innerText = "Pause";
  } else {
    video.pause();
    playBtn.innerText = "Play";
  }
};

//sound
const handleMuteBtn = () => {
  if (video.muted) {
    muteBtn.innerText = "Mute";
    soundBar.value = volumeLevel;

    video.muted = false;
    return;
  } else {
    muteBtn.innerText = "Unmute";

    soundBar.value = 0;

    video.muted = true;
    return;
  }
};

const handleSound = () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeLevel = soundBar.value;
  video.volume = soundBar.value;
};

//time range
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleDuration = () => {
  totalTime.innerHTML = formatTime(Math.round(video.duration));
  return;
};

const handleTime = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  return;
};

function handleMoveTimeRange() {
  timeRange.max = Math.round(video.duration);
  timeRange.value = Math.floor(video.currentTime);
}

function handleMoveToTimeRange() {
  video.currentTime = timeRange.value;
}
//full screen
function handleFullScreen() {
  const fullScreen = document.fullscreenElement;
  if (!fullScreen) {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerHTML = "Exit Full Screen";
    controls.hidden = true;
  } else {
    fullScreenBtn.innterHTML = "Full Screen";
    document.exitFullscreen();
  }
}
//show video controls
let timeoutID;
function handleMousemove(event) {
  clearTimeout(timeoutID);
  controls.hidden = false;
  timeoutID = setTimeout(() => {
    controls.hidden = true;
  }, 2000);
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("input", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
video.addEventListener("timeupdate", handleTime);
fullScreenBtn.addEventListener("click", handleFullScreen);
//
video.addEventListener("mousemove", handleMousemove);
//
video.addEventListener("timeupdate", handleMoveTimeRange);

//
timeRange.addEventListener("input", handleMoveToTimeRange);
