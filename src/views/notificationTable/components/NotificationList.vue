<template>
    <div class="notification-list">
        <!-- 操作按钮 -->
        <div class="operation-btn mb-20">
            <h3>{{ $t('Notification List') }}</h3>
            <el-button type="primary" @click="handleAdd">
                {{ $t('Add') }}
            </el-button>
        </div>

        <!-- 项目列表 -->
        <el-table :data="notificationList" border>
            <el-table-column
                prop="id"
                :label="$t('Notification ID')"
                align="center"
                width="120"
            />
            <el-table-column prop="title" :label="$t('Title')" align="center" />
            <el-table-column
                prop="publisher"
                :label="$t('Publisher')"
                align="center"
                width="120"
            />
            <el-table-column
                prop="publishTime"
                :label="$t('Publish Time')"
                align="center"
            />
            <el-table-column
                prop="lastUpdater"
                :label="$t('Last Updater')"
                align="center"
                width="130"
            />
            <el-table-column
                prop="lastUpdateTime"
                :label="$t('LastUpdate Time')"
                align="center"
            />
            <el-table-column :label="$t('Operations')" align="center">
                <template #default="{ $index, row }">
                    <el-button
                        class="m-5"
                        size="small"
                        @click="handleDetails(row.id)"
                    >
                        {{ $t('Details') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        type="danger"
                        plain
                        @click="handleDelete(row.id)"
                    >
                        {{ $t('Delete') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        plain
                        @click="handleUpdate(row.id)"
                    >
                        {{ $t('Update') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
            class="p-20"
            v-if="total > limit"
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

        <AddNotificationDialog
            v-model:visible="addDialog"
            :notificationDetail="notificationDetail"
            @initNotificationList="emits('initNotificationList')"
        />
    </div>
</template>

<script setup lang="ts">
import { NotificationItem } from '../utils/interfaces';
import { useRouter } from 'vue-router';
import { handleDeleteAction } from '@/utils/deleteAction';
import { useI18n } from 'vue-i18n';
import AddNotificationDialog from './AddNotificationDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ref } from 'vue';
import axios from '@/utils/axios';
import { NotificationDetail } from '../utils/interfaces';

const { t } = useI18n();
const router = useRouter();

defineProps<{
    notificationList: Array<NotificationItem>;
    total: number;
    pageSizes: Array<number>;
    pageSize: number;
    curPage: number;
    isLoading: boolean;
    limit: number;
}>();

const emits = defineEmits<{
    (event: 'update:curPage', curPage: number): void;
    (event: 'update:pageSize', pageSize: number): void;
    (event: 'initNotificationList'): void;
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

// 添加操作
const { visible: addDialog, openDialog: openAddDialog } = useDialog();
const notificationDetail = ref<NotificationDetail | null>(null);
const handleAdd = () => {
    openAddDialog();
};
// 更新操作
const handleUpdate = async (id: number) => {
    // 发送 axios 获取 notificationDetail
    const res: any = await axios.get(`notification/detail/${id}`);
    notificationDetail.value = res;
    openAddDialog();
};

// 删除操作
const handleDelete = (id: number) => {
    handleDeleteAction(
        // 删除操作的提示信息
        t('notification'),
        // 删除请求的 url
        `/notification/${id}`,
        // 删除成功后的回调函数
        () => {
            emits('initNotificationList');
        },
    );
};

// 查看详情
const handleDetails = (id: number) => {
    router.push({
        name: 'NotificationDetail',
        params: {
            id,
        },
    });
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.notification-list {
    @include content-box;

    .operation-btn {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
    }
}
</style>
