import searchImage from './js/pixeabay-api';
import createGallery from './js/render-fuction';
const searchForm = document.getElementById('searchForm');
const input = document.querySelector('.search input');
const gallery = document.querySelector('.gallery');
const buttonContainer = document.getElementById('button-container');

let currentQuery = '';
let page = 1;
const perPage = 15;
let totalHits = 0;
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  currentQuery = input.value.trim();
  searchImages();
});

async function searchImages() {
  try {
    const response = await searchImage(currentQuery, page, perPage);
    totalHits = response.data.totalHits;
    if (response.data.hits.length === 0) {
      alert('ooops');
      input.value = ''; // Clear input field on no results
      return;
    } else {
      createGallery(response.data.hits);
    }
  } catch (error) {
    console.error('Error during the search request:', error);
  }
}
