import { MetaData } from '@/common/interfaces';
import { ref } from 'vue';

const useMetaData = (prop: string) => {
    // 元数据
    const metaData = ref<{ [key: string]: { [key: number]: string } }>({
        [prop]: {},
    });

    // 初始化 metaData
    const initMetaData = (newMetaData: MetaData[]) => {
        metaData.value[prop] = newMetaData.reduce(
            (prev, cur) => ({ ...prev, [cur.id]: cur.name }),
            {},
        );
    };

    return {
        metaData,
        initMetaData,
    };
};

export default useMetaData;
