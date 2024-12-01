(() => {
  // assets/js/components/search.js
  var HeroSearch = class {
    constructor() {
      this.input = document.querySelector("[data-hero-search]");
      this.resultsContainer = document.querySelector("[data-search-results]");
      this.resultsContent = document.querySelector("[data-search-results-container]");
      this.loadingElement = document.querySelector("[data-search-loading]");
      this.debounceTimeout = null;
      this.currentQuery = "";
      this.currentFilters = {};
      if (this.input) {
        this.input._searchInstance = this;
        this.initialize();
      }
    }
    initialize() {
      this.input.addEventListener("input", () => this.handleInput());
      this.input.addEventListener("focus", () => {
        if (this.input.value.length >= 2) {
          this.showResults();
        }
      });
      document.addEventListener("click", (e) => {
        if (!this.input.contains(e.target) && !this.resultsContainer.contains(e.target)) {
          this.hideResults();
        }
      });
    }
    handleInput() {
      const query = this.input.value.trim();
      if (query === this.currentQuery)
        return;
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
      if (query.length < 2)
        return;
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
        console.error("Search error:", error);
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
      this.resultsContent.innerHTML = results.map((result) => this.renderResultItem(result)).join("");
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
          ` : ""}
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
      return tags.length ? `<div class="flex items-center gap-2 mt-1">${tags.join("")}</div>` : "";
    }
    showResults() {
      this.resultsContainer.classList.remove("hidden");
    }
    hideResults() {
      this.resultsContainer.classList.add("hidden");
    }
    showLoading() {
      if (this.loadingElement) {
        this.loadingElement.classList.remove("hidden");
      }
      if (this.resultsContent) {
        this.resultsContent.classList.add("hidden");
      }
    }
    hideLoading() {
      if (this.loadingElement) {
        this.loadingElement.classList.add("hidden");
      }
      if (this.resultsContent) {
        this.resultsContent.classList.remove("hidden");
      }
    }
    updateFilters(filters) {
      this.currentFilters = filters;
      if (this.currentQuery.length >= 2) {
        this.performSearch(this.currentQuery, filters);
      }
    }
  };
  var search_default = HeroSearch;

  // assets/js/components/filters.js
  var HeroFilters = class {
    constructor() {
      this.dropdowns = document.querySelectorAll("[data-filter-dropdown]");
      this.initialize();
    }
    initialize() {
      this.dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector("[data-dropdown-trigger]");
        const content = dropdown.querySelector("[data-dropdown-content]");
        const options = dropdown.querySelectorAll("[data-filter-option]");
        trigger?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleDropdown(dropdown);
        });
        options.forEach((option) => {
          option.addEventListener("click", () => {
            this.selectOption(dropdown, option);
            this.closeDropdown(dropdown);
            this.notifyChange(dropdown);
          });
        });
        if (dropdown.dataset.filterType === "price") {
          this.initializePriceRange(dropdown);
        }
      });
      document.addEventListener("click", () => {
        this.dropdowns.forEach((dropdown) => this.closeDropdown(dropdown));
      });
    }
    toggleDropdown(dropdown) {
      const content = dropdown.querySelector("[data-dropdown-content]");
      const arrow = dropdown.querySelector("[data-dropdown-arrow]");
      const isOpen = !content.classList.contains("hidden");
      this.dropdowns.forEach((other) => {
        if (other !== dropdown) {
          this.closeDropdown(other);
        }
      });
      if (isOpen) {
        this.closeDropdown(dropdown);
      } else {
        content.classList.remove("hidden");
        if (arrow)
          arrow.style.transform = "rotate(180deg)";
      }
    }
    closeDropdown(dropdown) {
      const content = dropdown.querySelector("[data-dropdown-content]");
      const arrow = dropdown.querySelector("[data-dropdown-arrow]");
      content?.classList.add("hidden");
      if (arrow)
        arrow.style.transform = "";
    }
    selectOption(dropdown, option) {
      const options = dropdown.querySelectorAll("[data-filter-option]");
      const trigger = dropdown.querySelector("[data-dropdown-trigger] span");
      options.forEach((opt) => opt.classList.remove("text-[#5865F2]"));
      option.classList.add("text-[#5865F2]");
      if (trigger) {
        trigger.textContent = option.textContent.trim();
        trigger.classList.remove("text-gray-400");
        trigger.classList.add("text-white");
      }
    }
    initializePriceRange(dropdown) {
      const min = dropdown.querySelector("[data-price-min]");
      const max = dropdown.querySelector("[data-price-max]");
      const slider = dropdown.querySelector("[data-price-slider]");
      if (!min || !max || !slider)
        return;
      const updateInputs = (value) => {
        min.value = Math.floor(value * 0.7);
        max.value = value;
      };
      slider.addEventListener("input", (e) => {
        updateInputs(e.target.value);
        this.notifyPriceChange(dropdown);
      });
      min.addEventListener("change", () => this.handlePriceInputChange(dropdown, min, max));
      max.addEventListener("change", () => this.handlePriceInputChange(dropdown, min, max));
    }
    handlePriceInputChange(dropdown, min, max) {
      const minValue = parseInt(min.value) || 0;
      const maxValue = parseInt(max.value) || parseInt(max.dataset.max);
      if (minValue > maxValue) {
        min.value = maxValue;
      }
      this.notifyPriceChange(dropdown);
    }
    notifyChange(dropdown) {
      const event = new CustomEvent("filter:change", {
        detail: {
          type: dropdown.dataset.filterType,
          value: this.getFilterValue(dropdown)
        },
        bubbles: true
      });
      dropdown.dispatchEvent(event);
    }
    notifyPriceChange(dropdown) {
      const min = dropdown.querySelector("[data-price-min]");
      const max = dropdown.querySelector("[data-price-max]");
      const event = new CustomEvent("filter:change", {
        detail: {
          type: "price",
          value: {
            min: parseInt(min.value) || 0,
            max: parseInt(max.value) || parseInt(max.dataset.max)
          }
        },
        bubbles: true
      });
      dropdown.dispatchEvent(event);
    }
    getFilterValue(dropdown) {
      if (dropdown.dataset.filterType === "price") {
        const min = dropdown.querySelector("[data-price-min]");
        const max = dropdown.querySelector("[data-price-max]");
        return {
          min: parseInt(min.value) || 0,
          max: parseInt(max.value) || parseInt(max.dataset.max)
        };
      }
      const selected = dropdown.querySelector("[data-filter-option].text-[#5865F2]");
      return selected?.dataset.value;
    }
  };
  var filters_default = HeroFilters;

  // assets/js/hero.js
  document.addEventListener("DOMContentLoaded", () => {
    const search = new search_default();
    const filters = new filters_default();
    document.addEventListener("filter:change", (e) => {
      const { type, value } = e.detail;
      if (search) {
        search.updateFilters({ [type]: value });
      }
    });
  });
})();
