//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg'; //NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.
//->Establish link to external library
// import Fraction from 'fractional';
// console.log(Fraction); //Fraction includes franction function inside Fraction.
import { Fraction } from 'fractional'; // We take out Fraction inside fraction via destructuring in-place.

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;
  #successMessage = ''; //add a custom success message relevant to UI
  #errorMessage = 'We could not find that recipe. Please try another one!'; //add a custom default error message relevant to UI

  render(data) {
    //Assign data input to object field as private
    this.#data = data;
    //Note: we take the data out as a private field then which generateMarkup could refer to in his HTML markup
    const markup = this.#generateMarkup();
    // console.log(markup);
    ///Empty the container before we insert the recipe
    this.#clear();
    //Insert the recipe HTML markup as a first child of the container
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  addHandlerRender(handler) {
    //-->Eventhandler for hashchange and page reload events
    // //->Scenario #1: In the event of click on the list of recipe with a different hashid that tirgger change on url hash address change of the browser(window)
    // window.addEventListener('hashchange', controlRecipes);
    // //->Scenario #2: In the event of copy and paste the same url to another browser(window) tab
    // window.addEventListener('load', controlRecipes);
    //->Condensed version of the above two event listeners
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));
    //NOTE: We rearrange the code under recipeViewas its UI related and we can still call it from controller as it has link to rcipeView and adobt handler variable so that we can instruct to which callback function it would take account of.
  }

  renderSpinner() {
    //Prep the HTML markup for the spinner
    const markup = `
    <div class="spinner">
      <svg>
      <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    //Clear the entire container element
    this.#clear();
    //Insert the HTML markup
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this.#errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
    `;
    //Clear the entire container element
    this.#clear();
    //Insert the HTML markup
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this.#successMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
    `;
    //Clear the entire container element
    this.#clear();
    //Insert the HTML markup
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #generateMarkup() {
    //Prep the HTML markup for the recipe data
    return `
        <figure class="recipe__fig">
          <img src="${this.#data.image}" alt="${
      this.#data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this.#data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.#data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this.#data.servings
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

          ${this.#data.ingredients
            .map(this.#generateMarkupIngredient)
            .join('')}       
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this.#data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this.#data.sourceUrl}"
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

  #generateMarkupIngredient(ingredient) {
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
export default new RecipeView(); //Note: we havent passed in data with the object so we do not need a consgtructor function.
