//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg'; //NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.

//Note: we directly export instead of making an instance copy then exporting that. Because this is commonly shared by both recipeView and searchView classes
export default class View {
  _data;

  render(data) {
    //Assign data input to object field as private
    this._data = data;
    //Note: we take the data out as a private field then which generateMarkup could refer to in his HTML markup
    const markup = this._generateMarkup();
    // console.log(markup);
    ///Empty the container before we insert the recipe
    this._clear();
    //Insert the recipe HTML markup as a first child of the container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    //Prep the HTML markup for the spinner
    const markup = `
    <div class="spinner">
      <svg>
      <use href="${icons}_icon-loader"></use>
      </svg>
    </div>
  `;
    //Clear the entire container element
    this._clear();
    //Insert the HTML markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
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
    this._clear();
    //Insert the HTML markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
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
    this._clear();
    //Insert the HTML markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
