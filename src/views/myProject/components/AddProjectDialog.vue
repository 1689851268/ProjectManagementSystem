<template>
    <el-dialog
        :title="$t('Please fill in the project information')"
        width="30%"
        :model-value="visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="name">
                <el-input
                    v-model="form.name"
                    clearable
                    :placeholder="$t(`Project Name`)"
                />
            </el-form-item>
            <el-form-item prop="type">
                <el-select
                    v-model="form.type"
                    clearable
                    :placeholder="$t(`Project Type`)"
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in getProjectTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="`${item.id}`"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="desc">
                <el-input
                    v-model="form.desc"
                    clearable
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    :placeholder="$t(`Project Description`)"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose()">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                    :loading="isLoading"
                    type="primary"
                    @click="submitForm(ruleFormRef)"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import useLoading from '@/hooks/useLoading';
import { useMetaDataStore } from '@/store/metaData';
import { useUserStore } from '@/store/user';
import axios from '@/utils/axios';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProjectForm } from '../utils/interfaces';

const { t } = useI18n();
const userStore = useUserStore();

const metaDataStore = useMetaDataStore();
const { getProjectTypes } = storeToRefs(metaDataStore);

const props = defineProps<{
    visible: boolean;
    projectDetail: ProjectForm | null;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'initProjectHall'): void;
}>();

// 表单验证规则
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('project name'),
            }),
            trigger: 'blur',
        },
        {
            min: 1,
            max: 20,
            message: t('Length should be {start} to {end}', {
                start: 1,
                end: 20,
            }),
            trigger: 'blur',
        },
    ],
    type: {
        required: true,
        message: t('Please input {subject}', { subject: t('project type') }),
        trigger: 'change',
    },
    desc: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('project description'),
            }),
            trigger: 'blur',
        },
        {
            min: 1,
            max: 200,
            message: t('Length should be {start} to {end}', {
                start: 1,
                end: 200,
            }),
            trigger: 'blur',
        },
    ],
});

// 表单数据
const form = reactive({
    name: '',
    type: '',
    desc: '',
});

// 侦听 projectDetail 变化, 更新表单数据
watch(
    () => props.projectDetail,
    (newVal) => {
        if (newVal) {
            form.name = newVal.name;
            form.type = `${newVal.type}`;
            form.desc = newVal.description;
        }
    },
    { immediate: true },
);

// 根据条件获取 axios 请求配置
const useAxiosConfig = (projectDetail: ProjectForm | null) => {
    // axios 请求配置
    const axiosConfig = {
        add: {
            url: '/project',
            data: {
                name: form.name,
                type: form.type,
                description: form.desc,
                teacher: userStore.getId,
            },
        },
        edit: {
            url: `/project/${projectDetail?.id}`,
            data: {
                name: form.name,
                type: form.type,
                description: form.desc,
            },
        },
    };
    // 判断 projectDetail 是否存在, 存在则为编辑, 不存在则为新增
    const configKey = projectDetail ? 'edit' : 'add';
    const url = axiosConfig[configKey].url;
    const data = axiosConfig[configKey].data;
    const method = projectDetail ? 'patch' : 'post';

    return {
        url,
        data,
        method,
    };
};

// 发送请求操作项目
const operProject = async () => {
    startLoading();

    // 获取 axios 请求配置
    const { url, data, method } = useAxiosConfig(props.projectDetail);

    // 发送请求, 添加项目
    const res: any = await new Promise((resolve) => {
        setTimeout(async () => {
            const res = await (axios as any)[method](url, { ...data });
            resolve(res);
        }, 500);
    });

    // 操作失败, 弹窗提示
    if (
        /* 添加失败 */ res.status !== 201 &&
        /* 更新失败 */ res.affected !== 1
    ) {
        ElMessage({
            message: t('Operation Failed'),
            type: 'error',
        });
        stopLoading();
        return;
    }

    // 添加成功, 弹窗提示
    ElMessage({
        message: t('Operation Successfully'),
        type: 'success',
    });
    emit('initProjectHall');
    handleClose();
    stopLoading();
};

// 表单实例
const ruleFormRef = ref<FormInstance>();

const { isLoading, startLoading, stopLoading } = useLoading();

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        // 校验通过, 发送请求新增用户
        if (valid) {
            operProject();
        } else {
            console.log('error submit!', fields);
        }
    });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

// 关闭弹窗
const handleClose = () => {
    emit('update:visible', false);
    setTimeout(() => {
        resetForm(ruleFormRef.value);
    }, 500);
};
</script>

<style scoped lang="scss"></style>
