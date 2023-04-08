/**
 * @example
 * splitCamelCase('abcDef') -→ 'abc Def'
 * splitCamelCase('AbcDef') -→ 'Abc Def'
 */
export const splitCamelCase = (str: string) => {
    return str.replace(/([A-Z])/g, ' $1').trim();
};

/**
 * @desc 首字母大写
 */
export const capitalize = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};

/**
 * @desc 格式化时间
 * @param time 时间戳字符串
 * @returns 格式化后的时间
 * @example
 *   formatDate('1680506813294') => '2023/4/3 15:26:53'
 *   formatDate('') => '-'
 */
export const formatDate = (time: string): string => {
    if (!time) return '-';
    return new Date(+time).toLocaleTimeString();
};
