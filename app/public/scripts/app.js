let favoriteBooks = [];
let heartChecked = false;

function detailpage() {
    const addToFavoritesForm = document.querySelector('.add-to-favorites');
    const heartIcon = document.querySelector('#heart');
    
    const currentBook = {
        id: document.querySelector('.details-overview').getAttribute('data-id'),
        image: document.querySelector('.details-overview__img img').src,
        title: document.querySelector('.details__title').textContent,
        author: document.querySelector('.details__author').textContent,
        description: document.querySelector('.details__description').textContent,
        language: document.querySelector('.details__language').textContent,
        publisher: document.querySelector('.details__publisher').textContent,
        year: document.querySelector('.details__year').textContent
    };
    
    heartIcon.addEventListener('click', addToFavorites);
    
    function addToFavorites() {
        if(!heartChecked) {
            favoriteBooks.push(currentBook);
            heartChecked = true;
            document.querySelector('.header__heart svg g').style.fill = '#EB1F25';
            saveFavoriteBook();
        } else {
            const bookToDelete = favoriteBooks.findIndex(function(favBook) {
                return favBook.id === currentBook.id;
            });
            
            if(bookToDelete > -1) {
                favoriteBooks.splice(bookToDelete, 1);
            }
            heartChecked = false;
            saveFavoriteBook();
        }
    }
    
    function saveFavoriteBook() {
        localStorage.setItem('favorites', JSON.stringify(favoriteBooks));
    }
    
    function checkFavoriteBook() {
        const favoriteBook = favoriteBooks.find(function(favBook) {
            return favBook.id === currentBook.id
        });
    
        if(favoriteBook) {
            heartChecked = true;
            addToFavoritesForm.querySelector('input').checked = true;
        }
    }
    
    function getFavoriteBooks() {
        const booksJSON = localStorage.getItem('favorites');
        
        try {
            favoriteBooks = booksJSON ? JSON.parse(booksJSON) : [];
        }  catch(e) {
            favoriteBooks = [];
        }
        checkFavoriteBook();
    }
    
    getFavoriteBooks();
}

function favoritepage() {
    const favoriteBooksContainer = document.querySelector('.favorite-section');

    function getFavoriteBooks() {
        const booksJSON = localStorage.getItem('favorites');
        
        try {
            favoriteBooks = booksJSON ? JSON.parse(booksJSON) : [];
        }  catch(e) {
            favoriteBooks = [];
        }
    }
    
    function renderFavoriteBooks() {
        if(favoriteBooks.length > 0) {
            favoriteBooks.forEach(function(favBook) {
                const book = `
                    <a tabindex="0" href="detailpage/${favBook.id}" class="book-result">
                        <div class="book-result__image">
                            <img src="${favBook.image}" alt="Boek cover: ${favBook.title}"></img>
                        </div>
                    </a>
                `;
                
                favoriteBooksContainer.insertAdjacentHTML('beforeend', book);
            });
        } else if(favoriteBooks.length === 0) {
            const message = `<h3 class="warning">Je hebt nog geen boeken aan je favorieten lijst toevoegd</h3>`;
            favoriteBooksContainer.insertAdjacentHTML('beforebegin', message);
        }
    }
    getFavoriteBooks();
    renderFavoriteBooks();
}

if(window.location.pathname.includes('detailpage')) {
    detailpage();
} else if(window.location.pathname.includes('favorites')) {
    favoritepage();
}
