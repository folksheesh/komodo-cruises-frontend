<template>
  <div>
  <header :class="['nav-container', { 'nav-overlay': $route.path === '/', 'home-nav': $route.path === '/' }]">
      <nav class="nav-inner" v-if="$route.meta.planHeader">
        <div style="display:flex; align-items:center; gap:.75rem; color: var(--ocean-900)">
          <div class="brand">Plan your trip</div>
        </div>
        <router-link class="link-close" to="/">Close ✕</router-link>
      </nav>
      <nav class="nav-inner" v-else-if="$route.path === '/results'">
        <div class="nav-left">
          <span class="brand-text">Komodo Cruises</span>
        </div>
        <div class="nav-right">
          <router-link to="/" class="back-link">‹ Back to komodocruises.com</router-link>
        </div>
      </nav>
      <nav class="nav-inner" v-else>
        <div class="nav-left">
          <span class="brand-chip">Komodo Cruises</span>
        </div>
        <div class="nav-right">
          <router-link v-if="$route.path !== '/'" to="/plan" class="btn-plan">Plan your trip</router-link>
          <span class="nav-search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="vertical-align:middle;margin-right:4px"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/><line x1="15.2" y1="15.2" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>
            <span class="nav-label">Search</span>
          </span>
          <span class="nav-menu">
            <span class="nav-label">Menu</span>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" style="vertical-align:middle;margin-left:6px"><rect y="6" width="28" height="3" rx="1.5"/><rect y="13" width="28" height="3" rx="1.5"/><rect y="20" width="28" height="3" rx="1.5"/></svg>
          </span>
        </div>
      </nav>
    </header>
    <router-view />
  <footer v-if="!$route.meta.planHeader && $route.path !== '/'" class="site-footer mt-16">
      <div class="footer-inner container text-sm">© {{ new Date().getFullYear() }} Komodo Cruises</div>
    </footer>
  </div>
  
</template>
