import "regenerator-runtime/runtime";
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
const view = document.querySelector(".views");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const shareBtn = document.getElementById("shareBtn");
const videoId = videoContainer.dataset.videoid;
//

const commentBox = document.querySelector(".commentBox");
const apiPath = `/api/video/${videoId}/`;
//
async function handleLikeAndDislikeBtn(event) {
  const target = event.target;
  if (
    target.className === "far fa-thumbs-up" ||
    target.className === "far fa-thumbs-down"
  ) {
    const id = target.id;
    const className = target.className;
    const response = await fetch(apiPath + "addLikeAndDislike", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id, className }),
    });
    console.log(target.nextElementSibling);
    if (response.status === 200) {
      target.nextElementSibling.innerText =
        parseInt(target.nextElementSibling.innerText) + 1;
    }
    return;
  }
  if (target.className === "far fa-trash-alt") {
    const id = target.id;

    const response = await fetch(apiPath + "deleteComment", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (response.status === 200) {
      const showComments = document.getElementById(id);
      showComments.style.display = "none";
    }
  }
}

commentBox.addEventListener("click", handleLikeAndDislikeBtn);

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
  controls.classList.remove("hide");
  timeoutID = setTimeout(() => {
    controls.classList.add("hide");
  }, 2000);
}

function handleEnded() {
  view.innerText = parseInt(view.innerText) + 1 + ` views | `;

  fetch(apiPath + "view", {
    method: "POST",
  });
}

function handleAddLike() {
  likeBtn.children[1].innerText = parseInt(likeBtn.children[1].innerText) + 1;
  likeBtn.removeEventListener("click", handleAddLike);
  likeBtn.addEventListener("click", handleRemoveLike);
  fetch(apiPath + "addLikeBtn", {
    method: "POST",
  });
}

function handleRemoveLike() {
  likeBtn.children[1].innerText = parseInt(likeBtn.children[1].innerText) - 1;
  likeBtn.removeEventListener("click", handleRemoveLike);
  likeBtn.addEventListener("click", handleAddLike);
  fetch(apiPath + "removeLikeBtn", {
    method: "POST",
  });
}

function handleAddDislike() {
  dislikeBtn.children[1].innerText =
    parseInt(dislikeBtn.children[1].innerText) + 1;
  dislikeBtn.removeEventListener("click", handleAddDislike);
  dislikeBtn.addEventListener("click", handleRemoveDislike);
  fetch(apiPath + "addDislikeBtn", {
    method: "POST",
  });
}

function handleRemoveDislike() {
  dislikeBtn.children[1].innerText =
    parseInt(dislikeBtn.children[1].innerText) - 1;
  dislikeBtn.removeEventListener("click", handleRemoveDislike);
  dislikeBtn.addEventListener("click", handleAddDislike);
  fetch(apiPath + "removeDislikeBtn", {
    method: "POST",
  });
}

const clipboard = new ClipboardJS("#shareBtn");

function handleCopy() {
  clipboard.on("success", function (e) {
    console.log("Copied!");
  });
  clipboard.on("error", function (e) {
    console.log("Error!");
  });
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
soundBar.addEventListener("input", handleSound);
video.addEventListener("loadedmetadata", handleDuration);
video.addEventListener("timeupdate", handleTime);
video.addEventListener("mousemove", handleMousemove);
video.addEventListener("timeupdate", handleMoveTimeRange);
video.addEventListener("ended", handleEnded);
//
likeBtn.addEventListener("click", handleAddLike);
dislikeBtn.addEventListener("click", handleAddDislike);
shareBtn.addEventListener("click", handleCopy);

//
timeRange.addEventListener("input", handleMoveToTimeRange);
fullScreenBtn.addEventListener("click", handleFullScreen);
