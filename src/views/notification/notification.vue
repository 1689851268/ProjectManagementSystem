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
            <NotificationList
                :class="{ 'h-full': total === 0 }"
                :notificationList="notificationList"
                :isLoading="isLoading"
                :total="total"
                :pageSizes="pageSizes"
                v-model:curPage="curPage"
                v-model:pageSize="pageSize"
                :limit="limit"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import NotificationQuery from '@/components/FormQuery.vue';
import NotificationList from '@/views/notification/components/NotificationList.vue';

import ajax from '@/utils/ajax.js';
import { Notification } from '@/views/notification/utils/interfaces';
import { Configuration } from '@/common/interfaces';
import { scrollToTop } from '@/utils/domHandler';
import { formatDate } from '@/utils/transformTime';

import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';

/**
 * @desc 发送请求, 获取通知列表
 * @param curPage 当前页码
 * @param pageSize 每页显示的条数
 * @param title 通知标题
 * @return 通知列表
 * @return total 通知总数
 */
const getNotificationList = async (
    curPage: number,
    pageSize: number,
    title: string,
): Promise<{ notificationList: Notification[]; total: number }> => {
    new Promise((resolve) => setTimeout(resolve, 500));

    // 发送请求, 获取通知列表
    const res: any = await ajax.get('/notification', {
        params: {
            curPage,
            pageSize,
            title,
        },
    });

    // 格式化时间
    const notificationList = res[0].map((item: Notification) => {
        return {
            ...item,
            lastUpdateTime: formatDate(item.lastUpdateTime),
        };
    });

    return {
        notificationList,
        total: res[1],
    };
};

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const notificationList = ref<Notification[]>([]); // 通知列表

// 每页显示的条数
const limit = 5;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// 查询表单的配置项
const configurations: Configuration[] = [
    { name: 'title', defaultVal: '', type: 'input' },
];
// 获取查询表单的数据及其操作方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(configurations);

// loading 及其相关方法
const { isLoading, startLoading, stopLoading } = useLoading();

// 监听 curPage, pageSize, queryCondition 的变化, 发送请求获取通知列表
watch(
    [curPage, pageSize, queryCondition],
    async () => {
        startLoading();
        scrollToTop(scrollbar); // 使用 el-scrollbar 滚回到顶部
        const { notificationList: realNotificationList, total: realTotal } =
            await getNotificationList(
                curPage.value,
                pageSize.value,
                queryCondition.value.title,
            );
        setTotal(realTotal); // 设置通知总数
        notificationList.value = realNotificationList; // 设置通知列表
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
