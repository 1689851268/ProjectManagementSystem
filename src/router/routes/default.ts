import { RouteRecordRaw } from 'vue-router';

/**
 * 路由配置, 侧边栏会根据以下配置进行渲染
 * @desc name 路由名称, 用于渲染菜单栏的名称
 * @desc meta.icon 用于渲染菜单栏的图标, 隐藏的菜单栏不需要配置
 * @desc meta.hidden 是否在菜单栏中隐藏, 默认为 false
 */
export const defaultRoutes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/index.vue'),
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
                path: '/my-project',
                name: 'MyProject', // 我的项目
                component: () => import('@/views/myProject/myProject.vue'),
                meta: {
                    icon: 'Notebook',
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
                path: '/involved-project',
                name: 'InvolvedProject', // 项目参与
                component: () =>
                    import('@/views/involvedProject/involvedProject.vue'),
                meta: {
                    icon: 'Document',
                    auth: [1],
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
                path: '/personal-center',
                name: 'PersonalCenter', // 个人中心
                component: () => import('@/views/personalCenter.vue'),
                meta: {
                    hidden: true,
                    auth: [1, 2, 3, 4],
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
