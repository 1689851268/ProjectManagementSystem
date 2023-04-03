<template>
    <LanguageConfig class="float-right m-20" />
    <div class="position-center">
        <div class="text-center font-size-25 font-bold">{{ $t('Log In') }}</div>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            class="login-form"
        >
            <el-form-item prop="account">
                <el-input
                    v-model="form.account"
                    :placeholder="$t('Account')"
                    clearable
                />
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    :placeholder="$t('Password')"
                    clearable
                    show-password
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    :loading="isLoading"
                    type="primary"
                    class="w-full"
                    @click="logIn(ruleFormRef)"
                >
                    {{ $t('Log In') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

import LanguageConfig from '@/components/LanguageConfig.vue';
import ajax from '@/utils/ajax.js';
import { useUserStore } from '@/store/user';
import useLoading from '@/hooks/useLoading';

const router = useRouter();
const userStore = useUserStore();

const { t } = useI18n();

const form = reactive({
    account: '',
    password: '',
});

const ruleFormRef = ref<FormInstance>();

const { isLoading, startLoading, stopLoading } = useLoading();

// 点击登录
const logIn = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    // 校验信息
    await formEl.validate(async (valid, fields) => {
        // 校验不通过
        if (!valid) {
            console.log('error submit!', fields);
            return;
        }

        startLoading();
        const res: any = await ajax
            .post('/user/login', {
                username: form.account,
                password: form.password,
            })
            .catch((err) => {
                console.log('err', err);
                const msg = err.response.data;
                return {
                    status: msg.status as number,
                    message: msg.data as string,
                };
            });

        // 登录失败
        if (res.status !== 201) {
            stopLoading();
            return;
        }

        // 登录成功
        ElMessage.success(t('Login success'));
        const token = res.data.access_token;
        userStore.setToken(token); // 设置 token
        router.push({ name: 'Notification' }); // 跳转到 Notification 页面
        stopLoading();
    });
};

// 校验规则
const rules = reactive<FormRules>({
    account: [
        {
            required: true,
            message: t('Please complete the form'),
            trigger: 'blur',
        },
        {
            min: 8,
            max: 8,
            message: t("{subject}'s length should be {number}", {
                subject: t('Account'),
                number: 8,
            }),
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: t('Please complete the form'),
            trigger: 'blur',
        },
    ],
});
</script>

<style scoped lang="scss">
.login-form {
    width: 300px;
    padding: 40px;
}
</style>
