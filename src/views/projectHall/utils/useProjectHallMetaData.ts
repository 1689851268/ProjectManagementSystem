import { MetaData } from '@/common/interfaces';
import { ref } from 'vue';

const useProjectHallMetaData = () => {
    // 项目类型及项目状态的元数据
    const projectHallMetaData = ref<{
        projectTypes: Record<number, string>;
        projectStatuses: Record<number, string>;
    }>({
        projectTypes: {},
        projectStatuses: {},
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
