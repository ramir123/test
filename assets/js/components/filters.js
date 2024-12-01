class HeroFilters {
  constructor() {
    this.dropdowns = document.querySelectorAll('[data-filter-dropdown]');
    this.initialize();
  }

  initialize() {
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const content = dropdown.querySelector('[data-dropdown-content]');
      const options = dropdown.querySelectorAll('[data-filter-option]');
      
      // Toggle dropdown
      trigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown(dropdown);
      });

      // Handle option selection
      options.forEach(option => {
        option.addEventListener('click', () => {
          this.selectOption(dropdown, option);
          this.closeDropdown(dropdown);
          this.notifyChange(dropdown);
        });
      });

      // Price range specific handling
      if (dropdown.dataset.filterType === 'price') {
        this.initializePriceRange(dropdown);
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      this.dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
    });
  }

  toggleDropdown(dropdown) {
    const content = dropdown.querySelector('[data-dropdown-content]');
    const arrow = dropdown.querySelector('[data-dropdown-arrow]');
    const isOpen = !content.classList.contains('hidden');

    // Close other dropdowns
    this.dropdowns.forEach(other => {
      if (other !== dropdown) {
        this.closeDropdown(other);
      }
    });

    if (isOpen) {
      this.closeDropdown(dropdown);
    } else {
      content.classList.remove('hidden');
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  }

  closeDropdown(dropdown) {
    const content = dropdown.querySelector('[data-dropdown-content]');
    const arrow = dropdown.querySelector('[data-dropdown-arrow]');
    
    content?.classList.add('hidden');
    if (arrow) arrow.style.transform = '';
  }

  selectOption(dropdown, option) {
    const options = dropdown.querySelectorAll('[data-filter-option]');
    const trigger = dropdown.querySelector('[data-dropdown-trigger] span');
    
    options.forEach(opt => opt.classList.remove('text-[#5865F2]'));
    option.classList.add('text-[#5865F2]');

    if (trigger) {
      trigger.textContent = option.textContent.trim();
      trigger.classList.remove('text-gray-400');
      trigger.classList.add('text-white');
    }
  }

  initializePriceRange(dropdown) {
    const min = dropdown.querySelector('[data-price-min]');
    const max = dropdown.querySelector('[data-price-max]');
    const slider = dropdown.querySelector('[data-price-slider]');

    if (!min || !max || !slider) return;

    const updateInputs = (value) => {
      min.value = Math.floor(value * 0.7);
      max.value = value;
    };

    slider.addEventListener('input', (e) => {
      updateInputs(e.target.value);
      this.notifyPriceChange(dropdown);
    });

    min.addEventListener('change', () => this.handlePriceInputChange(dropdown, min, max));
    max.addEventListener('change', () => this.handlePriceInputChange(dropdown, min, max));
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
    const event = new CustomEvent('filter:change', {
      detail: {
        type: dropdown.dataset.filterType,
        value: this.getFilterValue(dropdown)
      },
      bubbles: true
    });
    dropdown.dispatchEvent(event);
  }

  notifyPriceChange(dropdown) {
    const min = dropdown.querySelector('[data-price-min]');
    const max = dropdown.querySelector('[data-price-max]');
    
    const event = new CustomEvent('filter:change', {
      detail: {
        type: 'price',
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
    if (dropdown.dataset.filterType === 'price') {
      const min = dropdown.querySelector('[data-price-min]');
      const max = dropdown.querySelector('[data-price-max]');
      return {
        min: parseInt(min.value) || 0,
        max: parseInt(max.value) || parseInt(max.dataset.max)
      };
    }
    
    const selected = dropdown.querySelector('[data-filter-option].text-[#5865F2]');
    return selected?.dataset.value;
  }
}

export default HeroFilters;