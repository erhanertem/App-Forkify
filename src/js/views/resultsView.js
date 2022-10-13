import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _successMessage = ''; //add a custom success message relevant to UI
  _errorMessage = 'No recipe matching your query. Please try again.'; //add a custom default error message relevant to UI

  _generateMarkup() {
    // console.log('_data', this._data);
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1); //read the id from the browser address bar excluding #
    //result is the array item pertinent to _data thats being mapped
    // console.log('result', result);
    // console.log('id', id);

    return `
          <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : '' //while each _data array item (result) is being mapped  we check if the id we clicked (id) matches the result. If it matches apart from the rest it receives thsi extra class which highlightes it
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
            </a>
          </li>
          `;
  }
}

export default new ResultsView();
