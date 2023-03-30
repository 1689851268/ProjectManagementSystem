import { useRouter } from 'vue-router';

interface MenuList {
    menuList: { name: string; icon: string; hidden: boolean; auth: number[] }[];
    defaultMenu: string;
}

/**
 * @desc 获取菜单列表 & 默认选中的菜单
 * @returns {Object} 菜单列表 & 默认选中的菜单
 */
const useMenuList = (): MenuList => {
    // 获取路由实例
    const router = useRouter();
    // 获取路由配置
    const routes = router.options.routes;
    // 获取菜单列表
    const menuList =
        routes
            .filter((item) => item.name === 'Home')[0]
            .children?.map((menu) => {
                return {
                    name: (menu.name as string) || '',
                    icon: (menu.meta?.icon as string) || '',
                    hidden: (menu.meta?.hidden as boolean) || false,
                    auth: (menu.meta?.auth as number[]) || [],
                };
            }) || [];

    // 获取当前路由
    const currentRoute = router.currentRoute.value;
    // 默认选中当前路由对应的菜单
    let defaultMenu = (currentRoute.name as string) || '';

    // 如果当前路由是通知详情页，则默认选中通知菜单
    if (defaultMenu === 'NotificationDetail') {
        defaultMenu = 'Notification';
    } else if (defaultMenu === 'ProjectDetail') {
        // 如果当前路由是项目详情页，则默认选中项目菜单
        defaultMenu = 'ProjectHall';
    }

    return {
        menuList,
        defaultMenu,
    };
};

export default useMenuList;
