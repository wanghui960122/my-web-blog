import { createWebHashHistory, createRouter } from 'vue-router';
import routes from './router';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
