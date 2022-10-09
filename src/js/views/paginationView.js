import View from './View.js';
//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg';

//-->PAGINATION BUTTONS
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = this._data.paginationPageState;
    const prevButton = `
        <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
            <span>Page ${currPage - 1}</span>
        </button>
        `;
    const nextButton = `
        <button class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //->Page 1, there are other pages
    if (currPage === 1 && numPages > 1) {
      // return 'page 1, others';
      return `${nextButton}`;
    }
    //->Last page
    if (currPage === numPages && numPages > 1) {
      // return 'last page';
      return `${prevButton}`;
    }
    //->Other page
    if (currPage < numPages) {
      // return 'other pages';
      return `${prevButton}${nextButton}`;
    }
    //->Page1, there are other pages
    // return 'only 1 page';
    return '';
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      console.log(btn);
      handler();
    });
  }
}

export default new PaginationView();
