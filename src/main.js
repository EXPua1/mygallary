import searchImage from './js/pixeabay-api';
import createGallery from './js/render-fuction';

import {
  infoMessage,
  addLoader,
  removeLoader,
  scrollToNewImages,
  endCollection,
  showErrorToast,
  errorMessage,
} from './js/functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.getElementById('searchForm');
const input = document.querySelector('.search input');
const gallery = document.querySelector('.gallery');
const paginationContainer = document.getElementById('pagination-container');

let currentQuery = '';
let isSearching = false;
let page = 1;
const perPage = 15;
let totalHits = 0;
let totalPages = 0;

searchForm.addEventListener('submit', event => {
  event.preventDefault();

  if (isSearching) {
    return;
  }
  if (input.value.trim() === '') {
    infoMessage();
    return;
  }
  isSearching = true;
  page = 1;
  currentQuery = input.value.trim();
  gallery.innerHTML = '';
  paginationContainer.innerHTML = ''; // Clear previous pagination
  searchImages();
});

async function searchImages() {
  try {
    addLoader();
    const response = await searchImage(currentQuery, page, perPage);
    totalHits = response.data.totalHits;
    totalPages = Math.ceil(totalHits / perPage);
    if (response.data.hits.length === 0) {
      errorMessage();
      input.value = ''; // Clear input field on no results
      return;
    } else {
      createGallery(response.data.hits);
      createPagination(totalPages, page);
      if (totalHits <= page * perPage) {
        setTimeout(() => {
          endCollection();
        }, 500);
      }
    }
  } catch (error) {
    console.error('Error during the search request:', error);
    errorMessage('An error occurred during the search.');
  } finally {
    removeLoader();
    isSearching = false;
  }
}

function createPagination(totalPages, currentPage) {
  paginationContainer.innerHTML = '';

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstPageButton = document.createElement('button');
    firstPageButton.textContent = '1';
    firstPageButton.classList.add('page-button');
    if (1 === currentPage) {
      firstPageButton.classList.add('active');
    }
    firstPageButton.addEventListener('click', () => goToPage(1));
    paginationContainer.appendChild(firstPageButton);

    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => goToPage(i));
    paginationContainer.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }

    const lastPageButton = document.createElement('button');
    lastPageButton.textContent = totalPages;
    lastPageButton.classList.add('page-button');
    if (totalPages === currentPage) {
      lastPageButton.classList.add('active');
    }
    lastPageButton.addEventListener('click', () => goToPage(totalPages));
    paginationContainer.appendChild(lastPageButton);
  }
}

function goToPage(pageNumber) {
  if (isSearching || pageNumber === page) {
    return;
  }
  page = pageNumber;
  gallery.innerHTML = '';
  searchImages();
}

document.addEventListener('touchstart', function () {}, { passive: true });
document.addEventListener('touchmove', function () {}, { passive: true });
