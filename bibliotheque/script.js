let books = [];

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);

    if (title && author && year) {
        const book = {
            title: title,
            author: author,
            year: year
        };
        books.push(book);
        alert(`Livre ajouté avec succès!`);
        updateBookList();
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchInput) || 
        book.author.toLowerCase().includes(searchInput)
    );
    updateBookList(filteredBooks);
}

function updateBookList(filteredBooks = books) {
    const bookList = document.getElementById('books');
    bookList.innerHTML = '';
    filteredBooks.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `Titre: ${book.title}, Auteur: ${book.author}, Année: ${book.year}`;
        bookList.appendChild(li);
    });
}

// Initialisation de la liste des livres
updateBookList();