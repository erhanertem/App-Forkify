class SearchView {
  _parentElement = document.querySelector('.search');
  _successMessage = ''; //add a custom success message relevant to UI
  _errorMessage = 'We could not find that recipe. Please try another one!'; //add a custom default error message relevant to UI

  getQuery() {
    // return this._parentEl.querySelector('.search__field').value;
    const query = this._parentElement.querySelector('.search__field').value; //Note: Since we are going to clear the search field value, we stash this in a variable which is due to return
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  } //Note: We make it private so its only accesible inside the class

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault(); //prevent default page reloading with 'submit'
      handler();
    });
    //IMPORTANT! we use submit here so that whether we hit enter or click btn the data will be processed. Click only respinds to btn not enter!!!
  }
}

export default new SearchView();
