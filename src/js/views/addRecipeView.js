import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _openModalBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super(); //for view extends as a standard practice or we couldnt get this for the latter
    //-->Eventhandler for opening add-recipe modal
    this._addHandlerShowModal(); //auto-execute immediately
    //-->Eventhandler for closing add-recipe modal
    this._addHandlerHideModal(); //auto-execute immediately
    // //-->Eventhandler for submitting @ add-recipe modal
    // this.addHandlerUpload(); //auto-execute immediately
  }

  toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }

  _addHandlerShowModal() {
    this._openModalBtn.addEventListener('click', this.toggleWindow.bind(this));
    //VERY IMPORTANT! bind(this) points to this: AddRecipeView object for this function to work otherwise this._overlay... etc would be referring to this: _openModaBtn object.
  }

  _addHandlerHideModal() {
    //-->Close upon clicking close btn
    this._closeModalBtn.addEventListener('click', this.toggleWindow.bind(this));
    //-->Close upon clicking overlay
    this._overlayElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
    //VERY IMPORTANT! bind(this) points to this: AddRecipeView object for this function to work otherwise this._overlay... etc would be referring to this: _openModaBtn object.
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault(); //Prevent auto submit behavior
      // console.log('🎈', this); //this is the whole form element marked with class 'upload' as in the _parentElement selection
      const dataArr = [...new FormData(this)]; //NOTE: FormData API easily constructs a set of key/value pairs representing form fields and their values, which can then be easily sent using the fetch() API. We have to SPREAD it and then turn into mapped array before we can log it.
      // console.log(dataArr);
      const data = Object.fromEntries(dataArr); //Note: This crreates an object from key/value pairs map

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
