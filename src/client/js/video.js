const playBtn = document.querySelector(".playBtn");
const video = document.querySelector("video");
const muteBtn = document.querySelector(".muteBtn");
const soundBar = document.querySelector(".soundBar");

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
  if (video.muted === false) {
    muteBtn.innerText = "Unmute";
    video.muted = true;
    return;
  }

  if (video.muted === true) {
    muteBtn.innerText = "Mute";
    video.muted = false;
    return;
  }
};

const handleSound = () => {
  video.volume = soundBar.value;
};

const handleDuration = () => {
  console.log(Math.floor(video.duration));
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("click", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
