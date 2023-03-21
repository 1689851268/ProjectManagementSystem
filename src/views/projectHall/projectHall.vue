<template>
    <div class="notification">
        <!-- 查询组件 -->
        <NotificationQuery
            :configurations="configurations"
            @setCurPage="setCurPage"
            @setQueryCondition="setQueryCondition"
            @resetQueryCondition="resetQueryCondition"
        />

        <!-- 通知展示组件 -->
        <el-scrollbar ref="scrollbar" v-loading="isLoading">
            <ProjectList
                :class="{ 'h-full': total === 0 }"
                :projectList="projectList"
                :isLoading="isLoading"
                :total="total"
                :pageSizes="pageSizes"
                v-model:curPage="curPage"
                v-model:pageSize="pageSize"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, unref } from 'vue';
import type { Ref } from 'vue';

import NotificationQuery from '@/components/FormQuery.vue';
import ProjectList from '@/views/projectHall/ProjectList.vue';
import { Project } from '@/views/projectHall/interfaces';
import { Configuration } from '@/common/interfaces';

import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';
import axios from '@/utils/axios';

/**
 * @desc 使元素滚回到顶部
 * @param el 元素
 */
const scrollToTop = (
    el: HTMLElement | undefined | Ref<HTMLElement | undefined>,
) => {
    unref(el)?.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const projectList = ref<Array<Project>>([]); // 项目列表

// 每页显示的条数
const limit = 10;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// 查询表单的配置项
const configurations: Configuration[] = [
    { name: 'projectName', defaultVal: '', type: 'input' }, // 项目名称
    { name: 'college', defaultVal: '', type: 'input' }, // 所属院校
    { name: 'teacher', defaultVal: '', type: 'input' }, // 指导老师
    {
        name: 'projectType', // 项目类型
        defaultVal: '',
        type: 'select',
        options: [
            { label: '理工类', value: '1' },
            { label: '文学类', value: '2' },
        ],
    },
    {
        name: 'projectStatus', // 项目状态
        defaultVal: '',
        type: 'select',
        options: [
            { label: '招募中', value: '1' },
            { label: '进行中', value: '2' },
            { label: '已完成', value: '3' },
        ],
    },
];
// 获取查询表单的数据及其操作方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(configurations);

// loading 及其相关方法
const { isLoading, startLoading, stopLoading } = useLoading();

// 获取项目列表及其总数
const getProjectList = async () => {
    const result: any = await new Promise((resolve) =>
        setTimeout(async () => {
            const res = await axios.get('/project', {
                params: {
                    curPage: curPage.value,
                    pageSize: pageSize.value,
                    projectName: queryCondition.value.projectName,
                    teacher: queryCondition.value.teacher,
                    college: queryCondition.value.college,
                    projectType: queryCondition.value.projectType,
                    projectStatus: queryCondition.value.projectStatus,
                },
            });
            resolve(res);
        }, 1000),
    );
    return {
        data: result.data,
        total: result.total as number,
    };
};

// 监听 curPage, pageSize, queryCondition 的变化, 发送请求获取通知列表
watch(
    [curPage, pageSize, queryCondition],
    async () => {
        startLoading();
        scrollToTop(scrollbar); // 使用 el-scrollbar 滚回到顶部
        const { data: realProjectList, total: realTotal } =
            await getProjectList();
        console.log('realProjectList', realProjectList);
        setTotal(realTotal); // 设置通知总数
        projectList.value = realProjectList; // 设置通知列表
        stopLoading();
    },
    { immediate: true },
);
</script>

<style lang="scss" scoped>
.notification {
    display: flex;
    flex-direction: column;
    height: 100%;

    // 重置 el-scrollbar 样式
    :deep(.el-scrollbar__view) {
        height: 100%;
    }
}
</style>
