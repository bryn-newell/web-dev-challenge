import { openAndCloseTab } from './openAndCloseTab.js';

const form = document.querySelector('#form');
const list = document.querySelector('#display-list');

const arrOfLinks = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  //to do - allow for an array of links
  const formDataLinks = data.get('links');

  console.log(formDataLinks);
  // const filteredFormLinks = new RegEx();

  arrOfLinks.push(formDataLinks);

  const listItemElement = (str) => `<li>${str}</li>`;

  list.innerHTML = arrOfLinks.map((link) => listItemElement(link)).join('');
});

const readButton = document.querySelector('#read-button');
readButton.addEventListener('click', () => {
  arrOfLinks.forEach((link) => {
    openAndCloseTab(link);
  });
});
