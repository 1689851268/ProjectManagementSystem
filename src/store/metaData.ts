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
        getAchievementTypes: (state) => state.achievementTypes,
        getColleges: (state) => state.colleges,
        getIdentities: (state) => state.identities,
        getMajors: (state) => state.majors,
        getProjectStatuses: (state) => state.projectStatuses,
        getProjectTypes: (state) => state.projectTypes,
    },
    actions: {
        setAchievementTypes(achievementTypes: MetaData[]) {
            this.achievementTypes = achievementTypes;
        },
        setColleges(colleges: MetaData[]) {
            this.colleges = colleges;
        },
        setIdentities(identities: MetaData[]) {
            this.identities = identities;
        },
        setMajors(majors: MetaData[]) {
            this.majors = majors;
        },
        setProjectStatuses(projectStatuses: MetaData[]) {
            this.projectStatuses = projectStatuses;
        },
        setProjectTypes(projectTypes: MetaData[]) {
            this.projectTypes = projectTypes;
        },
    },
});
