import HeroSearch from './components/search';
import HeroFilters from './components/filters';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize hero components
  const search = new HeroSearch();
  const filters = new HeroFilters();

  // Listen for filter changes
  document.addEventListener('filter:change', (e) => {
    const { type, value } = e.detail;
    if (search) {
      search.updateFilters({ [type]: value });
    }
  });
});