<template>
    <div>
        <UserQuery
            :configurations="configurations"
            @setCurPage="setCurPage"
            @setQueryCondition="setQueryCondition"
            @resetQueryCondition="resetQueryCondition"
        />

        <el-scrollbar ref="scrollbar" v-loading="isLoading">
            <UserList
                :class="{ 'h-full': total === 0 }"
                :isLoading="isLoading"
                :limit="limit"
                :pageSizes="pageSizes"
                :total="total"
                :userList="userList"
                :identity="queryCondition.identity"
                v-model:curPage="curPage"
                v-model:pageSize="pageSize"
                @initUserList="initUserList"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import UserQuery from '@/components/FormQuery.vue';
import UserList from '@/views/userInfo/components/UserList.vue';

import useLoading from '@/hooks/useLoading';
import useConfiguration from '@/views/userInfo/utils/useConfiguration';
import { useMetaDataStore } from '@/store/metaData';
import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import ajax from '@/utils/ajax.js';
import { User } from '@/views/userInfo/utils/interfaces';
import { scrollToTop } from '@/utils/domHandler';

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const userList = ref<Array<User>>([]); // 用户列表

// 获取查询表单的配置项
const { configurations, initConfigurations } = useConfiguration();

// 获取元数据, 初始化查询表单的配置项
const metaDataStore = useMetaDataStore();
// 订阅 projectTypes, projectStatuses 的变化, 初始化 configurations 和 projectHallMetaData
metaDataStore.$subscribe(
    (_, state) => {
        const { identities } = state;
        initConfigurations(identities);
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

// 获取用户列表及其总数
const getProjectList = async () => {
    // 发送请求, 获取数据
    const [data, total]: [User[], number] = await new Promise((resolve) =>
        setTimeout(async () => {
            const res: any = await ajax.get('/user', {
                params: {
                    curPage: curPage.value,
                    pageSize: pageSize.value,
                    uuid: queryCondition.value.uuid,
                    name: queryCondition.value.name,
                    identity: queryCondition.value.identity,
                },
            });
            resolve(res);
        }, 1000),
    );
    return { data, total };
};

// 格式化用户列表
const formatProjectList = (projectList: User[]) => {
    const data: User[] = projectList.map((item: any) => ({
        ...item,
        registrationTime: new Date(+item.registrationTime).toLocaleString(),
    }));
    return data;
};

// 初始化通知列表
const initUserList = async () => {
    startLoading();
    scrollToTop(scrollbar); // 使用 el-scrollbar 滚回到顶部
    const { data, total } = await getProjectList();
    setTotal(total); // 设置通知总数
    const realProjectList = formatProjectList(data);
    userList.value = realProjectList; // 设置通知列表
    stopLoading();
};

// 监听 curPage, pageSize, queryCondition 的变化, 发送请求获取通知列表
watch([curPage, pageSize, queryCondition], initUserList, {
    immediate: true,
});
</script>
