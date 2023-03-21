import { useRouter } from 'vue-router';

interface MenuList {
    menuList: { name: string; icon: string }[];
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
                };
            }) || [];

    // 获取当前路由
    const currentRoute = router.currentRoute.value;
    // 默认选中当前路由对应的菜单
    const defaultMenu = (currentRoute.name as string) || '';

    return {
        menuList,
        defaultMenu,
    };
};

export default useMenuList;
