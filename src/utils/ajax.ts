import { router } from '@/router';
import { useUserStore } from '@/store/modules/user';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 在 Ts 文件中获取环境变量
const { VITE_AXIOS_TIMEOUT, VITE_AXIOS_BASEURL } = import.meta.env;

const ajax = axios.create({
    baseURL: VITE_AXIOS_BASEURL,
    timeout: VITE_AXIOS_TIMEOUT,
});

const userStore = useUserStore();

// 请求拦截器
ajax.interceptors.request.use(
    function (config) {
        // 如果 token 存在, 就在请求头中添加 token
        if (userStore.getToken) {
            config.headers.Authorization = `Bearer ${userStore.getToken}`;
        }
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    },
);

// 响应拦截器
ajax.interceptors.response.use(
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
        const errRes = error.response;
        console.log('errRes', errRes);

        // 未登录 / token 过期
        if (errRes.status === 401) {
            userStore.setToken(''); // 清空 token
            router.push({ name: 'Login' }); // 跳转到登录页
        }

        if (errRes.data.errno === 1451) {
            // 处理用户信息管理中, 外键约束引起的删除失败
            ElMessage.warning(errRes.data.message);
        } else {
            // 其他错误
            ElMessage.error(errRes.statusText);
        }

        return 'Request Error';
    },
);

export default ajax;
