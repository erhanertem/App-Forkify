// 'use strict';
//->MVC module imports
import * as model from './model.js';
import recipeView from './views/recipeView.js';
//->Establish links to polifilling libraries
import 'core-js/stable'; //NOTE: polyfill only stable features - ES and web standards:
import 'regenerator-runtime/runtime.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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
    alert(err);
  }
};

//EVENTHANDLER#1: UI LEFT WING - RECIPE LIST SECTION
// //->Scenario #1: In the event of click on the list of recipe with a different hashid that tirgger change on url hash address change of the browser(window)
// window.addEventListener('hashchange', controlRecipes);
// //->Scenario #2: In the event of copy and paste the same url to another browser(window) tab
// window.addEventListener('load', controlRecipes);
//->Condensed version of the above two event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
