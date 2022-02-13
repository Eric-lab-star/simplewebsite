import "regenerator-runtime/runtime";

const videoContainer = document.querySelector(".watchVideo");
const form = document.getElementById("videoCommentForm");

function addComment(text, commentId) {
  const fakeCommentBox = document.querySelector(".fakeComentBox");
  const showComments = document.createElement("div");
  showComments.classList.add("showComments");
  showComments.id = commentId;
  const avatar = fakeCommentBox.dataset.loggedinuseravatar;
  const username = fakeCommentBox.dataset.username;
  const fakeCommentImgBox = document.createElement("div");
  fakeCommentImgBox.classList.add("commentImgBox");
  const fakeCommentContents = document.createElement("div");
  fakeCommentContents.classList.add("commentContents");
  const numberSpan = document.createElement("span");
  numberSpan.innerText = "0";
  fakeCommentImgBox.innerHTML = `
    <img src=${avatar}>
    `;
  fakeCommentContents.innerHTML = `
    <div class="commentNameAndCreatedAt">
      <span class="commentUser">${username}</span>
      <span class="commentCreatedAt">${new Date().toLocaleDateString()}</span>
    </div>
    <div class="commentText">${text}</div>
    <div class="btnBox">
      <a class="commentLike" >
        <i class="far fa-thumbs-up" id=${commentId}></i>
        <span>0</span>
      </a>
      <a class="commentDislike" >
        <i class="far fa-thumbs-down" id=${commentId}></i>
        <span>0</span>
      </a>
      <a class="deleteComment" >
        <i class="far fa-trash-alt" id=${commentId}></i>
        <span>Delete</span>
      </a>
    </div>
  `;

  showComments.appendChild(fakeCommentImgBox);
  showComments.appendChild(fakeCommentContents);
  fakeCommentBox.prepend(showComments);
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
    const getJson = await response.json();
    const id = getJson.commentId;
    addComment(text, id);
    console.log(id);
    textarea.value = "";
  }
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}
