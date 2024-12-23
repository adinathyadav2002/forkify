// Why we use models in mvc ?
// 1. Data Schema (if using a database)
// 2. Business Logic
// 3. Database Interactions
// 4. Validation and Rules
// 5. State Management (if applicable)
// 6. Error Handling

import { getJSON } from './helper.js';
import { API_URL, PAGES_COUNT } from './config';

export const state = {
  //bookmarks
  bookmarks: [],
  // recipe view right side
  recipe: {},
  // result of search query
  searchResult: {
    query: '',
    data: [],
    page: 1,
    pagesCount: PAGES_COUNT,
  },
};

export const loadRecipe = async function () {
  try {
    // const res = await fetch();
    // const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message}(${res.status})`);
    // const { recipe } = data.data;

    const id = window.location.hash.slice(1);
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;

    const index = getRecipeIndex(id);
    let val;
    if (index === -1) {
      if (isPresentInBookmarks(id) === -1) val = false;
      else val = true;
    } else val = state.searchResult.data[index].bookmark;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      bookmark: val,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchRecipes = async function (query) {
  try {
    const data = await getJSON(`${API_URL.slice(0, -1)}?search=${query}`);
    const { recipes } = data.data;

    state.searchResult.query = query;

    state.searchResult.data = recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
        bookmark: false,
      };
    });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// setting the current result pages
export const getResultPages = function () {
  const page = state.searchResult.page;
  return state.searchResult.data.slice(
    (page - 1) * PAGES_COUNT,
    page * PAGES_COUNT
  );
};

// increment page number
export const nextPage = function () {
  const pages = Math.round(state.searchResult.data.length / 10);
  if (pages < state.searchResult.page) return;
  state.searchResult.page++;
};

// decrement page number
export const previousPage = function () {
  if (state.searchResult.page <= 1) return;
  state.searchResult.page--;
};

// updating quantity with update in servings
export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(item => {
    item.quantity = (item.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

// adding to bookmark
export const addToBookmark = function () {
  // change state.bookmark to TRUE
  state.searchResult.data[getRecipeIndex(state.recipe.id)].bookmark = true;

  state.bookmarks.push(state.recipe);
};

// removing from bookmark
export const removeFromBookmark = function () {
  // change state.bookmark to FALSE
  state.searchResult.data[getRecipeIndex(state.recipe.id)].bookmark = false;

  // deleting the item ES6
  state.bookmarks = state.bookmarks.filter(item => item.id != state.recipe.id);
};

// HELPER FUNCTION
const getRecipeIndex = function (id) {
  return state.searchResult.data.findIndex(item => item.id === id);
};

// to check weather it is present in bookmarkds
const isPresentInBookmarks = function (id) {
  if (!state.bookmarks.length) return -1;
  return state.bookmarks.findIndex(item => item.id === id);
};
