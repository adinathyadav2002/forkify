// Why we use models in mvc ?
// 1. Data Schema (if using a database)
// 2. Business Logic
// 3. Database Interactions
// 4. Validation and Rules
// 5. State Management (if applicable)
// 6. Error Handling

import { AJAX } from './helper.js';
import { API_URL, PAGES_COUNT, API_KEY } from './config';

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

const createRecipeObject = function (data, val) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmark: val,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function () {
  try {
    // const res = await fetch();
    // const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message}(${res.status})`);
    // const { recipe } = data.data;

    const id = window.location.hash.slice(1);
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    const index = getRecipeIndex(id);
    let val;
    if (index === -1) {
      if (isPresentInBookmarks(id) === -1) val = false;
      else val = true;
    } else val = state.searchResult.data[index].bookmark;
    state.recipe = createRecipeObject(data, val);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchRecipes = async function (query) {
  try {
    const data = await AJAX(
      `${API_URL.slice(0, -1)}?search=${query}&key=${API_KEY}`
    );
    const { recipes } = data.data;

    state.searchResult.query = query;

    state.searchResult.data = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        bookmark: false,
        ...(rec.key && { key: rec.key }),
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
  const index = getRecipeIndex(state.recipe.id);
  if (index !== -1) state.searchResult.data[index].bookmark = true;
  state.bookmarks.push(state.recipe);
};

// removing from bookmark
export const removeFromBookmark = function () {
  // change state.bookmark to FALSE
  const index = getRecipeIndex(state.recipe.id);
  if (index !== -1)
    state.searchResult.data[getRecipeIndex(state.recipe.id)].bookmark = false;

  // deleting the item ES6
  state.bookmarks = state.bookmarks.filter(item => item.id != state.recipe.id);
};

// to load data from local storage
export const loadData = function () {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  return state.bookmarks;
};

// to store data to local storage
export const storeData = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // first convert ojbect to array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please Enter the correct format.'
          );
        [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data, true);
    addToBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
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
