<template>
    <el-dialog
        :title="$t('Please fill in the notification information')"
        width="30%"
        :model-value="visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="notificationTitle">
                <el-input
                    v-model="form.notificationTitle"
                    clearable
                    :placeholder="$t(`Notification Title`)"
                />
            </el-form-item>
            <el-form-item prop="content">
                <el-input
                    v-model="form.content"
                    clearable
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    type="textarea"
                    :placeholder="$t(`Notification Content`)"
                />
            </el-form-item>
            <el-form-item>
                <el-upload
                    v-model:file-list="fileList"
                    class="upload-item"
                    :action="`${baseUrl}/notification-attachment/upload`"
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
import useLoading from '@/hooks/useLoading';
import axios from '@/utils/axios';
import {
    ElMessage,
    ElMessageBox,
    FormInstance,
    FormRules,
    UploadProps,
    UploadUserFile,
} from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NotificationDetail } from '../utils/interfaces';

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    notificationDetail: NotificationDetail | null;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'initNotificationList'): void;
}>();

// 表单验证规则
const rules = reactive<FormRules>({
    notificationTitle: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('notification title'),
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
    content: [
        {
            required: true,
            message: t('Please input {subject}', {
                subject: t('notification content'),
            }),
            trigger: 'blur',
        },
    ],
});

// 表单数据
const form = reactive({
    notificationTitle: '',
    content: '',
});

// 侦听 notificationDetail 变化, 更新表单数据
watch(
    () => props.notificationDetail,
    (newVal) => {
        if (newVal) {
            form.notificationTitle = newVal.title;
            form.content = newVal.content;
            fileList.value = newVal.notificationAttachments.map((item) => {
                return {
                    name: item.name,
                    url: item.storagePath,
                };
            });
            console.log(fileList.value);
        }
    },
    { immediate: true },
);

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
            let res: any;
            if (props.notificationDetail) {
                res = await axios.patch(
                    `/notification/${props.notificationDetail.id}`,
                    {
                        title: form.notificationTitle,
                        content: form.content,
                        attachment: rawFileList,
                    },
                );
            } else {
                res = await axios.post('/notification', {
                    title: form.notificationTitle,
                    content: form.content,
                    attachment: rawFileList,
                });
            }
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
    emit('initNotificationList');
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
        await axios.delete(`/notification-attachment/${fileRes.filename}`);
    }
};
</script>

<style lang="scss" scoped>
.upload-item {
    width: 100%;
}
</style>
