import { ref } from 'vue';
import { Configuration } from '@/views/notification/interfaces';

/**
 * @desc 查询条件钩子
 * @param configurations 表单配置
 */
const useQueryCondition = (configurations: Configuration[]) => {
    // 获取默认的查询条件;  用于初始化查询条件 & 重置查询条件
    const defaultQueryCondition = configurations.reduce(
        (defaultQueryCondition: any, configuration: Configuration) => {
            return {
                ...defaultQueryCondition,
                [configuration.name]: configuration.defaultVal,
            };
        },
        {},
    );

    // 查询条件
    const queryCondition = ref({ ...defaultQueryCondition });

    /**
     * @desc 设置查询条件
     * @param newQueryCondition 新的查询条件
     */
    const setQueryCondition = (newQueryCondition: any) => {
        queryCondition.value = {
            ...queryCondition.value,
            ...newQueryCondition,
        };
        console.log('queryCondition', queryCondition.value);
        console.log('defaultQueryCondition', defaultQueryCondition);
    };

    /**
     * @desc 重置查询条件
     */
    const resetQueryCondition = () => {
        queryCondition.value = { ...defaultQueryCondition };
        console.log('queryCondition', queryCondition.value);
        console.log('defaultQueryCondition', defaultQueryCondition);
    };

    return { queryCondition, setQueryCondition, resetQueryCondition };
};

export default useQueryCondition;
