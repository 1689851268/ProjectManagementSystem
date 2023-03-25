<template>
    <el-scrollbar ref="scrollbar" v-loading="isLoading">
        <ul>
            <li>基本信息</li>
            <li>项目附件</li>
            <li>项目成员</li>
            <li>项目奖项</li>
        </ul>
        <!-- 招募中、申请中的项目, 仅展示基本信息、项目附件 -->
        <!-- 进行中的项目, 展示基本信息、项目附件、项目成员 -->
        <!-- 已完成的项目, 展示基本信息、项目附件、项目成员、项目奖项 -->
    </el-scrollbar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from '@/utils/axios';
import useLoading from '@/hooks/useLoading';

// 获取路由参数
const { params } = useRoute();
console.log('params', params);
const getProjectDetail = async () => {};

// loading 状态, 开始 / 结束 loading
const { isLoading, startLoading, stopLoading } = useLoading();
</script>

<style scoped lang="scss"></style>
