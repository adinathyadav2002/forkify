import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const pages = Math.round(this._data.data.length / 10);
    let markup = '';
    if (this._data.page > 1) {
      markup += `
        <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
        </button>
        `;
    }
    if (this._data.page <= pages) {
      markup += `
        <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    return markup;
  }

  addHandlerPages(nextPage, previousPage, controlSearchRecipes) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      if (btn?.classList.contains('pagination__btn--next')) nextPage();
      if (btn?.classList.contains('pagination__btn--prev')) previousPage();
      controlSearchRecipes();
    });
  }
}

export default new PaginationView();
