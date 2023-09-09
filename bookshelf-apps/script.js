const bookshelfData = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isCompleted) {
  return {
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  };
}

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;

  const generateId = generateId();
  const bookObject = generateBookObject(
    generateId,
    textTitle,
    textAuthor,
    textYear,
    false
  );
  bookshelfData.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function() {
  console.log(bookshelfData);
});