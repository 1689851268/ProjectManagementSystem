<template>
    <el-dialog
        :title="$t('Please choose your teammates')"
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
                    multiple
                    filterable
                    remote
                    :remote-method="getStudent"
                    :loading="isLoading"
                    style="width: 100%"
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
        <!-- tips -->
        <span class="tips">
            *
            {{
                t(
                    "If you want to go it alone, you don't have to choose a teammate",
                )
            }}
        </span>
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
import { useUserStore } from '@/store/user';
import axios from '@/utils/axios';
import { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const userStore = useUserStore();

defineProps<{
    visible: boolean;
    teammateId: number[];
    btnLoading: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'update:teammateId', newVal: number[]): void;
    (e: 'initUserList'): void;
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
    name: [
        {
            type: 'array',
            message: t('Please select {subject}', {
                subject: t('the member of the project'),
            }),
            trigger: 'change',
        },
    ],
});

// 表单数据
const form = reactive({ name: [] });

// 选项列表
const options = ref<ListItem[]>([]);

const { isLoading, startLoading, stopLoading } = useLoading();

// 获取 student 列表, 输入框的内容会作为参数传入
const getStudent = async (query: string) => {
    if (!query) {
        options.value = [];
        return;
    }

    startLoading();
    const res: any = await new Promise((resolve) => {
        setTimeout(async () => {
            const res = await axios.get('/student', {
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
const applyProject = async () => {
    // 把 userStore.getId 从 form.name 中移除
    const teammateId = form.name.filter((item) => item !== userStore.getId);
    emit('update:teammateId', teammateId);
};

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        // 校验通过, 发送请求新增用户
        if (valid) {
            applyProject();
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

<style lang="scss" scoped>
.tips {
    padding: 0 5px;
    color: #999;
}
</style>
