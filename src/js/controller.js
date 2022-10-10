// 'use strict'; //NOTE: ES6 modules have implict strict mode, and Babel dicates strict mode by default as well.
//->MVC module imports
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

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

    //-->Load recipe data
    await model.loadRecipe(id);
    //Note: loadREcipe is an async function and would return a promise so we have to wait for it

    //-->Render recipe data
    recipeView.render(model.state.recipe);
    // console.log('render: ', model.state.recipe);
    // const recipeView = new RecipeView(model.state.recipe);
    //Note: we could have recipeView.js export the object and we call create an instance of it here but we have chosen to create an instance of the object in recipeView.js, REcipeview object remained private and we just call it from here with its data input from model.js
  } catch (err) {
    // console.error(`${err}🎈`);
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
  //->Update the recipe view - we simply override the old recipe view by rerendering it with the mutated values
  recipeView.render(model.state.recipe);
};

//INITIALIZE APP
const init = function () {
  //-->Eventhandler for hashchange and page reload events
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  recipeView.addHandlerRender(controlRecipes);
  //-->Eventhandler for search keyword submit event
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  searchView.addHandlerSearch(controlSearchResults);
  //-->Eventhandler for search result pagination btns
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  paginationView.addHandlerClick(controlPagination);
  //-->Eventhandler for updating recipe servings
  //Note: Publisher/subscriber pattern: DOM selection and event handler types remain in the views section
  recipeView.addHandlerUpdateServings(controlServings);
};
init();
