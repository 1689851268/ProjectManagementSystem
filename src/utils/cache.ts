import { SYS_CONFIG } from '@/common/enum';

export const localCache = {
    /**
     * 根据 key 获取 localStorage.
     * 若无该 key, 则返回 null
     */
    getItem(key: SYS_CONFIG) {
        return localStorage.getItem(key);
    },

    /**
     * 根据 key-value 设置 localStorage
     */
    setItem(key: SYS_CONFIG, value: string) {
        localStorage.setItem(key, value);
    },
};
