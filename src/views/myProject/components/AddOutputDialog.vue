<template>
    <el-dialog
        :title="$t('Please fill in the output information')"
        width="30%"
        :model-value="visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="achieveName">
                <el-input
                    v-model="form.achieveName"
                    clearable
                    :placeholder="$t(`Achievement Name`)"
                />
            </el-form-item>
            <el-form-item prop="type">
                <el-select
                    v-model="form.type"
                    clearable
                    :placeholder="$t(`Project Type`)"
                >
                    <el-option
                        v-for="option in options"
                        :key="option.id"
                        :label="option.name"
                        :value="option.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-upload
                    v-model:file-list="fileList"
                    class="upload-item"
                    :action="`${baseUrl}/project-achievement/upload`"
                    multiple
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="3"
                    :on-exceed="handleExceed"
                >
                    <el-button type="primary">
                        {{ $t('Click to upload') }}
                    </el-button>
                </el-upload>
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
import { useI18n } from 'vue-i18n';
import { reactive, ref } from 'vue';
import {
    ElMessage,
    ElMessageBox,
    FormInstance,
    FormRules,
    UploadProps,
    UploadUserFile,
} from 'element-plus';

import ajax from '@/utils/ajax';
import useLoading from '@/hooks/useLoading';
import { MetaData } from '@/common/interfaces';
import { useMetaDataStore } from '@/store/modules/metaData';

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

const metaDataStore = useMetaDataStore();
const { t } = useI18n();

defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
}>();

const options = ref<MetaData[]>([]);
metaDataStore.$subscribe((_mutation, state) => {
    console.log({ projectTypes: state.projectTypes });
    options.value = state.projectTypes;
});

// 表单验证规则
const rules = reactive<FormRules>({
    achieveName: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('achievement name'),
            }),
            trigger: 'blur',
        },
    ],
    type: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('achievement type'),
            }),
            trigger: 'change',
        },
    ],
});

// 表单数据
const form = reactive({
    achieveName: '',
    type: '',
});

// 发送请求操作通知
const operNotification = async () => {
    startLoading();

    // 获取 attachment 数组
    const rawFileList = fileList.value.map((item) => {
        const fileRes: any = item.response;
        if (fileRes) {
            return {
                name: fileRes.originalname,
                url: fileRes.filename,
            };
        } else {
            return {
                name: item.name,
                url: item.url,
            };
        }
    });

    // 发送请求, 添加项目
    const res: any = await new Promise((resolve) => {
        setTimeout(async () => {
            const res: any = await ajax.post('/notification', {
                title: form.achieveName,
                type: form.type,
                attachment: rawFileList,
            });
            resolve(res);
        }, 500);
    });
    console.log('res', res);

    // 操作失败, 弹窗提示
    if (res.status !== 201) {
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
            operNotification();
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

    // 重置表单和上传文件列表
    setTimeout(() => {
        resetForm(ruleFormRef.value);
        fileList.value = [];
    }, 500);
};

// 上传文件列表
const fileList = ref<UploadUserFile[]>([]); // 默认列表

// 文件超出限制时的钩子
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${
            files.length
        } files this time, add up to ${
            files.length + uploadFiles.length
        } totally`,
    );
};

// 文件删除前的钩子
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
    return ElMessageBox.confirm(
        t('Are you sure you want to delete "{item}" ?', {
            item: uploadFile.name,
        }),
    ).then(
        () => true,
        () => false,
    );
};

// 移除文件时的钩子
const handleRemove: UploadProps['onRemove'] = async (file) => {
    const fileRes: any = file.response;
    // 新增时, 能获取到 file.response, 可以直接删除文件
    // 编辑时, 不能获取到 file.response, 需要提交修改来发送请求删除文件
    if (fileRes) {
        // 发送请求删除文件
        await ajax.delete(`/notification-attachment/${fileRes.filename}`);
    }
};
</script>

<style lang="scss" scoped>
.upload-item {
    width: 100%;
}
</style>
