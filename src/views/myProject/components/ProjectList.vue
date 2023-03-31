<template>
    <div class="project-list">
        <!-- 操作按钮 -->
        <div class="operation-btn mb-20">
            <h3>{{ $t('Project List') }}</h3>
            <el-button
                type="primary"
                @click="handleAdd"
                v-if="userStore.getIdentity === 2"
            >
                {{ $t('Add') }}
            </el-button>
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
                width="110"
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

                    <el-button
                        v-if="row.status === projectStatuses[3]"
                        class="m-5"
                        size="small"
                        @click="submitProposal(row.id)"
                    >
                        {{ $t('Opening Report') }}
                    </el-button>

                    <el-button
                        v-if="row.status === projectStatuses[4]"
                        class="m-5"
                        size="small"
                        @click="submitConclusion(row.id)"
                    >
                        {{ $t('Closing Report') }}
                    </el-button>

                    <!-- [撤销] & [提交报告] -->
                    <template v-if="userStore.getIdentity === 1">
                        <el-button
                            v-if="row.status === projectStatuses[2]"
                            class="m-5"
                            size="small"
                            @click="handleWithdraw(row.id)"
                        >
                            {{ $t('Withdraw') }}
                        </el-button>
                    </template>

                    <template v-if="userStore.getIdentity === 2">
                        <!-- [删除]、[更新] 操作仅发布该项目的 "教师" 有权限 -->
                        <!-- 只能删除、更新 "招募中" 的项目 -->
                        <!-- 只能对项目名称、项目类型、项目描述进行更新 -->
                        <el-button
                            v-if="row.status === projectStatuses[1]"
                            class="m-5"
                            size="small"
                            @click="handleUpdate(row.id)"
                        >
                            {{ $t('Update') }}
                        </el-button>
                        <el-button
                            v-if="row.status === projectStatuses[1]"
                            class="m-5"
                            size="small"
                            type="danger"
                            plain
                            @click="handleDelete(row.id)"
                        >
                            {{ $t('Delete') }}
                        </el-button>
                        <el-button
                            v-if="row.status === projectStatuses[2]"
                            class="m-5"
                            size="small"
                            plain
                            @click="handleConsent(row.id)"
                        >
                            {{ $t('Consent') }}
                        </el-button>
                        <el-button
                            v-if="row.status === projectStatuses[2]"
                            class="m-5"
                            size="small"
                            plain
                            @click="handleReject(row.id)"
                        >
                            {{ $t('Reject') }}
                        </el-button>
                    </template>

                    <!-- [同意开题] & [拒绝开题] -->
                    <ProposalBtn
                        v-if="
                            userStore.getIdentity === 3 &&
                            row.status === projectStatuses[3]
                        "
                        :projectId="row.id"
                        @initProjectHall="$emit('initProjectHall')"
                    />

                    <!-- [同意结题] & [拒绝结题] -->
                    <FinalBtn
                        v-if="
                            userStore.getIdentity === 3 &&
                            row.status === projectStatuses[4]
                        "
                        :projectId="row.id"
                        @initProjectHall="$emit('initProjectHall')"
                    />
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

        <AddProjectDialog
            v-model:visible="visible"
            :projectDetail="projectDetail"
            @initProjectHall="$emit('initProjectHall')"
        />

        <AllowProjectDialog
            v-model:visible="allowVisible"
            :projectId="curProjectId"
            @initProjectHall="$emit('initProjectHall')"
        />

        <SubmitAttachmentDialog
            v-model:visible="attVisible"
            :projectId="projectId"
            :attachment="attachment"
            :type="type"
        />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Project } from '../../projectHall/utils/interfaces';
import { handleDeleteAction } from '@/utils/deleteAction';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import { ElMessageBoxConfirm } from '@/utils/domHandler';
import axios from '@/utils/axios';
import AddProjectDialog from './AddProjectDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ref } from 'vue';
import { Attachment, ProjectForm } from '../utils/interfaces';
import AllowProjectDialog from './AllowProjectDialog.vue';
import ProposalBtn from './ProposalBtn.vue';
import FinalBtn from './FinalBtn.vue';
import SubmitAttachmentDialog from './SubmitAttachmentDialog.vue';

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

// 点击添加时触发
const { visible, openDialog } = useDialog();
const handleAdd = () => {
    openDialog();
};

// 点击更新时触发
const projectDetail = ref<ProjectForm | null>(null);
const handleUpdate = async (id: number) => {
    const res: any = await axios.get(`/project/${id}`);
    projectDetail.value = { ...res, id };
    openDialog();
};

// 点击删除时触发
const handleDelete = (id: number) => {
    handleDeleteAction(
        // 删除操作的提示信息
        t('project'),
        // 删除请求的 url
        `/project/${id}`,
        // 删除成功后的回调函数
        () => {
            emits('initProjectHall');
        },
    );
};

// 点击撤回时触发
const handleWithdraw = async (id: number) => {
    // 弹窗提示用户是否撤回
    const isSure = await ElMessageBoxConfirm(
        t('Are you sure you want to withdraw your application?'),
    );

    // 如果用户取消, 则不进行后续操作
    if (!isSure) {
        ElMessage({
            type: 'info',
            message: t('Canceled'),
        });
        return;
    }

    // 发送撤回请求
    const res = await axios.post(`/project/revoke`, { projectId: id });

    // 撤回失败, 则不进行后续操作
    if (res.status !== 201) {
        ElMessage({
            type: 'error',
            message: t('Withdraw failed'),
        });
        return;
    }

    // 撤回成功后, 重新获取项目列表
    ElMessage({
        type: 'success',
        message: t('Withdraw success'),
    });
    emits('initProjectHall');
};

// 点击同意时触发
const curProjectId = ref<number>(0);
const { visible: allowVisible, openDialog: openAllow } = useDialog();
const handleConsent = (id: number) => {
    // 1. 弹窗选择审批的专家, 获取 [专家的 id]
    curProjectId.value = id;
    openAllow();
    // 2. 发送请求更新 project 表: status: 3, specialist: [专家的 id]
    // 3. 更新项目列表
};

// 点击拒绝时触发
const handleReject = async (id: number) => {
    // 弹窗提示用户是否拒绝
    const isSure = await ElMessageBoxConfirm(
        t('Are you sure you want to reject this application?'),
    );

    // 如果用户取消, 则不进行后续操作
    if (!isSure) {
        ElMessage({
            type: 'info',
            message: t('Canceled'),
        });
        return;
    }

    // 2. 发送请求更新
    // 2.1 project 表, 根据 projectId 更新 status: 1, applicationDate: "", projectLeader: null
    // 2.2 project_and_student 表, 根据 projectId 删除记录
    const res = await axios.post(`/project/reject`, { projectId: id });

    // 拒绝失败, 则不进行后续操作
    if (res.status !== 201) {
        ElMessage({
            type: 'error',
            message: t('Reject Failed'),
        });
        return;
    }

    // 拒绝成功后, 重新获取项目列表
    ElMessage({
        type: 'success',
        message: t('Reject Successfully'),
    });
    emits('initProjectHall');
};

// 提交开题报告
const attachment = ref<Attachment | null>(null);
const projectId = ref(0);
const type = ref(0);
const { visible: attVisible, openDialog: openAttDialog } = useDialog();
const submitProposal = async (id: number) => {
    projectId.value = id;
    type.value = 0;

    attachment.value =
        (await axios.get(`/project-attachment/${id}`, {
            params: { type: type.value },
        })) || null;
    console.log('attachment', attachment.value);

    openAttDialog();
};

// 提交结题报告
const submitConclusion = async (id: number) => {
    projectId.value = id;
    type.value = 1;

    attachment.value =
        (await axios.get(`/project-attachment/${id}`, {
            params: { type: type.value },
        })) || null;
    console.log('attachment', attachment.value);

    openAttDialog();
};
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
