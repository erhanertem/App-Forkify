// 'use strict'; //NOTE: ES6 modules have implict strict mode, and Babel dicates strict mode by default as well.
//->MVC module imports
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

//->Establish links to polifilling libraries
import 'core-js/stable'; //NOTE: polyfill only stable features - ES and web standards:
// import { async } from 'regenerator-runtime';
// import 'regenerator-runtime/runtime.js';

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

    //-->Load search results
    await model.loadSearchResults(query); //wait for promise to be returned

    //-->Render results
    console.log(model.state.search.results);
  } catch {
    console.error(`${err}🎈`);
  }
};

const init = function () {
  //-->Eventhandler for hashchange and page reload events
  recipeView.addHandlerRender(controlRecipes);
  //-->Eventhandler for search keyword submit event
  searchView.addHandlerSearch(controlSearchResults);
};
init();
