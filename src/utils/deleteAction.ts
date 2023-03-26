import { ElMessage } from 'element-plus';
import axios from './axios';
import { ElMessageBoxConfirm } from './domHandler';

export const handleDeleteAction = async (
    tips: string, // 删除操作的提示信息
    url: string, // axios 请求的 url
    cb: () => void, // 删除成功, 重新请求列表数据
    config?: any, // axios 请求配置
) => {
    const deletion = await ElMessageBoxConfirm(tips);

    // 如果用户取消删除, 则不进行后续操作
    if (!deletion) {
        ElMessage({
            type: 'info',
            message: '已取消删除',
        });
        return;
    }

    // 向后端发送删除请求
    const affected: number = await axios.delete(url, config);
    console.log('affected: ', affected);

    // 如果删除失败, 则不进行后续操作
    if (!affected) {
        ElMessage({
            type: 'error',
            message: '删除失败!',
        });
        return;
    }

    // 删除成功, 则重新请求项目列表数据
    ElMessage({
        type: 'success',
        message: '删除成功!',
    });

    cb(); // 重新请求项目列表数据
};
