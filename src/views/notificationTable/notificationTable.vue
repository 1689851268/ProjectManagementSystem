<template>
    <div class="notification-table">
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
                @initNotificationList="initNotificationList"
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import NotificationQuery from '@/components/FormQuery.vue';
import NotificationList from '@/views/notificationTable/components/NotificationList.vue';

import ajax from '@/utils/ajax.js';
import {
    Notification,
    NotificationItem,
} from '@/views/notificationTable/utils/interfaces';
import { Configuration } from '@/common/interfaces';
import { scrollToTop } from '@/utils/domHandler';

import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';

/**
 * @desc 发送请求, 获取通知列表
 * @param {number} curPage 当前页码
 * @param {number} pageSize 每页显示的条数
 * @param {string} title 通知标题
 * @return {Array} 通知列表
 * @return {number} total 通知总数
 */
const getNotificationList = async (
    curPage: number,
    pageSize: number,
    title: string,
    publisher: string,
    lastUpdater: string,
): Promise<{ notificationList: Array<NotificationItem>; total: number }> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const res: any = await ajax.get('/notification/list', {
                params: {
                    curPage,
                    pageSize,
                    title,
                    publisher,
                    lastUpdater,
                },
            });

            const notificationList = res[0].map((item: Notification) => {
                return {
                    ...item,
                    lastUpdateTime: new Date(
                        +item.lastUpdateTime,
                    ).toLocaleString(),
                    publishTime: new Date(+item.publishTime).toLocaleString(),
                    publisher: item.publisher.name,
                    lastUpdater: item.lastUpdater.name,
                };
            });

            resolve({
                notificationList,
                total: res[1],
            });
        }, 1000);
    });
};

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const notificationList = ref<Array<NotificationItem>>([]); // 通知列表

// 每页显示的条数
const limit = 10;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// 查询表单的配置项
const configurations: Configuration[] = [
    { name: 'title', defaultVal: '', type: 'input' },
    { name: 'publisher', defaultVal: '', type: 'input' },
    { name: 'lastUpdater', defaultVal: '', type: 'input' },
];
// 获取查询表单的数据及其操作方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(configurations);

// loading 及其相关方法
const { isLoading, startLoading, stopLoading } = useLoading();

const initNotificationList = async () => {
    startLoading();
    scrollToTop(scrollbar); // 使用 el-scrollbar 滚回到顶部
    const { notificationList: realNotificationList, total: realTotal } =
        await getNotificationList(
            curPage.value,
            pageSize.value,
            queryCondition.value.title,
            queryCondition.value.publisher,
            queryCondition.value.lastUpdater,
        );
    setTotal(realTotal); // 设置通知总数
    notificationList.value = realNotificationList; // 设置通知列表
    stopLoading();
};

// 监听 curPage, pageSize, queryCondition 的变化, 发送请求获取通知列表
watch([curPage, pageSize, queryCondition], initNotificationList, {
    immediate: true,
});
</script>

<style scoped lang="scss">
.notification-table {
    display: flex;
    flex-direction: column;
    height: 100%;

    // 重置 el-scrollbar 样式
    :deep(.el-scrollbar__view) {
        height: 100%;
    }
}
</style>
