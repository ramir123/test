class FilterDropdown {
  constructor(element) {
    this.dropdown = element;
    this.trigger = element.querySelector('[data-dropdown-trigger]');
    this.content = element.querySelector('[data-dropdown-content]');
    this.arrow = element.querySelector('[data-dropdown-arrow]');
    this.options = element.querySelectorAll('[data-filter-option]');
    this.type = element.dataset.filterType;
    
    // Price range specific elements
    this.priceMin = element.querySelector('[data-price-min]');
    this.priceMax = element.querySelector('[data-price-max]');
    this.priceSlider = element.querySelector('[data-price-slider]');
    
    this.initialize();
  }

  initialize() {
    // Toggle dropdown on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Handle option selection
    this.options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(option);
        this.close();
        this.notifyChange();
      });
    });

    // Initialize price range if present
    if (this.type === 'price' && this.priceSlider) {
      this.initializePriceRange();
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.close();
      }
    });

    // Prevent dropdown from closing when clicking inside
    this.content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  initializePriceRange() {
    const updatePriceInputs = (value) => {
      this.priceMin.value = Math.floor(value * 0.7);
      this.priceMax.value = value;
    };

    this.priceSlider.addEventListener('input', (e) => {
      updatePriceInputs(e.target.value);
      this.notifyPriceChange();
    });

    this.priceMin.addEventListener('change', () => {
      const min = parseInt(this.priceMin.value) || 0;
      const max = parseInt(this.priceMax.value) || this.priceSlider.max;
      if (min > max) this.priceMin.value = max;
      this.notifyPriceChange();
    });

    this.priceMax.addEventListener('change', () => {
      const min = parseInt(this.priceMin.value) || 0;
      const max = parseInt(this.priceMax.value) || this.priceSlider.max;
      if (max < min) this.priceMax.value = min;
      this.notifyPriceChange();
    });
  }

  toggle() {
    const isHidden = this.content.classList.contains('hidden');
    
    // Close all other dropdowns first
    document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
      if (dropdown !== this.dropdown) {
        const content = dropdown.querySelector('[data-dropdown-content]');
        const arrow = dropdown.querySelector('[data-dropdown-arrow]');
        if (content) content.classList.add('hidden');
        if (arrow) arrow.style.transform = '';
      }
    });

    if (isHidden) {
      this.content.classList.remove('hidden');
      this.arrow.style.transform = 'rotate(180deg)';
    } else {
      this.close();
    }
  }

  close() {
    this.content.classList.add('hidden');
    this.arrow.style.transform = '';
  }

  selectOption(option) {
    // Update visual selection
    this.options.forEach(opt => opt.classList.remove('text-[#5865F2]'));
    option.classList.add('text-[#5865F2]');

    // Update trigger text
    const label = this.trigger.querySelector('span');
    label.textContent = option.textContent.trim();
    label.classList.remove('text-gray-400');
    label.classList.add('text-white');
  }

  notifyChange() {
    const event = new CustomEvent('filter:change', {
      detail: {
        type: this.type,
        value: this.getSelectedValue()
      },
      bubbles: true
    });
    this.dropdown.dispatchEvent(event);
  }

  notifyPriceChange() {
    const event = new CustomEvent('filter:change', {
      detail: {
        type: 'price',
        value: {
          min: parseInt(this.priceMin.value) || 0,
          max: parseInt(this.priceMax.value) || this.priceSlider.max
        }
      },
      bubbles: true
    });
    this.dropdown.dispatchEvent(event);
  }

  getSelectedValue() {
    if (this.type === 'price') {
      return {
        min: parseInt(this.priceMin.value) || 0,
        max: parseInt(this.priceMax.value) || this.priceSlider.max
      };
    }
    const selected = this.dropdown.querySelector('[data-filter-option].text-[#5865F2]');
    return selected ? selected.dataset.optionValue : null;
  }
}

// Initialize all filter dropdowns
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
    new FilterDropdown(dropdown);
  });

  // Listen for filter changes
  document.addEventListener('filter:change', (e) => {
    const { type, value } = e.detail;
    const searchInput = document.querySelector('[data-search-input]');
    
    if (searchInput && searchInput._searchInstance) {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        searchInput._searchInstance.performSearch(query, { [type]: value });
      }
    }
  });
});