'use strict';

import 'core-js/stable'; //NOTE: polyfill only stable features - ES and web standards:
import 'regenerator-runtime/runtime.js';

//->Establish link between icons and parcel
import icons from 'url:../img/icons.svg';
//NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <svg>
      <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  //Clear the entire container element
  parentEl.innerHTML = '';
  //Insert the HTML markup
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    //-->Strip out the id from the clicked result with #href for EVENTHANDLER#1
    const id = window.location.hash.slice(1); //Gets rid of the # and attains the remainder id value
    // console.log(id);
    if (!id) return; //GUARD clause if page initiates with no recipe id

    //-->Start loading spinner inside the recipeContainer
    renderSpinner(recipeContainer);
    //-->Fetching recipe data
    const response = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await response.json();
    //->Serverside fetch err check
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    console.log(response, data, data.data);
    //->Lets create our own version of the recipe to be used in the app
    // let recipe = data.data.recipe;
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    //-->Rendering recipe data
    //->Prep the HTML markup for the recipe data
    const markup = `
        <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${recipe.ingredients
            .map(ingredient => {
              return ` 
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ingredient.quantity ? ingredient.quantity : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${
                  ingredient.unit ? ingredient.unit : ''
                }</span>
                ${ingredient.description ? ingredient.description : ''}
              </div>
            </li>
            `;
            })
            .join('')}

            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">0.5</div>
              <div class="recipe__description">
                <span class="recipe__unit">cup</span>
                ricotta cheese
              </div>
            </li>
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
  `;
    //->Empty the container before we insert the recipe
    recipeContainer.innerHTML = '';
    //->Insert the recipe HTML markup as a first child of the container
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    alert(err);
  }
};

//EVENTHANDLER#1: UI LEFT WING - RECIPE LIST SECTION
// //->Scenario #1: In the event of click on the list of recipe with a different hashid that tirgger change on url hash address change of the browser(window)
// window.addEventListener('hashchange', showRecipe);
// //->Scenario #2: In the event of copy and paste the same url to another browser(window) tab
// window.addEventListener('load', showRecipe);
//->Condensed version of the above two event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, showRecipe));
