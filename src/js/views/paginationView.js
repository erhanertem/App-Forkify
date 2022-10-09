import View from './View.js';
//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg';

//-->PAGINATION BUTTONS
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);
    /*
          <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page 1</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page 3</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>

*/
    //->Page 1, there are no other pages
    //->Page1, there are other pages
    //->Last page
    //->Other page
  }
}

export default new PaginationView();
