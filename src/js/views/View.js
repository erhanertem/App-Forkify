//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg'; //NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.

//Note: we directly export instead of making an instance copy then exporting that. Because this is commonly shared by both recipeView and searchView classes
export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); //GUARD clause if render() receives no data/null/undefined || an empty array
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

  //-->Selective rendering algorithm
  update(data) {
    this._data = data; //We assign data for the whole view object

    //-->#1
    //-->Attain new markup with dynamic updates
    const newMarkup = this._generateMarkup(); //We assign the new HTML markup to a variable. It is not yet displayed in the UI or exists in the current HTML markup.
    // console.log(typeof newMarkup); //string type

    //-->Create a virtual DOM from this markup
    const newDOM = document.createRange().createContextualFragment(newMarkup); //Note: We make a virtual DOM copy of the new markup. newMarkup is a string. We have to turn into a nodelist that we can make a comparison with.
    // console.log(typeof newDOM); //object type - DOM object - like a virtual html file in the memory
    //HTML DOM API createRange() creates a new range object for fortcoming methods to be active within
    //createContextualFragment() returns the HTML markup fragment within the created range
    //-->Put all the virtualDOM items on a nodelist and change it to array for comparison
    const newElements = Array.from(newDOM.querySelectorAll('*')); //Select all the elements of this virtual DOM object - Returns a nodelist then from which we change it to real array via Array.from()
    // console.log('virtual DOM elements', newElements);

    //-->#2
    //-->Put all the existingDOM items on a nodelist and change it to array for comparison
    const currElements = Array.from(this._parentElement.querySelectorAll('*')); //Select all the elements of the existing DOM parent element then which we change it to real array via Array.from()
    // console.log('current DOM elements', currElements);
    // console.log('virtual DOM elements', newElements);

    //-->#3
    //-->Compare virtualDOM to existingDOM for any differences and update existingDOM when necessary
    newElements.forEach((newEl, index) => {
      const curEl = currElements[index]; //Get the exisitng DOM element @ the the same index
      // console.log(curEl, newEl.isEqualNode(curEl));
      //->Update Changed Text Only
      if (
        !newEl.isEqualNode(curEl) && //if virtual node is not equal to existing node
        newEl.firstChild?.nodeValue.trim() !== '' //if the first node of the virtual DOM element's trimmed nodeValue is not an empty string
      ) {
        // console.log('🎗', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //->Update Changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes); //Returns a nodemap of all attributes bound to an element which entails Array.from() to turn into an array.
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) //Sets or changes an attribute's name and value simultaneously.
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
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
    this._clear();
    //Insert the HTML markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
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
                <use href="${icons}#icon-smile"></use>
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
