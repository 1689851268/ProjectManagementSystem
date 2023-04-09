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
                :projectList="projectList"
                v-model:curPage="curPage"
                v-model:pageSize="pageSize"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import NotificationQuery from '@/components/FormQuery.vue';
import ProjectList from '@/views/involvedProject/components/ProjectList.vue';

import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';
import useConfiguration from '@/views/projectHall/utils/useConfiguration';

import ajax from '@/utils/ajax';
import { useMetaDataStore } from '@/store/modules/metaData';
import { scrollToTop } from '@/utils/domHandler';
import { useUserStore } from '@/store/modules/user';
import { InvolvedProject, RawInvolvedProject } from './utils/interfaces';
import { formatDate } from '@/utils/stringFunction';

const userStore = useUserStore();
const metaDataStore = useMetaDataStore();

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const projectList = ref<InvolvedProject[]>([]); // 项目列表

// 获取查询表单的配置项
const { configurations, initConfigurations } = useConfiguration();
// 订阅 projectTypes, projectStatuses 的变化, 初始化 configurations 和 projectHallMetaData
metaDataStore.$subscribe(
    (_, state) => {
        const { projectTypes, projectStatuses } = state;
        // 过滤掉 id 为 1 的状态, 即 '招募中' 状态
        const statusOmitId1 = projectStatuses.filter(
            (status) => status.id !== 1,
        );
        initConfigurations(projectTypes, statusOmitId1);
    },
    { immediate: true },
);

// 获取查询表单的数据及其操作方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(configurations.value);

// 每页显示的条数
const limit = 10;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// loading 及其相关方法
const { isLoading, startLoading, stopLoading } = useLoading();

// 获取项目列表及其总数
const getProjectList = async () => {
    // 发送请求, 获取数据
    await new Promise((resolve) => setTimeout(resolve, 500));
    const res: any = await ajax.get(`/project/student/${userStore.getId}`, {
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

    // 由于后端返回的数据格式是 [data, total], 所以这里要判断 res 是不是数组
    // 如果不是数组, 说明请求失败
    if (!Array.isArray(res)) {
        return {
            data: [],
            total: 0,
        };
    }

    // 返回数据
    return {
        data: res[0] as RawInvolvedProject[],
        total: res[1] as number,
    };
};

// 格式化项目列表
const formatProjectList = (rawProjectList: RawInvolvedProject[]) => {
    const data: InvolvedProject[] = rawProjectList.map(
        (rawProject: RawInvolvedProject) => {
            // 解构
            const {
                teacher,
                publishTime,
                applicationDate,
                projectLeader,
                specialist,
                type,
                status,
            } = rawProject;
            // 获取项目信息
            return {
                ...rawProject,
                projectLeader: projectLeader.name,
                type: type.name,
                status: status.name,
                teacher: teacher.name,
                college: teacher.college.name, // 老师所在学院
                specialist: specialist ? specialist.name : '-',
                publishTime: formatDate(publishTime),
                applicationDate: formatDate(applicationDate),
            };
        },
    );
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
