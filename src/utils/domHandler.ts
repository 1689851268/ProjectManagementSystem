import { unref } from 'vue';
import type { Ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import i18n from '@/locales/index';

const { t } = i18n.global;

/**
 * 使元素滚动到顶部
 * @param el 元素
 */
export const scrollToTop = (
    el: HTMLElement | undefined | Ref<HTMLElement | undefined>,
) => {
    unref(el)?.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * 弹窗提示用户是否删除
 * @param tips 提示信息
 * @returns 用户是否删除
 */
export const ElMessageBoxConfirm = async (tips: string) => {
    const deletion = await ElMessageBox.confirm(tips, {
        confirmButtonText: t('Confirm'),
        cancelButtonText: t('Cancel'),
        type: 'warning',
        closeOnClickModal: false,
    })
        .then(() => true)
        .catch(() => false);
    return deletion;
};
