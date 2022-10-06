class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    // return this.#parentEl.querySelector('.search__field').value;
    const query = this.#parentEl.querySelector('.search__field').value; //Note: Since we are going to clear the search field value, we stash this in a variable which is due to return
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  } //Note: We make it private so its only accesible inside the class

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); //prevent default page reloading with 'submit'
      handler();
    });
    //IMPORTANT! we use submit here so that whether we hit enter or click btn the data will be processed. Click only respinds to btn not enter!!!
  }
}

export default new SearchView();
