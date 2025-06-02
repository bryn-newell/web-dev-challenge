import { openAndCloseTab } from "./openAndCloseTab.js";

const form = document.querySelector("#form");
const list = document.querySelector("#display-list");
const input = document.querySelector("#input");

let arrOfLinks = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const formDataLinks = data.get("links");
  const separatedFormLinks = formDataLinks.split(" ");

  arrOfLinks.push(...separatedFormLinks);

  // if i have time don't allow for a list item to be empty
  const listItemElement = (str) => `<li><a href="${str}">${str}</a></li>`;

  list.innerHTML = arrOfLinks.map((link) => listItemElement(link)).join("");

  fetch("http://localhost:3000/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ links: arrOfLinks }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  input.value = "";
});

const readButton = document.querySelector("#read-button");
readButton.addEventListener("click", () => {
  arrOfLinks.forEach((link, index) => {
    const position = 100 * index;
    const left = position;
    let top = position;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (top > windowHeight) {
      //  to do - random number instead?
      const shift = 100 * index;
      top = position - shift;
      console.log("new top", top);
    }

    console.log({ windowHeight }, { windowWidth }, { left }, { top });
    // to do - instead of x number of screens calculate the window width

    openAndCloseTab(link, left, top);
  });

  fetch("http://localhost:3000/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

const clearFormButton = document.querySelector("#clear-button");
clearFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  list.innerHTML = "";
  arrOfLinks = [];
  input.value = "";

  fetch("http://localhost:3000/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ links: [] }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
