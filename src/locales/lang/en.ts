import zh from './zh';

/**
 * 将对象中的 key 作为 value, key 作为 key, 生成一个新的对象
 * @example
 *   transformKeyAsValue({ 'Account': '账号' }) => { 'Account': 'Account' }
 */
const transformKeyAsValue = (obj: any) => {
    return Object.keys(obj).reduce((pre, cur) => {
        return { [cur]: cur, ...pre };
    }, {});
};

const en = transformKeyAsValue(zh);

export default en;
