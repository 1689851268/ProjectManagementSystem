import { MetaData } from '@/common/interfaces';
import { ref } from 'vue';

/**
 * 项目大厅的元数据
 * @returns projectHallMetaData - 项目大厅的元数据
 * @returns initProjectHallMetaData - 用于初始化 projectHallMetaData
 */
const useProjectHallMetaData = () => {
    const projectHallMetaData = ref<{
        projectTypes: Record<number, string>;
        projectStatuses: Record<number, string>;
    }>({
        projectTypes: {}, // 项目类型的元数据
        projectStatuses: {}, // 项目状态的元数据
    });

    // 初始化 projectHallMetaData
    const initProjectHallMetaData = (
        newProjectTypes: MetaData[],
        newProjectStatuses: MetaData[],
    ) => {
        projectHallMetaData.value.projectTypes = newProjectTypes.reduce(
            (prev, cur) => ({ ...prev, [cur.id]: cur.name }),
            {},
        );
        projectHallMetaData.value.projectStatuses = newProjectStatuses.reduce(
            (prev, cur) => ({ ...prev, [cur.id]: cur.name }),
            {},
        );
    };

    return {
        projectHallMetaData,
        initProjectHallMetaData,
    };
};

export default useProjectHallMetaData;
