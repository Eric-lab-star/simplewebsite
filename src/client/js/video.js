const playBtn = document.querySelector(".playBtn");
const video = document.querySelector("video");
const muteBtn = document.querySelector(".muteBtn");
const soundBar = document.querySelector(".soundBar");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const fullScreenBtn = document.querySelector(".fullScreenBtn");
const videoContainer = document.querySelector(".watchVideo");
const controls = document.querySelector("controls");
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
//full screen
function handleFullScreen() {
  const fullScreen = document.fullscreenElement;
  if (!fullScreen) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function handleMousemove() {
  video.classList.add("showing");
}

function handleMouseLeave() {
  setTimeout(() => video.classList.remove("showing"), 30000);
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("input", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
video.addEventListener("timeupdate", handleTime);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMousemove);
