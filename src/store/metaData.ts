import { defineStore } from 'pinia';
import { MetaData } from '@/common/interfaces';

export const useMetaDataStore = defineStore('metaData', {
    state: () => ({
        achievementTypes: [] as MetaData[],
        colleges: [] as MetaData[],
        identities: [] as MetaData[],
        majors: [] as MetaData[],
        projectStatuses: [] as MetaData[],
        projectTypes: [] as MetaData[],
    }),
    getters: {
        getIdentities: (state) => state.identities,
        getProjectTypes: (state) => state.projectTypes,
    },
    actions: {},
});
