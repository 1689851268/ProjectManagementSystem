import { unref } from 'vue';
import type { Ref } from 'vue';

/**
 * 使元素滚动到顶部
 * @param el 元素
 */
export const scrollToTop = (
    el: HTMLElement | undefined | Ref<HTMLElement | undefined>,
) => {
    unref(el)?.scrollTo({ top: 0, behavior: 'smooth' });
};
