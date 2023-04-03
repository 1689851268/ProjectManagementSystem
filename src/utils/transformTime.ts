/**
 * @desc 格式化时间
 * @param time 时间戳字符串
 * @returns 格式化后的时间
 * @example
 *   formatDate('1680506813294') => '2023/4/3 15:26:53'
 *   formatDate('') => '-'
 */
export const formatDate = (time: string) => {
    if (time === '') return '-';
    const localeTimeString = new Date(+time).toLocaleTimeString();
    return localeTimeString;
};
