<template>
    <el-header class="app-header">
        <!-- 展开 / 关闭 -->
        <div class="header-btn line-height-add-3" @click="toggleCollapsed">
            <el-icon :size="iconSize" v-if="getMenuCollapsed">
                <Expand />
            </el-icon>
            <el-icon :size="iconSize" v-else><Fold /></el-icon>
        </div>
        <div class="float-right">
            <!-- 配置 -->
            <el-dropdown trigger="click">
                <el-icon :size="iconSize" class="header-btn line-height-add-3">
                    <Setting />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>View</el-dropdown-item>
                        <el-dropdown-item>Add</el-dropdown-item>
                        <el-dropdown-item>Delete</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 个人中心 -->
            <span class="header-btn">Tom</span>
        </div>
    </el-header>
</template>

<script setup lang="ts">
import { Setting, Expand, Fold } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();

const { getMenuCollapsed } = storeToRefs(appStore);
const iconSize = 20;

const toggleCollapsed = () => {
    appStore.toggleMenuCollapsed();
};
</script>

<style scoped lang="scss">
.app-header {
    height: $header-height;
    border-bottom: 1px solid #ebeef5;
    padding: 0;
}

.header-btn {
    display: inline-block;
    height: $header-height;
    line-height: $header-height;
    cursor: pointer;
    padding: 0 15px;
    &:hover {
        background-color: #f5f7fa;
    }
}

.line-height-add-3 {
    line-height: $header-height + 3px; // 为了视觉上居中 + 3px
}
</style>
