import Vue from 'vue';
import Router from 'vue-router';
import PersonsView from '../views/PersonsView.vue';
import AuthorsView from '../views/AuthorsView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/persons',
      name: 'persons',
      component: PersonsView,
    },
    {
      path: '/authors',
      name: 'authors',
      component: AuthorsView,
    },
  ],
});
