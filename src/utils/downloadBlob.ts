export const downloadBlob = (blob: Blob, filename: string) => {
    // 创建一个 URL 对象，指向 blob 对象
    let url = window.URL.createObjectURL(blob);

    // 创建一个 a 标签，设置 href 属性为 URL 对象，设置 download 属性为文件名
    let link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // 将 a 标签添加到文档中
    document.body.appendChild(link);

    // 触发 a 标签的点击事件，下载文件
    link.click();

    // 移除 a 标签
    document.body.removeChild(link);

    // 释放 URL 对象
    window.URL.revokeObjectURL(url);
};
