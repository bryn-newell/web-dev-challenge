import { openAndCloseTab } from "./openAndCloseTab.js";

const form = document.querySelector("#form");
const list = document.querySelector("#display-list");
const input = document.querySelector("#input");
const readSection = document.querySelector(".read-section");

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

  // there should be an if statement here but oh well
  readSection.style.display = "block";
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
  let freshIndex = 0;
  arrOfLinks.forEach((link, index) => {
    const position = 100 * index;
    let left = position;
    let top = position;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (top > windowHeight) {
      // this is buggy  - will only work for so many windows
      top = 100 * freshIndex;
      left = 400;
      left += 100 * freshIndex;

      // this insane i'm aware - i'm not writing a recursive function though i just need it to work for demo
      if (top > windowHeight) {
        top = Math.round(Math.random() * windowHeight);
        left = Math.round(Math.random() * windowWidth);
      }

      freshIndex++;
    }
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
  readSection.style.display = "none";

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

console.log(window.innerWidth);
console.log(window.innerHeight);
