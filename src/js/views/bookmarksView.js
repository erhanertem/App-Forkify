import View from './View.js';
import previewView from './previewView.js'; //child of this file shared with resultsview

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _successMessage = ''; //add a custom success message relevant to UI
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.'; //add a custom default error message relevant to UI

  _generateMarkup() {
    // console.log('_data', this._data); //all of the bookmarks returned by the search thru API
    return this._data
      .map(result => previewView._generateMarkup(result))
      .join(''); //We loop thru the search results and generate the HTML markup string
  }
}

export default new BookmarksView();
