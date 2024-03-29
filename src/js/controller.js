// 'use strict'; //NOTE: ES6 modules have implict strict mode, and Babel dicates strict mode by default as well.
//->MVC module imports
import * as model from './model.js';
import { MODAL_CLOSE_WAIT } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//->Establish links to polifilling libraries
import 'core-js/stable'; //NOTE: polyfill only stable features - ES and web standards:
// import { async } from 'regenerator-runtime'; //Imports only what is relavant {async} library in this case
// import 'regenerator-runtime/runtime.js'; //Imports the whole library

/////////////////////////////////////
//--> DISABLE PARCEL LIVE CONNECTION TO CLEAR STATE OF THE WEBPAGE BY RELOADING ON EACH SAVE
if (module.hot) {
  module.hot.accept();
}
/////////////////////////////////////

//////////////////////////////////////////
// https://forkify-api.herokuapp.com/v2
//////////////////////////////////////////

const controlRecipes = async function () {
  try {
    //-->Strip out the id from the clicked result with #href for EVENTHANDLER#1
    const id = window.location.hash.slice(1); //Gets rid of the # and attains the remainder id value
    // console.log(id);
    if (!id) return; //GUARD clause if page initiates with no recipe id

    //-->Start loading spinner inside the recipeContainer
    recipeView.renderSpinner();

    //-->Update results view to highlight the selected search result on the current page(model.getSearchResultPage())
    resultsView.update(model.getSearchResultsPage()); //we use update() rather than render() since only changed item gets rendered
    //-->Update bookmarks view to highlight the selected search result
    bookmarksView.update(model.state.bookmarks);

    //-->Load recipe data
    await model.loadRecipe(id);
    //Note: loadREcipe is an async function and would return a promise so we have to wait for it

    //-->Render recipe data
    recipeView.render(model.state.recipe);
    // console.log('🎃render: ', model.state.recipe);
    // const recipeView = new RecipeView(model.state.recipe);
    //Note: we could have recipeView.js export the object and we call create an instance of it here but we have chosen to create an instance of the object in recipeView.js, REcipeview object remained private and we just call it from here with its data input from model.js
  } catch (err) {
    // debugger;
    // console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //-->Get search query
    const query = searchView.getQuery();
    if (!query) return; //GUARD clause if no query typed

    //-->Start loading spinner inside the recipeContainer
    resultsView.renderSpinner();

    //-->Load search results
    await model.loadSearchResults(query); //wait for promise to be returned

    //-->Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results); //We render all pages at the moment
    resultsView.render(model.getSearchResultsPage()); //We render a page at the moment

    //-->Render the initial pagination buttons
    // console.log(model.state.search);
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err}🎈`);
  }
};

const controlPagination = function (goToPage) {
  // console.log('Pag Controller');
  // console.log(goToPage);
  //-->Render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); //We render a page at the moment

  //-->Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //->Update the recipe servings in the model state
  model.updateServings(newServings);
  //->Update the recipe view
  // //#1 BRUTEFORCE RENDER - We simply override the old recipe view by re-rendering it with the mutated values, however it creates unwanted image splashes while loading
  // recipeView.render(model.state.recipe);
  //#2 PARTIAL/SELECTIVE RENDER - Only changed items gets rendered
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // model.addBookmark(model.state.recipe);
  // console.log('🎃new bookmark:', model.state.recipe);
  // console.log('🎆', model.state.recipe.bookmarked);
  //-->Cycle thru the item to add or remove bookmark conditions
  //->if the item is not bookmarked, add a bookmark else if the item is bookmarked, remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // // console.log(model.state.recipe.bookmarked);
  // // console.log('bookmark current recipe nominee:', model.state.recipe);
  //-->Update recipe view
  recipeView.update(model.state.recipe); //render selectively only changed items - bookmark in this case
  //-->Render the bookmarks in folding menu (@ the corner of UI)
  bookmarksView.render(model.state.bookmarks);
};

const controlStashedBookmarks = function () {
  //-->Read the locally stashed bookmarks
  const storage = JSON.parse(localStorage.getItem('bookmarks')); //read the local storage
  // console.log(storage);
  if (storage) model.state.bookmarks = storage; //reassign the stored data to state.bookmarks array if there is something in it
  // console.log('bookmark arr', state.bookmarks);
  //-->Render the bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //-->Start loading spinner inside the recipeContainer
    addRecipeView.renderSpinner();

    //-->Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log('🥽', model.state.recipe);

    //-->Render recipe view
    recipeView.render(model.state.recipe);

    //-->Display success message
    addRecipeView.renderMessage(); //by default @view it is this._successMessage , so no input necessary

    //-->Rerender the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //-->Change hashID in the URL to reflect the recently uploaded recipe's hashID after closing the modal window without reloading the page - HISTORY API
    window.history.pushState(null, null, `#${model.state.recipe.id}`); // state,title,url null just iginres the first two parameters, we are interested in url only

    //-->Close submitted form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_WAIT * 1000);
  } catch (err) {
    // console.log('🧨', err);
    addRecipeView.renderError(err.message); //Error message gets rendered in UI
  }
};

//INITIALIZE APP
const init = function () {
  //-->Eventhandler for rendering locallystored bookmarks publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  bookmarksView.addHandlerRender(controlStashedBookmarks);
  //-->Eventhandler for hashchange and page reload events publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  recipeView.addHandlerRender(controlRecipes);
  //-->Eventhandler for search keyword submit event publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  searchView.addHandlerSearch(controlSearchResults);
  //-->Eventhandler for search result pagination btns publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  paginationView.addHandlerClick(controlPagination);
  //-->Eventhandler for updating recipe servings publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  recipeView.addHandlerUpdateServings(controlServings);
  //-->Eventhandler for bookmarking current recipe publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  //-->Eventhandler for submitting a new recipe publisher
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
