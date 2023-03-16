import { defineStore } from 'pinia';

import { SYS_LANGUAGE } from '@/common/enum';

export const useAppStore = defineStore('app', {
    state: () => ({
        sysLanguage: '' as SYS_LANGUAGE,
        menuCollapsed: false,
    }),
    getters: {
        getSysLanguage: (state) => state.sysLanguage,
        getMenuCollapsed: (state) => state.menuCollapsed,
    },
    actions: {
        setSysLanguage(sysLanguage: SYS_LANGUAGE) {
            this.sysLanguage = sysLanguage;
        },
        toggleMenuCollapsed() {
            this.menuCollapsed = !this.menuCollapsed;
        },
    },
});
