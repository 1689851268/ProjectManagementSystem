<template>
    <div class="user-list">
        <!-- 操作按钮 -->
        <div class="operation-btn mb-20">
            <h3>用户列表</h3>
            <el-button type="primary" @click="handleAdd" plain>
                {{ $t('Add') }}
            </el-button>
        </div>

        <!-- 用户列表 -->
        <el-table :data="userList" border>
            <el-table-column prop="uuid" :label="$t('uuid')" align="center" />
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
                        @click="handleDetails($index, row)"
                    >
                        {{ $t('Details') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        type="warning"
                        plain
                        @click="handleUpdate(row)"
                    >
                        {{ $t('更新') }}
                    </el-button>
                    <el-button
                        class="m-5"
                        size="small"
                        type="danger"
                        plain
                        @click="handleDelete(row)"
                    >
                        {{ $t('删除') }}
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
    </div>
</template>

<script setup lang="ts">
import { User, UserInfoState } from '../utils/interfaces';
import AddUserDialog from '@/views/userInfo/components/AddUserDialog.vue';
import UpdateUserDialog from '@/views/userInfo/components/UpdateUserDialog.vue';

import useDialog from '@/hooks/useDialog';
import { handleDeleteAction } from '@/utils/deleteAction';
import { ref } from 'vue';
import axios from '@/utils/axios';

const props = defineProps<{
    userList: User[];
    identity: number;
}>();

const emit = defineEmits<{
    (e: 'initUserList'): void;
}>();

const { visible: addVisible, openDialog: openAddVisible } = useDialog();
const { visible: updateVisible, openDialog: openUpdateVisible } = useDialog();

// 添加用户
const handleAdd = () => {
    openAddVisible();
    // 1. 弹窗: 选择身份、填写用户信息
    // 1.1 学生: identity, name, password, college, major, class, (email), (phone)
    // 1.2 教师: identity, name, password, college, (email), (phone)
    // 1.3 专家: identity, name, password, (email), (phone)
};

// 删除用户
const handleDelete = (row: User) => {
    // 1. 弹窗: 确认删除
    // 2. 发起请求删除用户
    handleDeleteAction(
        // 删除操作的提示信息
        '此操作将永久删除该项目, 是否继续?',
        // 删除请求的 url
        '/user',
        // 删除成功后的回调函数
        () => {
            emit('initUserList');
        },
        // 删除请求的配置对象
        {
            data: {
                uuid: row.uuid,
                identity: props.identity,
            },
        },
    );
};

// 当前用户信息, 用于更新用户
const curUser = ref<UserInfoState | null>(null);

// 更新用户
const handleUpdate = async (row: User) => {
    openUpdateVisible();
    const res: UserInfoState = await axios.get(`/user/${row.uuid}`, {
        params: {
            identity: props.identity,
        },
    });
    curUser.value = res; // 获取当前用户信息
    /*
    1.1 学生: identity(仅展示), name, password, college, major, class, (email), (phone)
    {
        "password": "123",
        "name": "JS1",
        "class": 3,
        "email": "",
        "phone": "",
        "college": {
            "id": 1,
            "name": "软件学院"
        },
        "major": {
            "id": 1,
            "name": "软件工程"
        }
    }
    */
    /*
    1.2 教师: identity(仅展示), name, password, college, (email), (phone)
    {
        "password": "123",
        "name": "余伟",
        "email": "c.khlqvwjo@rdkxwp.lb",
        "phone": "",
        "college": {
            "id": 1,
            "name": "软件学院"
        }
    }
    */
    /*
    1.3 专家: identity(仅展示), name, password, (email), (phone)
    {
        "password": "123",
        "name": "ZJ2",
        "email": "1689851268@qq.com",
        "phone": "13160968548"
    }
    */
};

// 查看用户详情
const handleDetails = (index: number, row: User) => {
    console.log(index, row);
    // 1. 弹窗: 查看用户详情
    // 1.1 学生: identity, uuid, name, registration time, college, major, class, (email), (phone)
    // 1.2 教师: identity, uuid, name, registration time, college, (email), (phone)
    // 1.3 专家: identity, uuid, name, registration time, (email), (phone)
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
