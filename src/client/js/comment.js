const videoContainer = document.querySelector(".watchVideo");
const form = document.getElementById("videoCommentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

function handleSubmit(event) {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }
  fetch(`/api/video/${videoId}/comments`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
}

form.addEventListener("submit", handleSubmit);
