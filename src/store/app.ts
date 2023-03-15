import { defineStore } from 'pinia';

import { SYS_LANGUAGE } from '@/common/enum';

export const useAppStore = defineStore('app', {
    state: () => ({
        language: '' as SYS_LANGUAGE,
    }),
});
