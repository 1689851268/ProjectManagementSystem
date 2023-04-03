import i18n from '@/locales';
import { ElMessage } from 'element-plus';
import ajax from './ajax';
import { ElMessageBoxConfirm } from './domHandler';

const { t } = i18n.global;

const usePatchUpdate = async (
    tips: string,
    url: string,
    params: any,
    cb: any,
) => {
    // 弹窗提示用户是否继续
    const isSure = await ElMessageBoxConfirm(t(tips));

    // 如果用户取消, 则不进行后续操作
    if (!isSure) {
        ElMessage({
            type: 'info',
            message: t('Canceled'),
        });
        return;
    }

    // 发请求更新 project 表: status-6, rejectTime-当前时间
    const res: any = await ajax.patch(url, {
        ...params,
    });

    // 操作失败, 则不进行后续操作
    if (res.affected !== 1) {
        ElMessage({
            type: 'error',
            message: t('Operation failed'),
        });
        return;
    }

    // 操作成功后, 重新获取项目列表
    ElMessage({
        type: 'success',
        message: t('Operation success'),
    });
    cb();
};

export default usePatchUpdate;
