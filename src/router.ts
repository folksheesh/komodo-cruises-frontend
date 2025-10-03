import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Results from './views/Results.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/results', component: Results },
  ],
});
