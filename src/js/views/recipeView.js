import View from './View.js';
//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg'; //NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.
//->Establish link to external library
// import Fraction from 'fractional';
// console.log(Fraction); //Fraction includes franction function inside Fraction.
import { Fraction } from 'fractional'; // We take out Fraction inside fraction via destructuring in-place.

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _successMessage = ''; //add a custom success message relevant to UI
  _errorMessage = 'We could not find that recipe. Please try another one!'; //add a custom default error message relevant to UI

  addHandlerRender(handler) {
    //-->Eventhandler for hashchange and page reload event subscriber
    // //->Scenario #1: In the event of click on the list of recipe with a different hashid that tirgger change on url hash address change of the browser(window)
    // window.addEventListener('hashchange', controlRecipes);
    // //->Scenario #2: In the event of copy and paste the same url to another browser(window) tab
    // window.addEventListener('load', controlRecipes);
    //->Combined version of the above two event listeners
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
    //NOTE: We rearrange the code under recipeViewas its UI related and we can still call it from controller as it has link to rcipeView and adobt handler variable so that we can instruct to which callback function it would take account of.
  }

  addHandlerUpdateServings(handler) {
    //-->Eventhandler for updating recipe servings subscriber
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--update-servings');
      if (!btn) return; //Guard Clause to avoid null err if clicked elsewhere other than the intended btns
      // console.log(btn);
      const updateTo = +btn.dataset.updateTo; //we grap data-update-to (dataset.updateTo) , change it to numeric value and input as newServings value to controlServings event handler call-back function @ controller.js
      if (updateTo > 0) handler(updateTo); //Guard clause to avoid below 1 servings
    });
  }

  addHandlerAddBookmark(handler) {
    //-->Eventhandler for bookmarking current recipe subscriber
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--bookmark');
      if (!btn) return; //Guard clause if clicked off the target parent element to avoid null click err
      handler();
    });
  }

  _generateMarkup() {
    //Prep the HTML markup for the recipe data
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
                // > 0
                //           ? this._data.servings - 1
                //           : this._data.servings //Guard clause to avoid below 1 servings
                //Alternate method other than checking in the addHandlerUpdateServings()
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkupIngredient)
            .join('')}       
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
  `;
  }

  _generateMarkupIngredient(ingredient) {
    return ` 
         <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ingredient.quantity
                  ? new Fraction(ingredient.quantity.toFixed(1)).toString()
                  : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${
                  ingredient.unit ? ingredient.unit : ''
                }</span>
                ${ingredient.description ? ingredient.description : ''}
              </div>
         </li>
         `;
  }
}

export default new RecipeView();
//Note: we havent passed in data with the object so we do not need a consgtructor function.
