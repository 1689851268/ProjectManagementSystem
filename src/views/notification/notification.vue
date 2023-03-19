<template>
    <div class="notification">
        <!-- 查询组件 -->
        <NotificationQuery
            :defaultQueryCondition="defaultQueryCondition"
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
            />
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, unref } from 'vue';
import type { Ref } from 'vue';
import NotificationQuery from './FormQuery.vue';
import NotificationList from './NotificationList.vue';
import useQueryCondition from '@/hooks/useQueryCondition';
import usePagination from '@/hooks/usePagination';
import useLoading from '@/hooks/useLoading';
import { Notification } from './interfaces';

/**
 * @desc 生成通知列表
 * @param {number} curPage 当前页码
 * @param {number} length 通知列表的长度
 * @return {Array} 通知列表
 */
const generateNotificationList = (
    curPage: number,
    length: number,
): Array<Notification> => {
    // Array.from 用于将类数组对象转换为数组
    return Array.from({ length }, (_, index) => {
        const start = (curPage - 1) * length;
        const serialNumber: number = start + index + 1;
        return {
            title: `通知${serialNumber}`,
            content: `通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容  ${serialNumber}`,
            time: new Date().toLocaleString(),
        };
    });
};

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
): Promise<{ notificationList: Array<Notification>; total: number }> => {
    console.log(curPage, pageSize, title);

    // 模拟请求
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                notificationList: generateNotificationList(curPage, pageSize),
                total: 100,
            });
        }, 1000);
    });
};

/**
 * @desc 使元素滚回到顶部
 * @param {HTMLElement | Ref<HTMLElement | undefined> | undefined} el 元素
 */
const scrollToTop = (
    el: HTMLElement | Ref<HTMLElement | undefined> | undefined,
) => {
    unref(el)?.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollbar = ref<HTMLElement>(); // el-scrollbar 的 ref, 用于滚回到顶部
const notificationList = ref<Array<Notification>>([]); // 通知列表

// 每页显示的条数
const limit = 5;
// 分页相关数据及其相关方法
const { total, curPage, pageSize, pageSizes, setTotal, setCurPage } =
    usePagination(limit);

// 查询条件及其默认值, 用于初始化查询条件 / 重置查询条件, 不会随着查询条件的变化而变化
const defaultQueryCondition = { title: '' };
// 查询条件及其相关方法
const { queryCondition, setQueryCondition, resetQueryCondition } =
    useQueryCondition(defaultQueryCondition);

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
