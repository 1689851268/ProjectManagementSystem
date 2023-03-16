import { createI18n } from 'vue-i18n';

import zh from '@/locales/lang/zh';
import en from '@/locales/lang/en';
import { localCache } from '@/utils/cache';
import { SYS_CONFIG, SYS_LANGUAGE } from '@/common/enum';

/**
 * 获取当前要展示的语言. 值为之前用户的语言选择, 从浏览器缓存中获取.
 * 如果缓存中没有数据, 则通过 navigator.language 获取浏览器使用的语言
 */
export function getCurLanguage(): SYS_LANGUAGE {
    const chooseLanguage = localCache.getItem(SYS_CONFIG.Language);
    if (chooseLanguage) {
        return chooseLanguage as SYS_LANGUAGE;
    }

    // 缓存中没有数据, 通过 navigator.language 获取浏览器使用的语言
    const navLanguage = navigator.language.toLowerCase();
    const locales = [SYS_LANGUAGE.En, SYS_LANGUAGE.Zh];
    for (const locale of locales) {
        if (navLanguage.indexOf(locale) > -1) {
            return locale;
        }
    }
    return SYS_LANGUAGE.Zh;
}

const i18n = createI18n({
    legacy: false, // 是否兼容 Vue2, 默认为 true; 如果使用 Composition API 则需要定义为 false, 否则会抛出错误
    locale: getCurLanguage(), // 当前要展示的语言
    // 不同语言对应的翻译文件
    messages: {
        [SYS_LANGUAGE.Zh]: zh,
        [SYS_LANGUAGE.En]: en,
    },
});
export default i18n;
