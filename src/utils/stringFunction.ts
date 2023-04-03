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
