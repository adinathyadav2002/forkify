import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your Query! Please try something else.';

  _generateMarkup() {
    let finalMarkup = '';
    this._data.forEach(item => {
      finalMarkup += `
      <li class="preview">
        <a class="preview__link " href="#${item.id}">
          <figure class="preview__fig">
            <img src="${item.image}" alt="${item.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${item.title}</h4>
            <p class="preview__publisher">${item.publisher}</p>
            
          </div>
        </a>
      </li>
    `;
    });
    return finalMarkup;
  }
}

export default new ResultView();
