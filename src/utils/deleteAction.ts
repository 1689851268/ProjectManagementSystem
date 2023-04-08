import { ElMessage } from 'element-plus';
import ajax from './ajax';
import { ElMessageBoxConfirm } from './domHandler';
import i18n from '@/locales/index';

const { t } = i18n.global;

export const handleDeleteAction = async (
    tips: string, // 删除操作的提示信息
    url: string, // ajax 请求的 url
    cb: () => void, // 删除成功, 重新请求列表数据
    config = {}, // ajax 请求的配置对象
) => {
    const deletion = await ElMessageBoxConfirm(
        t(
            'This operation will permanently delete the {item}. Do you want to continue?',
            { item: tips },
        ),
    );

    // 如果用户取消删除, 则不进行后续操作
    if (!deletion) {
        return;
    }

    // 向后端发送删除请求
    const affected: number = await ajax.delete(url, config);
    console.log('affected', affected);

    // 如果 affected 为字符串 / 0, 则表示删除失败, 不进行后续操作
    // !+0 - true;    !+1 - false;    !+'任意字符串' - true
    if (!+affected) {
        ElMessage({
            type: 'error',
            message: t('Delete Failed'),
        });
        return;
    }

    // 删除成功, 则重新请求项目列表数据
    ElMessage({
        type: 'success',
        message: t('Deleted'),
    });

    cb(); // 重新请求项目列表数据
};
