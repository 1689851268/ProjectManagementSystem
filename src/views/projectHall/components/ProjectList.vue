<template>
    <div class="project-list">
        <!-- 操作按钮 -->
        <div class="operation-btn mb-20">
            <h3>{{ $t('Project List') }}</h3>
        </div>

        <!-- 项目列表 -->
        <el-table :data="projectList" border>
            <el-table-column
                prop="id"
                :label="$t('Project ID')"
                align="center"
                width="110"
            />
            <el-table-column
                prop="name"
                :label="$t('Project Name')"
                align="center"
            />
            <el-table-column
                prop="type"
                :label="$t('Type')"
                align="center"
                width="110"
            >
                <template #default="scope">
                    {{ scope.row.type }}
                </template>
            </el-table-column>
            <el-table-column
                prop="teacher"
                :label="$t('Teacher')"
                align="center"
                width="110"
            />
            <el-table-column
                prop="college"
                :label="$t('College')"
                align="center"
                width="120"
            />
            <el-table-column
                prop="publishTime"
                :label="$t('Publish Time')"
                align="center"
                width="170"
            />
            <el-table-column
                prop="status"
                :label="$t('Status')"
                align="center"
                width="110"
            >
                <template #default="scope">
                    {{ scope.row.status }}
                </template>
            </el-table-column>
            <el-table-column
                prop="applicationDate"
                :label="$t('Application Time')"
                align="center"
            />
            <el-table-column
                prop="projectLeader"
                :label="$t('Project Leader')"
                align="center"
                width="130"
            />
            <el-table-column
                prop="specialist"
                :label="$t('Specialist')"
                align="center"
            />
            <el-table-column :label="$t('Operations')" align="center">
                <template #default="{ $index, row }">
                    <el-button
                        class="m-5"
                        size="small"
                        @click="handleDetails($index, row)"
                    >
                        {{ $t('Details') }}
                    </el-button>
                    <!-- 申请操作仅 "学生" 有权限 -->
                    <!-- 只能申请 "招募中" 的项目 -->
                    <el-button
                        v-if="
                            row.status === projectStatuses[1] &&
                            userStore.getIdentity === 1
                        "
                        class="m-5"
                        size="small"
                        @click="handleApply(row.id)"
                    >
                        {{ $t('Apply') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
            class="p-20 pl-0"
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

        <ApplyDialog
            v-model:visible="visible"
            @initUserList="$emit('initUserList')"
            v-model:teammateId="teammateId"
            :btnLoading="isLoading"
        />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Project } from '../utils/interfaces';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/user';
import useDialog from '@/hooks/useDialog';
import ApplyDialog from './ApplyDialog.vue';
import axios from '@/utils/axios';
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import useLoading from '@/hooks/useLoading';

const userStore = useUserStore();

const { t } = useI18n();

defineProps<{
    projectList: Array<Project>;
    total: number;
    pageSizes: Array<number>;
    pageSize: number;
    curPage: number;
    projectStatuses: Record<string, string>;
    limit: number;
}>();

const emits = defineEmits<{
    (event: 'update:curPage', curPage: number): void;
    (event: 'update:pageSize', pageSize: number): void;
    (event: 'initProjectHall'): void;
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

// 点击详情时触发
const router = useRouter();
const handleDetails = (index: number, row: Project) => {
    console.log(index, row);
    router.push({
        name: 'ProjectDetail',
        params: { id: row.id },
    });
};

const { visible, openDialog, closeDialog } = useDialog();
const { isLoading, startLoading, stopLoading } = useLoading();

// 点击申报时触发
const teammateId = ref<number[]>([]);
const projectId = ref<number>(0);
const handleApply = (id: number) => {
    projectId.value = id;
    openDialog();
};

// 监听 teammateId, 申报项目
watch(teammateId, async (val) => {
    startLoading();
    // 申报项目
    const res: any = await new Promise((resolve) => {
        setTimeout(async () => {
            const res = await axios.post('/project/apply', {
                projectId: projectId.value,
                applyUserId: userStore.getId,
                teammateId: val,
            });
            resolve(res);
        }, 800);
    });

    // 申报失败, 弹窗提示
    if (res.status !== 201) {
        ElMessage({
            message: t('Operation Failure'),
            type: 'error',
        });
        stopLoading();
        return;
    }

    // 申报成功, 弹窗提示, 关闭 Dialog, 刷新项目大厅
    ElMessage({
        message: t('Operation Success'),
        type: 'success',
    });
    emits('initProjectHall');
    closeDialog();
    stopLoading();
});
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.project-list {
    @include content-box;
}

.operation-btn {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
}
</style>
