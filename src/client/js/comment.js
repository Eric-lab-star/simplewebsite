import "regenerator-runtime/runtime";

const videoContainer = document.querySelector(".watchVideo");
const form = document.getElementById("videoCommentForm");

function addComment(text) {
  const showComments = document.querySelector(".fakeComentBox");
  showComments.classList.add("showComments");
  const avatar = showComments.dataset.loggedinuseravatar;
  const username = showComments.dataset.username;
  showComments.innerHTML = `
  <div class="commentImgBox">
    <img src=${avatar}>
  </div>
  <div class="commentContents">
    <div class="commentNameAndCreatedAt">
      <span class="commentUser">${username}</span>
      <span class="commentCreatedAt">${new Date().toLocaleDateString()}</span>
    </div>
    <div class="commentText">${text}</div>
    <div class="btnBox">
      <a class="commentLike">
        <i class="far fa-thumbs-up"></i>
        <span>0</span>
      </a>
      <a class="commentDislike">
        <i class="far fa-thumbs-down"></i>
        <span>0</span>
      </a>
      <a class="deleteComment">
        <i class="far fa-trash-alt"></i>
        <span>Delete</span>
      </a>
    </div>
  </div>
  `;
}

async function handleSubmit(event) {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/video/${videoId}/comments`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    addComment(text);
    textarea.value = "";
  }
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}
