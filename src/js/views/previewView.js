//Important! previewView is the common child file of both bookmarksView and resultsView
//Note: It includes the repititive code that is common to both bookmarksView and resultsView

import View from './View.js';
//->Establish link between icons and parcel
import icons from 'url:../../img/icons.svg'; //NOTE: Parcel 2 requires url: for static items such as links to img and videos, etc.

class PreviewView extends View {
  // _parentElement = document.querySelector('.bookmarks__list');

  _generateMarkup(result) {
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
                <div class="recipe__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                 <svg>
                   <use href="${icons}#icon-user"></use>
                 </svg>
                </div>
              </div>
            </a>
          </li>
          `;
  }
}

export default new PreviewView();
