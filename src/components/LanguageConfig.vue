<template>
    <el-dropdown trigger="click">
        <el-button>
            {{ allLanguage[appStore.sysLanguage] }}
            <el-icon class="ml-5"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="toggleLanguage(SYS_LANGUAGE.Zh)">
                    {{ allLanguage[SYS_LANGUAGE.Zh] }}
                </el-dropdown-item>
                <el-dropdown-item @click="toggleLanguage(SYS_LANGUAGE.En)">
                    {{ allLanguage[SYS_LANGUAGE.En] }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ArrowDown } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

import { localCache } from '@/utils/cache';
import { useAppStore } from '@/store/modules/app';
import { SYS_CONFIG, SYS_LANGUAGE } from '@/common/enum';

const appStore = useAppStore();

const { locale } = useI18n();
const { getSysLanguage } = storeToRefs(appStore);

const allLanguage = {
    [SYS_LANGUAGE.En]: 'English',
    [SYS_LANGUAGE.Zh]: '中文',
};

const toggleLanguage = (curLanguage: SYS_LANGUAGE) => {
    if (getSysLanguage.value === curLanguage) return;

    appStore.setSysLanguage(curLanguage);
    locale.value = curLanguage;
    localCache.setItem(SYS_CONFIG.Language, curLanguage);
};
</script>
