<template>
    <el-config-provider :locale="curLocale">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import zh from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';

import { useAppStore } from '@/store/app';
import { SYS_LANGUAGE } from '@/common/enum';
import { getCurLanguage } from '@/locales';

const appStore = useAppStore();

const { getSysLanguage } = storeToRefs(appStore);

const init = () => {
    const curLanguage = getCurLanguage();
    appStore.setSysLanguage(curLanguage);
};
init();

const elementLanguage = {
    [SYS_LANGUAGE.Zh]: zh,
    [SYS_LANGUAGE.En]: en,
};

const curLocale = computed(() => {
    return elementLanguage[getSysLanguage];
});
</script>
