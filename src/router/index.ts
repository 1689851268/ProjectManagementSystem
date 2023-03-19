import { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

/**
 * 路由配置, 侧边栏会根据以下配置进行渲染
 * @desc name 路由名称, 用于渲染菜单栏的名称
 * @desc meta.icon 用于渲染菜单栏的图标
 */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/default/index.vue'),
        redirect: { name: 'Notification' },
        children: [
            {
                path: '/notification', // 默认子路由
                name: 'Notification', // 通知公告
                component: () =>
                    import('@/views/notification/notification.vue'),
                meta: {
                    icon: 'Notification',
                },
            },
            {
                path: '/project-hall',
                name: 'Project Hall', // 项目大厅
                component: () => import('@/views/projectHall.vue'),
                meta: {
                    icon: 'DataBoard',
                },
            },
            {
                path: '/my-project',
                name: 'My Project', // 我的项目
                component: () => import('@/views/myProject.vue'),
                meta: {
                    icon: 'Notebook',
                },
            },
            {
                path: '/my-achievement',
                name: 'My Achievement', // 我的成果
                component: () => import('@/views/myAchievement.vue'),
                meta: {
                    icon: 'Document',
                },
            },
        ],
    },
    {
        path: '/login',
        name: 'Login', // 登录
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/:catchAll(.*)', // 捕获所有路由
        redirect: '/login', // 返回登录页
    },
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App<Element>) {
    app.use(router);
}
