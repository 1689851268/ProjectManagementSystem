<template>
    <div class="personal-center">
        <h3>基本信息</h3>
        <ul class="essential-info">
            <li>账号：{{ user?.uuid }}</li>
            <li>姓名：{{ user?.name }}</li>
            <li
                v-if="
                    userStore.getIdentity === 1 || userStore.getIdentity === 2
                "
            >
                所属学院：{{ user?.college?.name }}
            </li>
            <li v-if="userStore.getIdentity === 1">
                所属专业：{{ user?.major?.name }}
            </li>
            <li v-if="userStore.getIdentity === 1">
                所属班级：{{ user?.class }}
            </li>
        </ul>
        <h3>联系方式</h3>
        <el-form :model="form" :rules="rules" class="contact-form">
            <el-form-item prop="phone">
                <el-input
                    v-model.number="form.phone"
                    clearable
                    :placeholder="$t(`Phone`)"
                />
            </el-form-item>
            <el-form-item prop="email">
                <el-input
                    v-model="form.email"
                    clearable
                    :placeholder="$t(`Email`)"
                />
            </el-form-item>
            <el-form-item>
                <el-button @click="handleUpdate" :loading="isLoading">
                    {{ $t('Update') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import useLoading from '@/hooks/useLoading';
import { useUserStore } from '@/store/user';
import axios from '@/utils/axios';
import { ElMessage, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface User {
    uuid: string;
    password: string;
    name: string;
    class?: number;
    email: string;
    phone: string;
    college?: {
        id: number;
        name: string;
    };
    major?: {
        id: number;
        name: string;
    };
}

const userStore = useUserStore();
const { t } = useI18n();

const form = ref({
    phone: '',
    email: '',
});

const rules = reactive<FormRules>({
    phone: [
        {
            validator: (_: any, value: string, callback: any) => {
                const str = value.toString();
                if (str.length === 0) {
                    // 手机号码长度为 0 位, 不校验
                    callback();
                } else if (str.length === 11) {
                    // 手机号码长度为 11 位
                    callback();
                } else {
                    callback(new Error(t('Phone number must be 11 digits')));
                }
            },
            trigger: 'blur',
        },
    ],
    email: {},
});

const user = ref<User | null>(null);

const init = async () => {
    const uuid = userStore.getUuid;
    const identity = userStore.getIdentity;
    const res: any = await axios.get(`/user/${uuid}`, {
        params: {
            identity,
        },
    });
    console.log('res', res);
    user.value = res;
    form.value.phone = res.phone;
    form.value.email = res.email;
};

userStore.$subscribe(
    (_, state) => {
        if (state.uuid) {
            init();
        }
    },
    { immediate: true },
);

const { isLoading, startLoading, stopLoading } = useLoading();
const handleUpdate = async () => {
    const uuid = userStore.getUuid;
    const identity = userStore.getIdentity;
    startLoading();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await axios
        .patch(`/user/${uuid}`, {
            identity,
            ...form.value,
            class: user.value?.class,
        })
        .then(() => {
            ElMessage({
                message: t('Update Successfully'),
                type: 'success',
            });
        });
    stopLoading();
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.personal-center {
    @include content-box;

    color: #444;
    .essential-info {
        margin: 20px 0 40px 20px;
        li {
            margin-bottom: 10px;
        }
    }

    .contact-form {
        width: 400px;
        margin: 20px 0 20px 20px;
    }
}
</style>
