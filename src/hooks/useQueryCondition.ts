import { ref } from 'vue';

/**
 * @description 查询条件的 hook
 * @param defaultQueryCondition 默认查询条件
 */
const useQueryCondition = (defaultQueryCondition: any) => {
    const queryCondition = ref({ ...defaultQueryCondition });

    const setQueryCondition = (newQueryCondition: any) => {
        queryCondition.value = {
            ...queryCondition.value,
            ...newQueryCondition,
        };
        console.log('queryCondition', queryCondition.value);
        console.log('defaultQueryCondition', defaultQueryCondition);
    };

    const resetQueryCondition = () => {
        queryCondition.value = { ...defaultQueryCondition };
        console.log('queryCondition', queryCondition.value);
        console.log('defaultQueryCondition', defaultQueryCondition);
    };

    return { queryCondition, setQueryCondition, resetQueryCondition };
};

export default useQueryCondition;
