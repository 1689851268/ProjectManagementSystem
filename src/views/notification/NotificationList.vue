<template>
    <div class="notification-list">
        <!-- 通知列表 -->
        <div
            class="notification-item mt-20"
            v-for="notification in notificationList"
            :key="notification.title"
            @click="handleClick(notification)"
        >
            <div class="item-title mb-15">
                {{ notification.title }}
            </div>
            <div class="item-content mb-10">
                {{ notification.content }}
            </div>
            <div class="item-time pb-10">
                {{ notification.time }}
            </div>
        </div>

        <!-- 分页器 -->
        <el-pagination
            class="p-20"
            v-if="total > 0"
            :current-page="curPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <div
            v-else-if="total === 0 && !isLoading"
            class="position-center font-color-ccc"
        >
            {{ $t('No data') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { Notification } from './interfaces';

defineProps<{
    notificationList: Array<Notification>;
    total: number;
    pageSizes: Array<number>;
    pageSize: number;
    curPage: number;
    isLoading: boolean;
}>();

const emits = defineEmits<{
    (event: 'update:curPage', curPage: number): void;
    (event: 'update:pageSize', pageSize: number): void;
}>();

// 每页显示的条数改变时触发
const handleSizeChange = (val: number) => {
    emits('update:pageSize', val);
    emits('update:curPage', 1);
};

// 当前页码改变时触发
const handleCurrentChange = (val: number) => {
    emits('update:curPage', val);
};

// 点击通知时触发
const handleClick = (notification: Notification) => {
    console.log(notification);
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.notification-list {
    @include content-box;

    .notification-item {
        font-size: 14px;
        padding: 0 20px 10px;
        cursor: pointer;

        .item-title {
            font-size: 18px;
        }

        .item-content {
            color: #74798c;
            @include line-clamp(2);
            padding-right: 5px;
        }

        .item-time {
            color: #9ba2ab;
            text-align: right;
            border-bottom: 1px solid #f0f0f0;
        }
    }
}
</style>
