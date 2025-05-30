import { testOpen } from './testOpen.js';

const form = document.querySelector('#form');
const list = document.querySelector('#display-list');

const arrOfLinks = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const inputLinks = data.get('links');
  console.log(inputLinks);

  const listElement = (str) => `<li>${str}</li>`;
  arrOfLinks.push(inputLinks);

  list.innerHTML = arrOfLinks.map((link) => listElement(link)).join('');
});

const readButton = document.querySelector('#read-button');
readButton.addEventListener('click', () => {
  arrOfLinks.forEach((link) => {
    testOpen(link);
  });
});
