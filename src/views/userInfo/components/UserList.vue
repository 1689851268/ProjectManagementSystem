<template>
    <div class="user-list">
        <!-- 操作按钮 -->
        <div class="operation-btn mb-20">
            <h3>{{ $t('User List') }}</h3>
            <el-button type="primary" @click="handleAdd" plain>
                {{ $t('Add') }}
            </el-button>
        </div>

        <!-- 用户列表 -->
        <el-table :data="userList" border>
            <el-table-column prop="uuid" :label="$t('Uuid')" align="center" />
            <el-table-column prop="name" :label="$t('Name')" align="center" />
            <el-table-column
                prop="registrationTime"
                :label="$t('Registration Time')"
                align="center"
            />
            <el-table-column :label="$t('Operations')" align="center">
                <template #default="{ $index, row }">
                    <el-button
                        class="m-5"
                        size="small"
                        @click="handleDetails(row.uuid)"
                    >
                        {{ $t('Details') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        type="warning"
                        plain
                        @click="handleUpdate(row.uuid)"
                    >
                        {{ $t('Update') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        type="danger"
                        plain
                        @click="handleDelete(row.uuid)"
                    >
                        {{ $t('Delete') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <AddUserDialog
            v-model:visible="addVisible"
            @initUserList="$emit('initUserList')"
        />
        <UpdateUserDialog
            v-model:visible="updateVisible"
            :curUser="curUser"
            :identity="identity"
            @initUserList="$emit('initUserList')"
        />
        <GetProfileDialog
            :identity="identity"
            :userProfile="userProfile"
            v-model:visible="profileVisible"
        />
    </div>
</template>

<script setup lang="ts">
import { User, UserInfoState, UserProfile } from '../utils/interfaces';
import AddUserDialog from '@/views/userInfo/components/AddUserDialog.vue';
import UpdateUserDialog from '@/views/userInfo/components/UpdateUserDialog.vue';
import GetProfileDialog from '@/views/userInfo/components/GetProfileDialog.vue';

import useDialog from '@/hooks/useDialog';
import { handleDeleteAction } from '@/utils/deleteAction';
import { ref } from 'vue';
import ajax from '@/utils/ajax';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    userList: User[]; // 用户列表
    identity: number; // 用户身份
}>();

const emit = defineEmits<{
    (e: 'initUserList'): void; // 初始化用户列表
}>();

// 弹窗, 用于添加用户, 更新用户, 查看用户详情
const { visible: addVisible, openDialog: openAddVisible } = useDialog();
const { visible: updateVisible, openDialog: openUpdateVisible } = useDialog();
const { visible: profileVisible, openDialog: openProfileVisible } = useDialog();

// 添加用户
const handleAdd = () => {
    openAddVisible();
    // 学生: identity, name, password, college, major, class, (email), (phone)
    // 教师: identity, name, password, college, (email), (phone)
    // 专家: identity, name, password, (email), (phone)
};

// 删除用户
const handleDelete = (uuid: string) => {
    handleDeleteAction(
        // 删除操作的提示信息
        t('user'),
        // 删除请求的 url
        '/user',
        // 删除成功后的回调函数
        () => {
            emit('initUserList');
        },
        // 删除请求的配置对象
        {
            data: {
                uuid,
                identity: props.identity,
            },
        },
    );
};

// 更新用户
const curUser = ref<UserInfoState | null>(null); // 当前用户信息, 用于更新用户
const handleUpdate = async (uuid: string) => {
    // 学生: identity(仅展示), name, password, college, major, class, (email), (phone)
    // 教师: identity(仅展示), name, password, college, (email), (phone)
    // 专家: identity(仅展示), name, password, (email), (phone)
    const res: UserInfoState = await ajax.get(`/user/${uuid}`, {
        params: {
            identity: props.identity,
        },
    });
    curUser.value = res;
    openUpdateVisible();
};

// 查看用户详情
const userProfile = ref<UserProfile | null>(null); // 用户详情
const handleDetails = async (uuid: string) => {
    // 学生: identity, uuid, name, registration time, college, major, class, (email), (phone)
    // 教师: identity, uuid, name, registration time, college, (email), (phone)
    // 专家: identity, uuid, name, registration time, (email), (phone)
    const res: any = await ajax.get(`/user/profile/${uuid}`, {
        params: {
            identity: props.identity,
        },
    });
    userProfile.value = res;
    openProfileVisible();
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.user-list {
    @include content-box;
}

.operation-btn {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
}
</style>
