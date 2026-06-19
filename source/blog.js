/* ===== BLOG INTERACTIVE LOGIC ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Filter Tabs ---- */
  const filterTabs = document.querySelectorAll('.blog-filter-tab');
  const posts = document.querySelectorAll('.blog-post-card');
  const noResults = document.getElementById('blog-no-results');

  function filterPosts(filter) {
    let visible = 0;
    posts.forEach(post => {
      const cat = post.dataset.category || 'all';
      const show = filter === 'all' || cat === filter;
      post.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (noResults) noResults.classList.toggle('d-none', visible > 0);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterPosts(tab.dataset.filter || 'all');
    });
  });

  /* Sidebar category links also trigger filter */
  document.querySelectorAll('.sidebar-cat-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const filter = link.dataset.filter || 'all';
      filterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
      });
      filterPosts(filter);
      document.getElementById('blog-posts-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---- Search ---- */
  const searchInput = document.getElementById('blog-search-input');
  const searchBtn = document.getElementById('blog-search-btn');

  function searchPosts(query) {
    const q = query.trim().toLowerCase();
    let visible = 0;
    posts.forEach(post => {
      const title = post.querySelector('.blog-post-title')?.textContent.toLowerCase() || '';
      const excerpt = post.querySelector('.blog-post-excerpt')?.textContent.toLowerCase() || '';
      const tags = Array.from(post.querySelectorAll('.post-tag')).map(t => t.textContent.toLowerCase()).join(' ');
      const match = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q);
      post.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    // Reset active filter tab to "All"
    filterTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.filter === 'all'));
    if (noResults) noResults.classList.toggle('d-none', visible > 0);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => searchPosts(searchInput?.value || ''));
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchPosts(searchInput.value);
    });
  }

  /* ---- Hero Particle dots ---- */
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement('span');
      dot.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,${(Math.random() * 0.12 + 0.04).toFixed(2)});
        width:${Math.random() * 5 + 2}px;
        height:${Math.random() * 5 + 2}px;
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
        animation: floatParticle ${(Math.random() * 8 + 6).toFixed(1)}s ease-in-out ${(Math.random() * 4).toFixed(1)}s infinite alternate;
      `;
      particleContainer.appendChild(dot);
    }

    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes floatParticle {
          from { transform: translateY(0) translateX(0); opacity: 0.4; }
          to   { transform: translateY(-30px) translateX(15px); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ---- Scroll-reveal for post cards ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  posts.forEach((post, i) => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(24px)';
    post.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    observer.observe(post);
  });

});
