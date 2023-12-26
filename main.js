// nyimpen daftar buku
let books = [];

// addbuku
function addBook(event) {
  event.preventDefault();

  // form input
  const titleInput = document.querySelector("#inputBookTitle");
  const authorInput = document.querySelector("#inputBookAuthor");
  const yearInput = document.querySelector("#inputBookYear");
  const isCompleteCheckbox = document.querySelector("#inputBookIsComplete");

  // objek buku baru
  const newBook = {
    id: +new Date(),
    title: titleInput.value,
    author: authorInput.value,
    year: yearInput.value,
    isComplete: isCompleteCheckbox.checked,
  };

  //   console.log(newBook);

  // add buku ke array
  books.push(newBook);

  // nyari event book changed
  document.dispatchEvent(new Event("bookChanged"));
  // clear
  clearInputFields();
}

// search judul
function searchBooks(event) {
  event.preventDefault();

  const searchInput = document.querySelector("#searchBookTitle");
  const query = searchInput.value.toLowerCase();

  if (query) {
    displayBooks(
      books.filter((book) => book.title.toLowerCase().includes(query))
    );
  } else {
    displayBooks(books);
  }
}

// selesai baca
function markAsComplete(event) {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = true;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

// belum selesai baca
function markAsIncomplete(event) {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = false;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

// hapus buku
function deleteBook(event) {
  const bookId = Number(event.target.id);

  if (isConfirmed) {
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event("bookChanged"));
    }
  }
}

// edit
function editBook(event) {
  const bookId = Number(event.target.getAttribute("data-id"));
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const editedBook = books[bookIndex];

    // Ubah teks "Edit Buku"
    const h2Element = document.querySelector(".input_section h2");
    h2Element.textContent = "Edit Buku";

    // Scroll input_section
    const inputSection = document.querySelector(".input_section");
    inputSection.scrollIntoView({ behavior: "smooth" });

    // value form edit
    const titleInput = document.querySelector("#inputBookTitle");
    const authorInput = document.querySelector("#inputBookAuthor");
    const yearInput = document.querySelector("#inputBookYear");
    const isCompleteCheckbox = document.querySelector("#inputBookIsComplete");

    // Set data buku pada form
    titleInput.value = editedBook.title;
    authorInput.value = editedBook.author;
    yearInput.value = editedBook.year;
    isCompleteCheckbox.checked = editedBook.isComplete;

    // Set data-id pada inputBookIsComplete
    isCompleteCheckbox.setAttribute("data-id", editedBook.id);

    // ganti label submit
    const submitButton = document.querySelector("#bookSubmit");
    submitButton.textContent = "Simpan Perubahan";

    // Tangani pengiriman formulir pengeditan
    const editForm = document.querySelector("#inputBook");
    editForm.removeEventListener("submit", addBook); // Hapus event tambah buku
    editForm.addEventListener("submit", saveEditedBook); // Tambah event simpan buku yang diedit
  }
}

// save edit
function saveEditedBook(event) {
  event.preventDefault();

  // Form input
  const titleInput = document.querySelector("#inputBookTitle");
  const authorInput = document.querySelector("#inputBookAuthor");
  const yearInput = document.querySelector("#inputBookYear");
  const isCompleteCheckbox = document.querySelector("#inputBookIsComplete");

  // Ambil ID yang sedang diedit
  const editedBookId = Number(isCompleteCheckbox.getAttribute("data-id"));
  const editedBookIndex = books.findIndex((book) => book.id === editedBookId);

  if (editedBookIndex !== -1) {
    // Perbarui data buku yang diedit
    books[editedBookIndex].title = titleInput.value;
    books[editedBookIndex].author = authorInput.value;
    books[editedBookIndex].year = yearInput.value;
    books[editedBookIndex].isComplete = isCompleteCheckbox.checked;

    // Confirm
    const isConfirmed = confirm("Yakin mau nyimpen yang udah diubah?");

    if (isConfirmed) {
      // Ganti label tombol "Simpan Perubahan" menjadi "Masukkan Buku ke Rak" (kembali ke mode tambah buku)
      const submitButton = document.querySelector("#bookSubmit");
      submitButton.textContent = "Masukkan Buku ke Rak";

      // Reset form
      clearInputFields();

      // Hapus atribut data-id pada inputBookIsComplete
      isCompleteCheckbox.removeAttribute("data-id");

      // Hapus event simpan buku yang diedit tambahkan kembali event tambah buku
      const editForm = document.querySelector("#inputBook");
      editForm.removeEventListener("submit", saveEditedBook);
      editForm.addEventListener("submit", addBook);

      // Kembali ke tampilan awal
      document.dispatchEvent(new Event("bookChanged"));

      // Ubah teks "Masukkan Buku Baru"
      const h2Element = document.querySelector(".input_section h2");
      h2Element.textContent = "Masukkan Buku Baru";
    }
  }
}

// confirm delete
function showDeleteConfirmation(event) {
  const bookId = Number(event.target.getAttribute("data-id"));
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const bookTitle = books[bookIndex].title;
    const isConfirmed = confirm(`Yakin mau hapus buku "${bookTitle}" nih?`);

    if (isConfirmed) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event("bookChanged"));
    }
  }
}

// list buku
function displayBooks(bookList) {
  const incompleteBookshelf = document.querySelector(
    "#incompleteBookshelfList"
  );
  const completeBookshelf = document.querySelector("#completeBookshelfList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  for (const book of bookList) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");

    const titleElement = document.createElement("h2");
    titleElement.innerText = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = "Penulis: " + book.author;

    const yearElement = document.createElement("p");
    yearElement.innerText = "Tahun: " + book.year;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(yearElement);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    // tombol edit
    const editButton = document.createElement("button");
    editButton.id = book.id;
    editButton.setAttribute("data-id", book.id);
    editButton.classList.add("blue", "fas", "fa-edit");
    editButton.addEventListener("click", editBook);
    actionContainer.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.id = book.id;
    deleteButton.setAttribute("data-id", book.id);
    deleteButton.classList.add("red", "fas", "fa-trash");
    deleteButton.addEventListener("click", showDeleteConfirmation);
    actionContainer.appendChild(deleteButton);

    if (book.isComplete) {
      const markIncompleteButton = document.createElement("button");
      markIncompleteButton.id = book.id;
      markIncompleteButton.classList.add("green", "fa-regular", "fa-eye-slash");
      markIncompleteButton.addEventListener("click", markAsIncomplete);

      actionContainer.appendChild(markIncompleteButton);
      completeBookshelf.appendChild(bookElement);
    } else {
      const markCompleteButton = document.createElement("button");
      markCompleteButton.id = book.id;
      markCompleteButton.classList.add("green", "fa-regular", "fa-eye");
      console.log(markCompleteButton);
      markCompleteButton.addEventListener("click", markAsComplete);

      actionContainer.appendChild(markCompleteButton);
      incompleteBookshelf.appendChild(bookElement);
    }

    bookElement.appendChild(actionContainer);
  }
}

// local storage
function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
  const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
  return storedBooks;
}

function clearInputFields() {
  document.querySelector("#inputBookTitle").value = "";
  document.querySelector("#inputBookAuthor").value = "";
  document.querySelector("#inputBookYear").value = "";
  document.querySelector("#inputBookIsComplete").checked = false;
}

window.addEventListener("load", function () {
  books = loadBooksFromLocalStorage();
  displayBooks(books);

  const inputBookForm = document.querySelector("#inputBook");
  const searchBookForm = document.querySelector("#searchBook");

  inputBookForm.addEventListener("submit", addBook);
  searchBookForm.addEventListener("submit", searchBooks);

  document.addEventListener("bookChanged", function () {
    saveBooksToLocalStorage(books);
    displayBooks(books);
  });
});
