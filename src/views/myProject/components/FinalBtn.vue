<template>
    <div>
        <el-button class="m-5" size="small" @click="handleAgree">
            {{ $t('Agree the conclusion') }}
        </el-button>

        <el-button class="m-5" size="small" @click="handleReject">
            {{ $t('Reject the conclusion') }}
        </el-button>
    </div>
</template>

<script setup lang="ts">
import usePatchUpdate from '@/utils/usePatchUpdate';

const props = defineProps<{
    projectId: number;
}>();

const emits = defineEmits<{
    (event: 'initProjectHall'): void;
}>();

const handleAgree = async () => {
    const tips = 'Are you sure you want to allow the conclusion?';
    const url = '/project/allowClose';
    const params = {
        projectId: props.projectId,
    };
    const cb = () => {
        emits('initProjectHall');
    };

    await usePatchUpdate(tips, url, params, cb);
};

const handleReject = async () => {
    const tips = 'Are you sure you want to reject the conclusion?';
    const url = '/project/invalidate';
    const params = {
        projectId: props.projectId,
    };
    const cb = () => {
        emits('initProjectHall');
    };

    await usePatchUpdate(tips, url, params, cb);
};
</script>
