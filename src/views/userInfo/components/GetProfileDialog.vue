<template>
    <el-dialog
        :title="$t('User Info')"
        width="25%"
        :model-value="visible"
        :before-close="handleClose"
        align-center
    >
        <ul class="user-info">
            <li>{{ $t('Identity') }}：{{ curIdentity }}</li>
            <li>{{ $t('Account') }}：{{ userProfile?.uuid }}</li>
            <li>{{ $t('Name') }}：{{ userProfile?.name }}</li>
            <li>
                {{ $t('Registration Time') }}：
                {{ userProfile?.registrationTime }}
            </li>
            <li>{{ $t('Email') }}：{{ userProfile?.email || '-' }}</li>
            <li>{{ $t('Phone') }}：{{ userProfile?.phone || '-' }}</li>
            <template v-if="identity === 1 || identity === 2">
                <li>{{ $t('College') }}：{{ userProfile?.college?.name }}</li>
            </template>
            <template v-if="identity === 1">
                <li>{{ $t('Major') }}：{{ userProfile?.major?.name }}</li>
                <li>{{ $t('Class') }}：{{ userProfile?.class }}</li>
            </template>
        </ul>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose"> {{ $t('Close') }} </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { MetaData } from '@/common/interfaces';
import { useMetaDataStore } from '@/store/metaData';
import { computed, ref } from 'vue';
import { UserProfile } from '../utils/interfaces';

const props = defineProps<{
    visible: boolean;
    userProfile: UserProfile | null;
    identity: number;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
}>();

// 关闭弹窗
const handleClose = () => {
    emit('update:visible', false);
};

// 监听元数据变化, 更新用户身份
const identities = ref<MetaData[]>([]); // 用户身份
const metaDataStore = useMetaDataStore();
metaDataStore.$subscribe(
    (_, state) => {
        identities.value = state.identities;
    },
    { immediate: true },
);

// 当前用户身份
const curIdentity = computed(() => {
    return identities.value.find((item) => {
        return item.id === props.identity;
    })?.name;
});
</script>

<style scoped lang="scss">
.user-info {
    li {
        margin: 10px 0;
        font-size: 16px;
    }
}
</style>
