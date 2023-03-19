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
                :default-active="defaultMenu"
                :router="true"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
            >
                <el-menu-item
                    v-for="{ name, icon } in menuList"
                    :key="name"
                    :index="name"
                    :route="{ name }"
                >
                    <el-icon> <component :is="icon" /> </el-icon>
                    <template #title>{{ $t(name as string) }}</template>
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store/app';
import useMenuList from '@/hooks/useMenuList';

const appStore = useAppStore();
const { getMenuCollapsed } = storeToRefs(appStore);

// 菜单列表 & 默认选中的菜单
const { menuList, defaultMenu } = useMenuList();

// 选中菜单时触发
const handleSelect = (
    key: string,
    keyPath: string[],
    item: { index: string; indexPath: string[]; route: { name: string } },
) => {
    console.log({ key, keyPath, item });
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
