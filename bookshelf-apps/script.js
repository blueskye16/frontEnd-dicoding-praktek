const bookshelfData = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";
const checkBox = document.getElementById("inputBookIsComplete");

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelfData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookshelfData.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

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

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;

  const generatedId = generateId();
  const bookObject = generateBookObject(
    generatedId,
    textTitle,
    textAuthor,
    textYear,
    checkBox.checked
  );
  bookshelfData.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(bookshelfData);
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const bookItem of bookshelfData) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun Terbit : ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("action");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("id", `bookId-${bookObject._id}`);

  if (bookObject.isCompleted) {
    const btnUndoneBook = document.createElement("button");
    btnUndoneBook.innerText = "Belum semua dibaca";
    btnUndoneBook.classList.add("green");
    btnUndoneBook.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const btnDeleteBook = document.createElement("button");
    btnDeleteBook.innerText = "Hapus buku";
    btnDeleteBook.classList.add("red");
    btnDeleteBook.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    textContainer.append(btnUndoneBook, btnDeleteBook);
  } else {
    const btnDoneBook = document.createElement("button");
    btnDoneBook.innerText = "Selesai dibaca";
    btnDoneBook.classList.add("green");
    btnDoneBook.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const btnDeleteBook = document.createElement("button");
    btnDeleteBook.innerText = "Hapus buku";
    btnDeleteBook.classList.add("red");
    btnDeleteBook.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    textContainer.append(btnDoneBook, btnDeleteBook);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookId == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookshelfData.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of bookshelfData) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookshelfData) {
    if (bookshelfData[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

checkBox.addEventListener("click", function () {
  if (checkBox.checked === true) {
    document.getElementById("bookSubmit").innerHTML =
      "Masukkan Buku ke rak <span>Selesai Dibaca</span>";
  } else {
    document.getElementById("bookSubmit").innerHTML =
      "Masukkan Buku ke rak <span>Belum Selesai Dibaca</span>";
  }
});
