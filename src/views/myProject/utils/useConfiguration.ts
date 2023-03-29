import { Configuration, MetaData } from '@/common/interfaces';
import { ref } from 'vue';

const useConfiguration = () => {
    // 查询表单的配置项
    const configurations = ref<Configuration[]>([
        { name: 'projectName', defaultVal: '', type: 'input' }, // 项目名称
        { name: 'college', defaultVal: '', type: 'input' }, // 所属院校
        { name: 'teacher', defaultVal: '', type: 'input' }, // 指导老师
        {
            name: 'projectType', // 项目类型
            defaultVal: '',
            type: 'select',
            options: [],
        },
        {
            name: 'projectStatus', // 项目状态
            defaultVal: '',
            type: 'select',
            options: [],
        },
    ]);

    // 初始化 configurations
    const initConfigurations = (
        newProjectTypes: MetaData[],
        newProjectStatuses: MetaData[],
    ) => {
        configurations.value[3].options = newProjectTypes.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        configurations.value[4].options = newProjectStatuses.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    };

    return {
        configurations,
        initConfigurations,
    };
};

export default useConfiguration;
