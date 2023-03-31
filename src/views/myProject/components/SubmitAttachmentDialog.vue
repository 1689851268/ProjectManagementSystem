<template>
    <el-dialog
        width="30%"
        :model-value="visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-upload
            ref="upload"
            :class="{ 'upload-demo': userStore.identity !== 1 }"
            :action="`${baseUrl}/project-attachment/upload`"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            v-model:file-list="fileList"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
        >
            <template #trigger v-if="userStore.identity === 1">
                <el-button type="primary">{{ $t('select file') }}</el-button>
            </template>
            <el-button
                class="ml-5"
                type="success"
                @click="submitUpload"
                v-if="userStore.identity === 1"
            >
                {{ $t('upload to server') }}
            </el-button>
            <template #tip v-if="userStore.identity === 1">
                <div class="el-upload__tip text-red">
                    {{ $t('limit 1 file, new file will cover the old file') }}
                </div>
            </template>
            <template #tip v-if="userStore.identity !== 1">
                <div class="el-upload__tip text-red">
                    {{
                        attachment
                            ? $t(`点击下载${typeText[type]}报告`)
                            : $t(`暂无${typeText[type]}报告`)
                    }}
                </div>
            </template>
        </el-upload>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    ElMessage,
    ElMessageBox,
    UploadFile,
    UploadFiles,
    UploadUserFile,
    genFileId,
} from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import axios from '@/utils/axios';
import { useI18n } from 'vue-i18n';
import { Attachment } from '../utils/interfaces';
import { useUserStore } from '@/store/user';

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

const userStore = useUserStore();

const typeText = ref<Record<number, string>>({
    0: '开题',
    1: '结题',
});

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    projectId: number;
    attachment: Attachment | null;
    type: number;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
}>();

const fileList = ref<UploadUserFile[]>([]);

// 文件超出时的钩子
const upload = ref<UploadInstance>();
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
};
// 上传附件
const submitUpload = () => {
    upload.value!.submit();
};

// 关闭弹窗
const handleClose = () => {
    emit('update:visible', false);

    // 重置表单和上传文件列表
    setTimeout(() => {
        fileList.value = [];
    }, 500);
};

// 上传成功
const handleSuccess = async (
    response: any,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
) => {
    console.log({ response, uploadFile, uploadFiles });

    let res: any;
    if (props.attachment) {
        // 更新
        res = await axios.patch(`/project-attachment/${props.attachment.id}`, {
            storagePath: response.filename,
            name: response.originalname,
        });
    } else {
        // 新增
        res = await axios.post('/project-attachment', {
            projectId: props.projectId,
            storagePath: response.filename,
            name: response.originalname,
            type: props.type,
        });
    }

    if (res.status !== 201 && res.affected === !1) {
        ElMessage({
            message: t('Operation Failed'),
            type: 'error',
        });
        return;
    }

    // 添加成功, 弹窗提示
    ElMessage({
        message: t('Operation Successfully'),
        type: 'success',
    });
    handleClose();
};

// 监听 props.attachment 变化
watch(
    () => props.attachment,
    (newVal) => {
        if (newVal) {
            fileList.value = [
                {
                    name: newVal.name,
                    url: newVal.storagePath,
                },
            ];
        }
    },
    {
        immediate: true,
    },
);

const handlePreview = async (file: UploadFile) => {
    if (file.url) {
        // 已上传, 点击下载
        const id = props.attachment?.id; // 附件id
        const res: any = await axios.get(`/project-attachment/download/${id}`, {
            responseType: 'blob',
        });

        // 创建一个 URL 对象，指向 blob 对象
        let url = window.URL.createObjectURL(res);

        // 创建一个 a 标签，设置 href 属性为 URL 对象，设置 download 属性为文件名
        let link = document.createElement('a');
        link.href = url;
        link.download = props.attachment?.name as string;

        // 将 a 标签添加到文档中
        document.body.appendChild(link);

        // 触发 a 标签的点击事件，下载文件
        link.click();

        // 移除 a 标签
        document.body.removeChild(link);

        // 释放 URL 对象
        window.URL.revokeObjectURL(url);
    } else {
        // 未上传, 点击没有反应
    }
};
</script>

<style lang="scss" scoped>
.upload-demo {
    margin-top: -30px;
}
</style>
