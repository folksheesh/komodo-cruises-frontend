import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Results from './views/Results.vue';
import PaymentSuccess from './views/PaymentSuccess.vue';
import PaymentFailed from './views/PaymentFailed.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/results', component: Results },
    { path: '/payment-success', component: PaymentSuccess },
    { path: '/payment-failed', component: PaymentFailed },
  ],
});
