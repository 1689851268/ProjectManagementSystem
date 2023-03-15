<template>
    <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('account')">
            <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item :label="$t('password')">
            <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item :label="$t('remember me')">
            <el-switch v-model="form.remember" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="logIn">
                {{ $t('log in') }}
            </el-button>
            <el-button @click="signUp">{{ $t('sign up') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const form = reactive({
    account: '',
    password: '',
    remember: false,
});

const logIn = () => {
    console.log(t('log in'));
};

const signUp = () => {
    console.log('sign up');
};
</script>
