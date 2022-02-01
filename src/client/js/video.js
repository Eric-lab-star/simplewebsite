const playBtn = document.getElementById("playBtn");
const video = document.querySelector("video");
const muteBtn = document.getElementById("muteBtn");
const soundBar = document.querySelector(".soundBar");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const videoContainer = document.querySelector(".watchVideo");
const controls = document.querySelector(".controls");
const timeRange = document.querySelector("#videoPlayBar");
let volumeLevel;

video.volume = soundBar.value;
//play
const handlePlayBtn = () => {
  if (video.paused === true) {
    video.play();
    playBtn.classList = "fas fa-pause";
  } else {
    video.pause();
    playBtn.classList = "fas fa-play";
  }
};

//sound
const handleMuteBtn = () => {
  if (video.muted) {
    muteBtn.classList = "fas fa-volume-up";
    soundBar.value = volumeLevel;

    video.muted = false;
    return;
  } else {
    muteBtn.classList = "fas fa-volume-mute";

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
    fullScreenBtn.classList = "fas fa-compress";
    controls.hidden = true;
  } else {
    fullScreenBtn.classList = "fas fa-expand";
    document.exitFullscreen();
  }
}
//show video controls
let timeoutID;
function handleMousemove(event) {
  clearTimeout(timeoutID);
  console.log("remove hide");
  controls.classList.remove("hide");

  timeoutID = setTimeout(() => {
    console.log("ass hide");
    controls.classList.add("hide");
  }, 2000);
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("input", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
video.addEventListener("timeupdate", handleTime);
fullScreenBtn.addEventListener("click", handleFullScreen);

video.addEventListener("mousemove", handleMousemove);
//
video.addEventListener("timeupdate", handleMoveTimeRange);

//
timeRange.addEventListener("input", handleMoveToTimeRange);
