<template>
    <LanguageConfig class="float-right" />
    <el-config-provider :locale="curLocale">
        <router-view></router-view>
    </el-config-provider>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue';
import zh from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';

import { useAppStore } from '@/store/app';
import { SYS_LANGUAGE } from '@/common/enum';
import { getLanguage } from '@/locales';
import LanguageConfig from '@/components/LanguageConfig.vue';

const appStore = useAppStore();

const init = () => {
    const language = getLanguage();
    appStore.language = language;
};
init();

const elementLanguage = {
    [SYS_LANGUAGE.Zh]: zh,
    [SYS_LANGUAGE.En]: en,
};

const curLocale = computed(() => {
    return elementLanguage[appStore.language];
});
</script>
