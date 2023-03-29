import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
    }),
    getters: {
        getToken: (state) => state.token,
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
    },
    persist: true, // 页面刷新时, 数据会从 localStorage 中读取;  更新数据时, 会自动更新 localStorage 中的数据
});
