import zh from './zh';

const en = Object.keys(zh).reduce((pre, cur) => {
    return { [cur]: cur, ...pre };
}, {});

export default en;
