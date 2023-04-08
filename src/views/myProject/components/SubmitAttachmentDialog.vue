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
import { useI18n } from 'vue-i18n';
import {
    ElMessage,
    UploadFile,
    UploadFiles,
    UploadUserFile,
    genFileId,
} from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

import ajax from '@/utils/ajax';
import { useUserStore } from '@/store/user';
import { Attachment } from '../utils/interfaces';
import { downloadBlob } from '@/utils/downloadBlob';

const userStore = useUserStore();
const { t } = useI18n();

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

const typeText = ref<Record<number, string>>({
    0: '开题',
    1: '结题',
});

const props = defineProps<{
    visible: boolean;
    projectId: number;
    attachment: Attachment | null;
    type: number;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
}>();

// 上传文件列表
const fileList = ref<UploadUserFile[]>([]);

const upload = ref<UploadInstance>();
// 文件超出时的钩子
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
        res = await ajax.patch(`/project-attachment/${props.attachment.id}`, {
            storagePath: response.filename,
            name: response.originalname,
        });
    } else {
        // 新增
        res = await ajax.post('/project-attachment', {
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

// 点击文件列表中已上传的文件时的钩子
const handlePreview = async (file: UploadFile) => {
    // 如果未上传, 则没有反应
    if (!file.url) {
        return;
    }

    // 如果已上传, 则获取资源并下载
    const id = props.attachment?.id; // 附件id
    const res: any = await ajax.get(`/project-attachment/download/${id}`, {
        responseType: 'blob',
    });
    downloadBlob(res, props.attachment?.name as string);
};
</script>

<style lang="scss" scoped>
.upload-demo {
    margin-top: -30px;
}
</style>
