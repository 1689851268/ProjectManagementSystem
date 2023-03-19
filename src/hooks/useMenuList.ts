import { RouteRecordName, useRouter } from 'vue-router';

interface MenuList {
    menuList: { name: RouteRecordName; icon: unknown }[];
    defaultMenu: RouteRecordName;
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
                    name: menu.name || '',
                    icon: menu.meta?.icon,
                };
            }) || [];
    // 默认选中第一个菜单
    const defaultMenu = menuList[0]?.name || '';

    return {
        menuList,
        defaultMenu,
    };
};

export default useMenuList;
