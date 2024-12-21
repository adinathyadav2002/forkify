// Why we use models in mvc ?
// 1. Data Schema (if using a database)
// 2. Business Logic
// 3. Database Interactions
// 4. Validation and Rules
// 5. State Management (if applicable)
// 6. Error Handling

import { getJSON } from './helper.js';
import { API_URL, DEFAULT_PAGE } from './config';

export const state = {
  recipe: {},
  searchResult: {
    query: '',
    data: [],
    page: DEFAULT_PAGE,
  },
};

export const loadRecipe = async function () {
  try {
    // const res = await fetch();
    // const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message}(${res.status})`);
    // const { recipe } = data.data;

    const data = await getJSON(`${API_URL}${window.location.hash.slice(1)}`);
    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchRecipes = async function (query) {
  try {
    const data = await getJSON(`${API_URL.slice(0, -1)}?search=${query}`);
    // const {result} = data.
    const { recipes } = data.data;

    state.searchResult.query = query;

    state.searchResult.data = recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
      };
    });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
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

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(item => {
    item.quantity = (item.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};
