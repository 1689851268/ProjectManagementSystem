import { Configuration, MetaData } from '@/common/interfaces';
import { ref } from 'vue';

const useConfiguration = () => {
    // 查询表单的配置项
    const configurations = ref<Configuration[]>([
        { name: 'uuid', defaultVal: '', type: 'input' }, // uuid
        { name: 'name', defaultVal: '', type: 'input' }, // 用户名称
        {
            name: 'identity', // 用户身份
            defaultVal: 1,
            clearable: false,
            type: 'select',
            options: [],
        },
    ]);

    // 初始化 configurations
    const initConfigurations = (newIdentities: MetaData[]) => {
        configurations.value[2].options = newIdentities.map((item) => ({
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
