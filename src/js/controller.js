import * as model from './model.js';

import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MESSAGE_TIMOUT } from './config';

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //  0) Insetead of rendering the whole result just
    //     update the changed result
    resultsView.update(model.getResultPages());

    //  1) Render the spinner
    recipeView.renderSpinner(``);

    //  2) Fetch the data from API
    // if we do not await the result the state
    // will be undefined and will passed to
    // render function
    await model.loadRecipe(id);

    //  3) Render the data got from API
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
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

    // render data
    resultsView.render(model.getResultPages());
  } catch (err) {
    console.log(err.message);
  }
};

const controlBookmarks = async function (flag) {
  // add to bookmarks
  if (flag) model.addToBookmark();
  // remove from bookmarks
  if (!flag) model.removeFromBookmark();

  // render bookmarks
  bookmarksView.renderBookmarks(model.state.bookmarks);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  // render servings again

  recipeView.update(model.state.recipe);
};

const controlPagination = function () {
  paginationView.render(model.state.searchResult);
};

const controlUpload = async function (data) {
  try {
    // render spinner
    addRecipeView.renderSpinner();

    // upload recipe data
    await model.uploadRecipe(data);

    // display success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.renderBookmarks(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back(); to go back

    // render the recipe
    recipeView.render(model.state.recipe);

    //close the form window
    setTimeout(() => {
      addRecipeView.toggleHidden();
    }, MESSAGE_TIMOUT);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

// controlRecipe();
const init = function () {
  bookmarksView.addHandlerLocalStorage(
    model.loadData,
    model.storeData,
    model.state.bookmarks
  );
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerPages(
    model.nextPage,
    model.previousPage,
    controlSearchRecipes
  );
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);

  addRecipeView.addHandlerUpload(controlUpload);
};

init();
