import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LinkedInPage from '../components/LinkedInPage.vue';
import FacebookPage from '../components/FacebookPage.vue';
import ShareOn from '../components/ShareOn.vue';

const routes = [
  { path: '/', component: HomePage }, // Route vers la page d'accueil
  { path: '/shareon', component: ShareOn }, // Route vers la page de partage
  { path: '/linkedin', component: LinkedInPage }, // Route vers LinkedIn
  { path: '/facebook', component: FacebookPage }, // Route vers Facebook
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
