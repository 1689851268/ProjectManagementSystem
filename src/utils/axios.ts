import axios from 'axios';

// 在 Ts 文件中获取环境变量
const { VITE_AXIOS_TIMEOUT, VITE_AXIOS_BASEURL } = import.meta.env;

const instance = axios.create({
    baseURL: VITE_AXIOS_BASEURL,
    timeout: VITE_AXIOS_TIMEOUT,
});

// 请求拦截器
instance.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数
        if (response.status === 200) {
            return response.data;
        }
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;
