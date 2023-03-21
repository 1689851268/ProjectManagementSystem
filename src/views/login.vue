<template>
    <LanguageConfig class="float-right" />
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
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

import LanguageConfig from '@/components/LanguageConfig.vue';

const router = useRouter();

const { t } = useI18n();

const form = reactive({
    account: '',
    password: '',
});

const ruleFormRef = ref<FormInstance>();

// 点击登录
const logIn = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    // 校验信息
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!', form);
            router.push({ name: 'Notification' }); // 跳转到 Notification 页面
        } else {
            console.log('error submit!', fields);
        }
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
