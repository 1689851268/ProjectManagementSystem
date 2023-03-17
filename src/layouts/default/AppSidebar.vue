<template>
    <el-aside class="app-side" :class="{ 'w-60': getMenuCollapsed }">
        <el-scrollbar>
            <!-- 标题 -->
            <div class="app-title" v-show="!getMenuCollapsed">
                {{ $t('Project Management') }}
            </div>
            <!-- 菜单 -->
            <el-menu
                class="app-menu"
                :collapse-transition="false"
                :collapse="getMenuCollapsed"
                :default-active="'1'"
                :router="true"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
            >
                <el-menu-item
                    v-for="(menu, i) in menuList"
                    :index="`${i + 1}`"
                    :route="{ name: menu.name }"
                >
                    <el-icon> <component :is="menu.meta?.icon" /> </el-icon>
                    <template #title>{{ $t(menu.name as string) }}</template>
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const router = useRouter();

const routes = router.options.routes; // 路由配置
const menuList = routes.filter((item) => item.name === 'Home')[0].children; // 菜单列表

const { getMenuCollapsed } = storeToRefs(appStore);

const handleSelect = (
    key: string,
    keyPath: string[],
    item: { index: string; indexPath: string[]; route: { name: string } },
) => {
    console.log(key, keyPath, item);
};
</script>

<style scoped lang="scss">
$sidebar-width: 300px;

.app-side {
    background-color: $sidebar-bg-color;
    transition: width 0.3s;
    position: relative;

    .app-title {
        color: #fff;
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        height: $header-height;
        line-height: $header-height + 3px; // 为了视觉上居中 + 3px
        width: $sidebar-width;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
    }
}

.app-menu {
    border-right: none;
    margin-top: $header-height;
}
</style>
