import { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login',
    },
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export function setupRouter(app: App<Element>) {
    app.use(router);
}
