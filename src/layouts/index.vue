<template>
    <el-container class="h-full">
        <!-- 侧边栏 -->
        <AppSidebar />

        <!-- 内容 -->
        <el-container class="flex-direction-column">
            <AppHeader :uuid="getUuid" />
            <AppMain />
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';

import ajax from '@/utils/ajax';
import { useMetaDataStore } from '@/store/modules/metaData';
import { MetaData } from '@/common/interfaces';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const metaDataStore = useMetaDataStore();
const { getUuid } = storeToRefs(userStore);

interface MetaDataResponse {
    achievementTypes: MetaData[];
    colleges: MetaData[];
    identities: MetaData[];
    majors: MetaData[];
    projectStatuses: MetaData[];
    projectTypes: MetaData[];
}

interface UserResponse {
    uuid: string;
    identity: number;
    id: number;
    name: string;
}

// 获取元数据, 并存储到 metaDataStore 中
const getMetaData = async () => {
    // 将元数据存储到 store 中
    const metaData: MetaDataResponse = await ajax.get('/meta-data');
    metaDataStore.$patch(metaData);

    // 将用户信息存储到 store 中
    const user: UserResponse = await ajax.get('/user/identity');
    userStore.setIdentity(user.identity);
    userStore.setUuid(user.uuid);
    userStore.setId(user.id);
    userStore.setName(user.name);
};
getMetaData();
</script>
