import { createRouter, createWebHistory } from 'vue-router';
import PersonsView from '../views/PersonsView.vue';
import AuthorsView from '../views/AuthorsView.vue';
import BooksView from '../views/BooksView.vue';
import BorrowsView from '../views/BorrowsView.vue';

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
  {
    path: '/books',
    name: 'Books',
    component: BooksView,
  },
  {
    path: '/borrows',
    name: 'Borrows',
    component: BorrowsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
