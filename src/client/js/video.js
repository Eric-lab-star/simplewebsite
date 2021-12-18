const playBtn = document.querySelector(".playBtn");
const video = document.querySelector("video");
const muteBtn = document.querySelector(".muteBtn");
const soundBar = document.querySelector(".soundBar");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const handlePlayBtn = () => {
  if (video.paused === true) {
    video.play();
    playBtn.innerText = "Pause";
  } else {
    video.pause();
    playBtn.innerText = "Play";
  }
};
const handleMuteBtn = () => {
  if (video.muted) {
    muteBtn.innerText = "Mute";
    video.muted = false;
    return;
  } else {
    muteBtn.innerText = "Unmute";
    video.muted = true;
    return;
  }
};
const handleSound = () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  video.volume = soundBar.value;
};

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

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("input", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
video.addEventListener("timeupdate", handleTime);
