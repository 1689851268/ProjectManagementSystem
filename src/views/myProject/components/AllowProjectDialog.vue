<template>
    <el-dialog
        :title="$t('Please select the specialist')"
        width="25%"
        :model-value="visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="name">
                <el-select
                    v-model="form.name"
                    clearable
                    :placeholder="placeholder"
                    filterable
                    remote
                    :remote-method="getStudent"
                    :loading="isLoading"
                    style="width: 100%"
                    remote-show-suffix
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose()">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                    :loading="btnLoading"
                    type="primary"
                    @click="submitForm(ruleFormRef)"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/useLoading';
import axios from '@/utils/axios';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    projectId: number;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'initProjectHall'): void;
}>();

interface ListItem {
    value: string;
    label: string;
}

// 输入框的 placeholder
const placeholder = computed(() => {
    return t('Please input {subject}', {
        subject: t(`{item1} or {item2}`, {
            item1: t('Name'),
            item2: t('Uuid'),
        }),
    });
});

// 表单实例
const ruleFormRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
    name: {
        required: true,
        message: t('Please select {subject}', {
            subject: t('specialist'),
        }),
        trigger: 'blur',
    },
});

// 表单数据
const form = reactive({ name: [] });

// 选项列表
const options = ref<ListItem[]>([]);

// 获取 student 列表, 输入框的内容会作为参数传入
const { isLoading, startLoading, stopLoading } = useLoading();
const getStudent = async (query: string) => {
    if (!query) {
        options.value = [];
        return;
    }

    startLoading();
    const res: any = await new Promise((resolve) => {
        setTimeout(async () => {
            const res = await axios.get('/specialist', {
                params: {
                    keyword: query,
                },
            });
            resolve(res);
        }, 300);
    });
    stopLoading();

    options.value = res.map((item: any) => {
        return {
            value: item.id,
            label: `${item.name} ( ${item.uuid} )`,
        };
    });
};

// 发送请求申报项目
const {
    isLoading: btnLoading,
    startLoading: startBtnLoading,
    stopLoading: stopBtnLoading,
} = useLoading();
const allowProject = async () => {
    startBtnLoading();
    // 1. 发送请求更新 project 表: 根据 projectId 更新 status: 3, specialist: [专家的 id]
    const res: any = await axios.patch(`/project/allow`, {
        projectId: props.projectId,
        specialist: form.name,
    });

    // 撤回失败, 则不进行后续操作
    if (res.affected !== 1) {
        ElMessage({
            type: 'error',
            message: t('Operation failed'),
        });
        stopBtnLoading();
        return;
    }

    // 撤回成功后, 重新获取项目列表
    ElMessage({
        type: 'success',
        message: t('Operation success'),
    });
    emit('initProjectHall');
    stopBtnLoading();
    handleClose();
};

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        // 校验通过, 发送请求新增用户
        if (valid) {
            allowProject();
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
