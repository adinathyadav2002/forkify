import View from './View.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  renderBookmarks(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>
        No bookmarks yet. Find a nice recipe and bookmark it :)
      </p>
    </div>
    `;
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    let markup = '';
    this._data.forEach(
      item =>
        (markup += `
    <li class="preview">
        <a class="preview__link" href="#${item.id}">
            <figure class="preview__fig">
                <img src="${item.image}" alt="${item.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__name">
                ${item.title}
                </h4>
                <p class="preview__publisher">${item.publisher}</p>
            </div>
        </a>
    </li>
    `)
    );
    return markup;
  }

  addHandlerLocalStorage(loadData, storeData) {
    window.addEventListener('load', () => {
      const data = loadData();
      this.renderBookmarks(data);
      return;
    });
    window.addEventListener('beforeunload', storeData);
  }
}

export default new BookmarksView();
