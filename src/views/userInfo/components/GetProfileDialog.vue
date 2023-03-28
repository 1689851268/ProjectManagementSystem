<template>
    <el-dialog
        title="用户信息"
        width="25%"
        :model-value="visible"
        :before-close="handleClose"
        align-center
    >
        <ul class="user-info">
            <li>身份：{{ curIdentity }}</li>

            <li>账号：{{ userProfile?.uuid }}</li>
            <li>名称：{{ userProfile?.name }}</li>
            <li>注册时间：{{ userProfile?.registrationTime }}</li>
            <li>邮箱：{{ userProfile?.email || '-' }}</li>
            <li>手机：{{ userProfile?.phone || '-' }}</li>
            <template v-if="identity === 1 || identity === 2">
                <li>学院：{{ userProfile?.college?.name }}</li>
            </template>
            <template v-if="identity === 1">
                <li>专业：{{ userProfile?.major?.name }}</li>
                <li>班级：{{ userProfile?.class }}</li>
            </template>
        </ul>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose"> 关闭 </el-button>
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
