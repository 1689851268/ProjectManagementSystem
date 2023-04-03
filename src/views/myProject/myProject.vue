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
                :limit="limit"
                :pageSizes="pageSizes"
                :total="total"
                :projectStatuses="projectHallMetaData.projectStatuses"
                :projectList="projectList"
                v-model:curPage="curPage"
                v-model:pageSize="pageSize"
                @initProjectHall="initProjectHall"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import NotificationQuery from '@/components/FormQuery.vue';
import ProjectList from '@/views/myProject/components/ProjectList.vue';

import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';
import useConfiguration from '@/views/projectHall/utils/useConfiguration';
import useProjectHallMetaData from '@/views/projectHall/utils/useProjectHallMetaData';

import ajax from '@/utils/ajax.js';
import { Project, rawProject } from '@/views/projectHall/utils/interfaces';
import { useMetaDataStore } from '@/store/metaData';
import { scrollToTop } from '@/utils/domHandler';
import { useUserStore } from '@/store/user';

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const projectList = ref<Array<Project>>([]); // 项目列表

// 获取查询表单的配置项
const { configurations, initConfigurations } = useConfiguration();

// 获取 projectHall 所需的元数据
const { projectHallMetaData, initProjectHallMetaData } =
    useProjectHallMetaData();

// 获取元数据, 初始化查询表单的配置项
const metaDataStore = useMetaDataStore();
// 订阅 projectTypes, projectStatuses 的变化, 初始化 configurations 和 projectHallMetaData
metaDataStore.$subscribe(
    (_, state) => {
        const { projectTypes, projectStatuses } = state;
        initConfigurations(projectTypes, projectStatuses);
        initProjectHallMetaData(projectTypes, projectStatuses);
    },
    { immediate: true },
);

// 每页显示的条数
const limit = 10;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// 获取查询表单的数据及其操作方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(configurations.value);

// loading 及其相关方法
const { isLoading, startLoading, stopLoading } = useLoading();

// 获取项目列表及其总数
const getProjectList = async () => {
    const userStore = useUserStore();

    await new Promise((resolve) => setTimeout(resolve, 500));
    // 发送请求, 获取数据
    const res: any = await ajax
        .get(`/project/${userStore.getId}/${userStore.getIdentity}`, {
            params: {
                curPage: curPage.value,
                pageSize: pageSize.value,
                projectName: queryCondition.value.projectName,
                teacher: queryCondition.value.teacher,
                college: queryCondition.value.college,
                projectType: queryCondition.value.projectType,
                projectStatus: queryCondition.value.projectStatus,
            },
        })
        .catch((err) => {
            console.log('getProjectList Error: ', err);
            return { data: [], total: 0 };
        });
    return { data: res.data, total: res.total };
};

// 格式化项目列表
const formatProjectList = (projectList: rawProject[]) => {
    const { projectTypes, projectStatuses } = projectHallMetaData.value;
    const data: Project[] = projectList.map((item: any) => ({
        ...item,
        applicationDate: item.applicationDate || '-',
        projectLeader: item.projectLeader || '-',
        specialist: item.specialist || '-',
        type: projectTypes[item.type],
        status: projectStatuses[item.status],
    }));
    return data;
};

// 初始化通知列表
const initProjectHall = async () => {
    startLoading();
    scrollToTop(scrollbar); // 使用 el-scrollbar 滚回到顶部
    const { data, total } = await getProjectList();
    const realProjectList = formatProjectList(data);
    setTotal(total); // 设置通知总数
    projectList.value = realProjectList; // 设置通知列表
    stopLoading();
};

// 监听 curPage, pageSize, queryCondition 的变化, 发送请求获取通知列表
watch([curPage, pageSize, queryCondition], initProjectHall, {
    immediate: true,
});
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
