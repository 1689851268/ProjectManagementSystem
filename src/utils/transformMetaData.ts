import { MetaData } from '@/common/interfaces';

/**
 * @desc 转换元数据的格式; 将 { id: number, name: string }[] 转换为 { [id: number]: string }
 * @param metaData 元数据
 * @returns 转换后的元数据
 * @examples [{ id: 1, name: '项目类型1' }, { id: 2, name: '项目类型2' }]  -→  { 1: '项目类型1', 2: '项目类型2' }
 */
export const transformMetaData = (metaData: MetaData[]) => {
    return metaData.reduce(
        (prev, cur) => ({ ...prev, [cur.id]: cur.name }),
        {},
    ) as Record<number, string>;
};
