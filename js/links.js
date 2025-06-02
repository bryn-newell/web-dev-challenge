import { openAndCloseTab } from './openAndCloseTab.js';

const form = document.querySelector('#form');
const list = document.querySelector('#display-list');

const arrOfLinks = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const formDataLinks = data.get('links');
  const separatedFormLinks = formDataLinks.split(' ');

  arrOfLinks.push(...separatedFormLinks);

  const listItemElement = (str) => `<li><a href="${str}">${str}</a></li>`;

  list.innerHTML = arrOfLinks.map((link) => listItemElement(link)).join('');
});

const readButton = document.querySelector('#read-button');
readButton.addEventListener('click', () => {
  arrOfLinks.forEach((link, index) => {
    const position = 100 * index;
    openAndCloseTab(link, position);
  });
});

const clearFormButton = document.querySelector('#clear-button');
clearFormButton.addEventListener('click', () => {
  form.reset();
  list.innerHTML = ' ';
  console.log('is this working');
});
