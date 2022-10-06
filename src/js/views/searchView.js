class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    // return this.#parentEl.querySelector('.searc__field').value;
    return this.#parentEl.querySelector('.search__field').value;
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); //prevent default page reloading with 'submit'
      handler();
    });
    //IMPORTANT! we use submit here so that whether we hit enter or click btn the data will be processed. Click only respinds to btn not enter!!!
  }
}

export default new SearchView();
