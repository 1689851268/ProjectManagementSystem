<template>
    <el-main class="app-main">
        <router-view v-slot="{ Component }">
            <keep-alive :include="cacheComponents" :max="5">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </el-main>
</template>

<script setup lang="ts">
// 缓存组件, 避免重复渲染; 数组元素为组件名
const cacheComponents = ['notification'];
</script>

<style scoped lang="scss">
.app-main {
    width: 100%;
    height: 100%;
    background-color: $content-bg-color;
}
</style>
