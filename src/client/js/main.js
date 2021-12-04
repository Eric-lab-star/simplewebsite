import "../scss/styles.scss";

const nav = document.querySelector(".nav");
const list = document.querySelector("#list");

const extendNav = () => {
  nav.classList.toggle("extended_nav");
  nav.classList.toggle("nav");
};

list.addEventListener("click", extendNav);
