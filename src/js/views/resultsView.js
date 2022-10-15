import View from './View.js';
import previewView from './previewView.js'; //child of this file shared with bookmarksview

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _successMessage = ''; //add a custom success message relevant to UI
  _errorMessage = 'No recipe matching your query. Please try again.'; //add a custom default error message relevant to UI

  _generateMarkup() {
    // console.log('_data', this._data);
    return this._data
      .map(result => previewView._generateMarkup(result))
      .join('');
  }
}

export default new ResultsView();
