import { createRouter, createWebHistory } from 'vue-router';
import PersonsView from '../views/PersonsView.vue';
import AuthorsView from '../views/AuthorsView.vue';

const routes = [
  {
    path: '/persons',
    name: 'Persons',
    component: PersonsView,
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
