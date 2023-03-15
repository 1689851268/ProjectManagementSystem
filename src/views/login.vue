<template>
    <div class="position-center">
        <div class="text-center font-size-25 font-bold">{{ $t('log in') }}</div>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            class="login-form"
        >
            <el-form-item prop="account">
                <el-input
                    v-model="form.account"
                    :placeholder="$t('account')"
                    clearable
                />
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    :placeholder="$t('password')"
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
                    {{ $t('log in') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules } from 'element-plus';

const { t } = useI18n();

const form = reactive({
    account: '',
    password: '',
});

const ruleFormRef = ref<FormInstance>();

const logIn = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!', form);
        } else {
            console.log('error submit!', fields);
        }
    });
};

const rules = reactive<FormRules>({
    account: [
        {
            required: true,
            message: t('Please complete the form.'),
            trigger: 'blur',
        },
        {
            min: 8,
            max: 8,
            message: t("{subject}'s length should be {number}", {
                subject: t('account'),
                number: 8,
            }),
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: t('Please complete the form.'),
            trigger: 'blur',
        },
    ],
});
</script>

<style lang="scss">
.login-form {
    width: 300px;
    padding: 40px;
}
</style>
