<template>
    <el-aside class="app-side" :class="{ 'w-60': getMenuCollapsed }">
        <el-scrollbar>
            <div class="app-title" v-show="!getMenuCollapsed">
                {{ $t('Project Management') }}
            </div>
            <el-menu
                class="app-menu"
                :collapse-transition="false"
                :collapse="getMenuCollapsed"
                :default-active="'1'"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
            >
                <el-menu-item index="1">
                    <el-icon><Notification /></el-icon>
                    <template #title>{{ $t('Notification') }}</template>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><DataBoard /></el-icon>
                    <template #title>{{ $t('Project Hall') }}</template>
                </el-menu-item>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><Notebook /></el-icon>
                        <span>{{ $t('My Project') }}</span>
                    </template>
                    <el-menu-item index="3-1"> Option 1 </el-menu-item>
                    <el-menu-item index="3-2"> Option 2 </el-menu-item>
                    <el-menu-item index="3-3"> Option 3 </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon><Document /></el-icon>
                        <span>{{ $t('My Achievement') }}</span>
                    </template>
                    <el-menu-item index="4-1"> Option 1 </el-menu-item>
                    <el-menu-item index="4-2"> Option 2 </el-menu-item>
                    <el-menu-item index="4-3">
                        <LanguageConfig />
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script setup lang="ts">
import {
    DataBoard,
    Notification,
    Notebook,
    Document,
} from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store/app';
import LanguageConfig from '@/components/LanguageConfig.vue';

const appStore = useAppStore();

const { getMenuCollapsed } = storeToRefs(appStore);

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
</script>

<style scoped lang="scss">
$sidebar-width: 300px;

.app-side {
    background-color: $theme-bg-color;
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
