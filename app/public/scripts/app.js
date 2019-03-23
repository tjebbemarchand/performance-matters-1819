let favoriteBooks = [];
let heartChecked = false;

const addToFavoritesForm = document.querySelector('.add-to-favorites');
const heartIcon = document.querySelector('#heart');
const bookID = document.querySelector('.details-overview').getAttribute('data-id');

heartIcon.addEventListener('click', addToFavorites)

function addToFavorites() {
    if(!heartChecked) {
        favoriteBooks.push(bookID);
        heartChecked = true;
        saveFavoriteBooks();
    } else {
        const bookIndex = favoriteBooks.findIndex(function(book) {
            return book === bookID;
        });
        
        if(bookIndex > -1) {
            favoriteBooks.splice(bookIndex, 1);
        }
        heartChecked = false;
        saveFavoriteBooks();
    }
}

function saveFavoriteBooks() {
    localStorage.setItem('favorites', JSON.stringify(favoriteBooks)); // Convert array to a string and save it in localStorage.
}

function getFavoriteBook() {
    const booksJSON = localStorage.getItem('favorites');

    try {
        favoriteBooks = booksJSON ? JSON.parse(booksJSON) : [];
    }  catch(e) {
        todos = [];
    }
}

getFavoriteBook();