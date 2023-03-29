import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        identity: 0,
        uuid: '',
        id: 0,
        name: '',
    }),
    getters: {
        getToken: (state) => state.token,
        getIdentity: (state) => state.identity,
        getUuid: (state) => state.uuid,
        getId: (state) => state.id,
        getName: (state) => state.name,
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setIdentity(identity: number) {
            this.identity = identity;
        },
        setUuid(uuid: string) {
            this.uuid = uuid;
        },
        setId(id: number) {
            this.id = id;
        },
        setName(name: string) {
            this.name = name;
        },
    },
    persist: {
        paths: ['token'],
    }, // 页面刷新时, 数据会从 localStorage 中读取;  更新数据时, 会自动更新 localStorage 中的数据
});
