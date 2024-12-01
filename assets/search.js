class AccountSearch {
  constructor() {
    this.input = document.querySelector('[data-search-input]');
    this.resultsContainer = document.querySelector('[data-search-results]');
    this.resultsContent = document.querySelector('[data-search-results-container]');
    this.loadingElement = document.querySelector('[data-search-loading]');
    this.debounceTimeout = null;
    this.currentQuery = '';
    this.currentFilters = {};

    if (this.input) {
      this.input._searchInstance = this;
      this.initialize();
    }
  }

  initialize() {
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('focus', () => {
      if (this.input.value.length >= 2) {
        this.showResults();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.resultsContainer.contains(e.target)) {
        this.hideResults();
      }
    });
  }

  handleInput() {
    const query = this.input.value.trim();
    
    if (query === this.currentQuery) return;
    this.currentQuery = query;

    clearTimeout(this.debounceTimeout);
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }

    this.debounceTimeout = setTimeout(() => {
      this.performSearch(query, this.currentFilters);
    }, 300);
  }

  async performSearch(query, filters = {}) {
    if (query.length < 2) return;
    
    this.showLoading();
    this.showResults();

    try {
      const params = new URLSearchParams({
        q: query,
        type: 'product',
        ...filters
      });

      const response = await fetch(`/search/suggest.json?${params}`);
      const data = await response.json();
      
      this.renderResults(data.resources.results.products);
    } catch (error) {
      console.error('Search error:', error);
      this.renderError();
    }
  }

  renderResults(products) {
    this.hideLoading();
    
    if (!products || !products.length) {
      this.resultsContent.innerHTML = `
        <div class="p-4 text-center text-gray-400">
          No accounts found
        </div>
      `;
      return;
    }

    this.resultsContent.innerHTML = products
      .map(product => this.renderProductCard(product))
      .join('');
  }

  renderProductCard(product) {
    return `
      <a href="${product.url}" class="flex items-center gap-4 p-4 hover:bg-[#2A2D36] transition-colors">
        <div class="w-16 h-16 flex-shrink-0">
          <img src="${product.featured_image.url}" 
               alt="${product.title}"
               class="w-full h-full object-cover rounded">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-white truncate">${product.title}</h4>
          <div class="flex items-center gap-2 mt-1">
            ${this.renderProductTags(product)}
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-[#5865F2]">${product.price}</div>
          ${product.compare_at_price ? `
            <div class="text-sm text-gray-400 line-through">
              ${product.compare_at_price}
            </div>
          ` : ''}
        </div>
      </a>
    `;
  }

  renderProductTags(product) {
    const tags = [];
    
    if (product.metafields?.rank) {
      tags.push(`
        <span class="text-sm px-2 py-0.5 rounded bg-[#5865F2] text-white">
          ${product.metafields.rank}
        </span>
      `);
    }

    if (product.metafields?.server) {
      tags.push(`
        <span class="text-sm text-gray-400">
          ${product.metafields.server}
        </span>
      `);
    }

    return tags.join('');
  }

  showResults() {
    this.resultsContainer.classList.remove('hidden');
  }

  hideResults() {
    this.resultsContainer.classList.add('hidden');
  }

  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.remove('hidden');
    }
    if (this.resultsContent) {
      this.resultsContent.classList.add('hidden');
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.add('hidden');
    }
    if (this.resultsContent) {
      this.resultsContent.classList.remove('hidden');
    }
  }

  updateFilters(filters) {
    this.currentFilters = filters;
    if (this.currentQuery.length >= 2) {
      this.performSearch(this.currentQuery, filters);
    }
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AccountSearch();
});