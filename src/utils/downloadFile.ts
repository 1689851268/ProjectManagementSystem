import axios from '@/utils/axios';

const downloadFile = async (url: string) => {
    return await axios({
        url,
        method: 'GET',
        responseType: 'blob', // 将响应体类型设置为 Blob 对象
    }).then((response) => {
        const blob = new Blob([response.data], {
            type: response.headers['content-type'],
        });
        return blob;
    });
};

const downloadLink = document.createElement('a');

const download = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
};

const handleDownload = () => {
    const url = 'https://example.com/attachment.pdf';
    downloadFile(url).then((blob) => {
        download(blob, 'attachment.pdf');
    });
};
