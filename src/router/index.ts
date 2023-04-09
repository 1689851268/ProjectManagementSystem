import { useUserStore } from '@/store/modules/user';
import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { defaultRoutes } from './routes/default';

// 总 routes
const routes = [...defaultRoutes];

// 创建 router
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局前置守卫
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

    // 返回 false 以取消导航
    return true;
});

// 用于注册 router
export function setupRouter(app: App<Element>) {
    app.use(router);
}
