<template>
    <!-- 查询组件 -->
    <NotificationQuery :queryCondition="queryCondition" />

    <!-- 通知展示组件 -->
    <NotificationList />
</template>

<script setup lang="ts">
import NotificationQuery from './FormQuery.vue';
import NotificationList from './NotificationList.vue';

// 查询条件
const queryCondition = { title: '' };
</script>

<style scoped lang="scss"></style>
