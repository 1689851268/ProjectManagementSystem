<template>
    <el-main class="app-main">
        <el-scrollbar> <router-view /> </el-scrollbar>
    </el-main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app-main {
    width: 100%;
    height: 100%;
    background-color: $content-bg-color;
}
</style>
