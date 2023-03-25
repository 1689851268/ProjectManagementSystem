<template>
    <el-container class="h-full">
        <!-- 侧边栏 -->
        <AppSidebar />

        <!-- 内容 -->
        <el-container class="flex-direction-column">
            <AppHeader />
            <AppMain />
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import AppMain from './AppMain.vue';

import axios from '@/utils/axios';
import { useMetaDataStore } from '@/store/metaData';
import { MetaData } from '@/common/interfaces';

interface MetaDataResponse {
    achievementTypes: MetaData[];
    colleges: MetaData[];
    identities: MetaData[];
    majors: MetaData[];
    projectStatuses: MetaData[];
    projectTypes: MetaData[];
}

// 获取元数据, 并存储到 metaDataStore 中
const getMetaData = async () => {
    const metaData: MetaDataResponse = await axios.get('/meta-data');

    // 将元数据存储到 store 中
    const metaDataStore = useMetaDataStore();
    metaDataStore.$patch(metaData);
};
getMetaData();
</script>
