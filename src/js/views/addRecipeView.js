import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _openModalBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super(); //for view extends as a standard practice or we couldnt get this for the latter
    this._addHandlerShowModal(); //auto-execute immediately
    this._addHandlerHideModal(); //auto-execute immediately
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

  _generateMarkup() {}
}

export default new AddRecipeView();
