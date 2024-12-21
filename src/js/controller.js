import * as model from './model.js';

import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //  1) Render the spinner
    recipeView.renderSpinner(``);

    //  2) Fetch the data from API
    // if we do not await the result the state
    // will be undefined and will passed to
    // render function
    await model.loadRecipe(id);

    //  3) Render the data got from API
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchRecipes = async function () {
  try {
    // Render spinner
    resultsView.renderSpinner();

    // Get query
    const query = searchView.getQuery();
    if (!query) return;

    // Fetch data using query
    await model.loadSearchRecipes(query);

    controlPagination();

    // RENDER DATE ACCORDING TO PAGE
    const page = model.state.searchResult.page;

    const data = model.state.searchResult.data.slice(
      (page - 1) * 10,
      page * 10
    );

    // render data
    resultsView.render(data);
  } catch (err) {
    console.log(err.message);
  }
};

const controlServings = function (servings) {
  model.updateServings(servings);
  console.log(model.state.recipe);
  // render servings again
  recipeView.render(model.state.recipe);
};

const controlPagination = function () {
  paginationView.render(model.state.searchResult);
};

// controlRecipe();
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerPages(
    model.nextPage,
    model.previousPage,
    controlSearchRecipes
  );
  recipeView.addHandlerUpdateServings(controlServings);
};

init();
