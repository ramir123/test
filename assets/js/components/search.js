class HeroSearch {
  constructor() {
    this.input = document.querySelector('[data-hero-search]');
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
        ...filters
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      this.renderResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      this.renderError();
    }
  }

  renderResults(results) {
    this.hideLoading();
    
    if (!results || !results.length) {
      this.resultsContent.innerHTML = `
        <div class="p-4 text-center text-gray-400">
          No results found
        </div>
      `;
      return;
    }

    this.resultsContent.innerHTML = results
      .map(result => this.renderResultItem(result))
      .join('');
  }

  renderResultItem(result) {
    return `
      <a href="${result.url}" class="flex items-center gap-4 p-4 hover:bg-[#2A2D36] transition-colors">
        <div class="w-16 h-16 flex-shrink-0">
          <img src="${result.image}" 
               alt="${result.title}"
               class="w-full h-full object-cover rounded">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-white truncate">${result.title}</h4>
          ${this.renderResultMeta(result)}
        </div>
        <div class="text-right">
          <div class="font-bold text-[#5865F2]">${result.price}</div>
          ${result.compareAtPrice ? `
            <div class="text-sm text-gray-400 line-through">
              ${result.compareAtPrice}
            </div>
          ` : ''}
        </div>
      </a>
    `;
  }

  renderResultMeta(result) {
    const tags = [];
    
    if (result.rank) {
      tags.push(`
        <span class="text-sm px-2 py-0.5 rounded bg-[#5865F2] text-white">
          ${result.rank}
        </span>
      `);
    }

    if (result.server) {
      tags.push(`
        <span class="text-sm text-gray-400">
          ${result.server}
        </span>
      `);
    }

    return tags.length ? `<div class="flex items-center gap-2 mt-1">${tags.join('')}</div>` : '';
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

export default HeroSearch;