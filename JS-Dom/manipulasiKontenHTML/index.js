const gambar = document.getElementById("gambar");
gambar.setAttribute("width", 300);
gambar.setAttribute("height", 215);
// const buttons = document.querySelectorAll(".button");
// const playButton = buttons[3];
// const playButtonElement = playButton.children[0];
// playButtonElement.setAttribute('type', 'submit');

// Manipulasi konten HTML
const dicoding = document.getElementById('dicodingLink');
dicoding.innerHTML = '<i>Belajar Programming di Dicoding</i>';
const google = document.getElementById('googleLink');
google.innerText = 'Mencari sesuatu di Google';

const buttons = document.getElementsByClassName('button');
for (const button of buttons) {
  button.children[0].style.borderRadius = '5px';
}