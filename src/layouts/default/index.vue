<template>
    <el-container class="h-full">
        <!-- 侧边栏 -->
        <AppSidebar />

        <!-- 内容 -->
        <el-container class="flex-direction-column">
            <AppHeader />
            <AppMain />
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import AppMain from './AppMain.vue';
</script>
