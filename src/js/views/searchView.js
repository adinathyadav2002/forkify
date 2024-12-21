import View from './View.js';

class SearchView extends View {
  _searchField = document.querySelector('.search__field');
  _searchElement = document.querySelector('.search');

  getQuery() {
    return this._searchField.value;
  }

  addHandlerSearch(handler) {
    this._searchElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
