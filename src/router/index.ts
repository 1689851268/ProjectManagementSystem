import { useUserStore } from '@/store/user';
import { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

/**
 * 路由配置, 侧边栏会根据以下配置进行渲染
 * @desc name 路由名称, 用于渲染菜单栏的名称
 * @desc meta.icon 用于渲染菜单栏的图标, 隐藏的菜单栏不需要配置
 * @desc meta.hidden 是否在菜单栏中隐藏, 默认为 false
 */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/default/index.vue'),
        redirect: { name: 'Notification' },
        children: [
            {
                path: '/notification',
                name: 'Notification', // 通知公告
                component: () =>
                    import('@/views/notification/notification.vue'),
                meta: {
                    icon: 'Notification',
                    auth: [1, 2, 3],
                },
            },
            {
                path: '/project-hall',
                name: 'ProjectHall', // 项目大厅
                component: () => import('@/views/projectHall/projectHall.vue'),
                meta: {
                    icon: 'DataBoard',
                    auth: [1, 2, 3],
                },
            },
            {
                path: '/notification-table',
                name: 'NotificationList', // 通知列表
                component: () =>
                    import('@/views/notificationTable/notificationTable.vue'),
                meta: {
                    icon: 'Notification',
                    auth: [2],
                },
            },
            {
                path: '/my-project',
                name: 'MyProject', // 我的项目
                component: () => import('@/views/myProject/myProject.vue'),
                meta: {
                    icon: 'Notebook',
                    auth: [1, 2, 3],
                },
            },
            {
                path: '/my-achievement',
                name: 'MyAchievement', // 我的成果
                component: () => import('@/views/myAchievement.vue'),
                meta: {
                    icon: 'Document',
                    auth: [1, 2],
                },
            },
            {
                path: '/notification-detail/:id',
                name: 'NotificationDetail', // 通知公告详情
                component: () => import('@/views/notificationDetail.vue'),
                meta: {
                    hidden: true,
                    auth: [1, 2, 3],
                },
            },
            {
                path: '/project-detail/:id',
                name: 'ProjectDetail', // 项目详情
                component: () => import('@/views/projectDetail.vue'),
                meta: {
                    hidden: true,
                    auth: [1, 2, 3],
                },
            },
            {
                path: '/user-info',
                name: 'UserInfo', // 用户信息
                component: () => import('@/views/userInfo/userInfo.vue'),
                meta: {
                    icon: 'Document',
                    auth: [4],
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

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, from) => {
    // 监听用户 identity, 控制用户访问权限
    const userStore = useUserStore();
    userStore.$subscribe(
        (_mutation, state) => {
            if (state.identity) {
                const userIdentity = state.identity; // 用户身份
                const routeAuth = to.meta.auth as number[]; // 该路由的权限

                // 如果该路由配置了权限, 且用户没有权限访问该路由, 则去到第一个有权限访问且没有隐藏的路由
                if (routeAuth && !routeAuth.includes(userIdentity)) {
                    // 如果是从其他路由跳转过来的, 则刷新页面
                    if (from.name) {
                        window.location.reload();
                        return;
                    }

                    // 获取第一个有权限访问且没有隐藏的路由
                    const firstRoute = routes[0].children?.find((route) => {
                        const auth = route.meta?.auth as number[];
                        const hidden = route.meta?.hidden;
                        return auth.includes(userIdentity) && !hidden;
                    });
                    if (firstRoute) {
                        console.log('去到第一个有权限访问且没有隐藏的路由');
                        router.push({ name: firstRoute.name as string });
                    }
                }
            }
        },
        { immediate: true },
    );

    // ...
    // 返回 false 以取消导航
    return true;
});

export function setupRouter(app: App<Element>) {
    app.use(router);
}
