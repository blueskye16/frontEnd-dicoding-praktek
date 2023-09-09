const booksShelf = [];
const RENDER_EVENT = "render-booksShelf";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    false
  );
  booksShelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(booksShelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      booksShelf.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooks = document.getElementById("incompleteBookshelfList");
  uncompletedBooks.innerHTML = "";

  const completedBooks = document.getElementById("completeBookshelfList");
  completedBooks.innerHTML = "";

  for (const bookItem of booksShelf) {
    const bookElement = makeBookList(bookItem);
    if (!bookItem.isCompleted) uncompletedBooks.append(bookElement);
    else completedBooks.append(bookElement);
  }
});

function makeBooksList(booksObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = booksObject.task;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = booksObject.textAuthor;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = booksObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  // container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `books-${booksObject.id}`);

  if (booksObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai di Baca";

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(booksObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(booksObject.id);
    });

    container.append(undoButton, trashButton);
  }
  // else {
  //   const checkButton = document.createElement("button");
  //   checkButton.classList.add("check-button");

  //   checkButton.addEventListener("click", function () {
  //     addTaskToCompleted(booksObject.id);
  //   });

  //   container.append(checkButton);
  // }

  return container;
}

function removeTaskFromCompleted(booksId) {
  const booksTarget = findBooksIndex(booksId);

  if (booksTarget === -1) return;
  booksShelf.splice(booksTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(booksId) {
  const booksTarget = findBooks(booksId);

  if (booksTarget == null) return;
  booksTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(booksId) {
  const booksTarget = findBooks(booksId);

  if (booksTarget == null) return;

  booksTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBooks(booksId) {
  for (const booksItem of booksShelf) {
    if (booksItem.id === booksId) {
      return booksItem;
    }
  }
  return null;
}

function findBooksIndex(booksId) {
  for (const index in booksShelf) {
    if (booksShelf[index].id === booksId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBooksList.innerHTML = "";

  const completedBooksList = document.getElementById("completeBookshelfList");
  completedBooksList.innerHTML = "";

  for (const booksItem of booksShelf) {
    const booksElement = makeBooksList(booksItem);
    if (!booksItem.isCompleted) uncompletedBooksList.append(booksElement);
    else completedBooksList.append(booksElement);
  }
});

const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_APPS";

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
