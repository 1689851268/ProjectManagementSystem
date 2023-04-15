import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ mode }) => {
    // 获取环境变量
    const envDir = process.cwd();
    const { VITE_PORT } = loadEnv(mode, envDir);

    return {
        plugins: [
            vue(),
            Components({
                // 自动导入和注册 Element Plus 的函数和组件
                resolvers: [ElementPlusResolver()],
            }),
        ],
        server: {
            port: +VITE_PORT,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/styles/variable.scss";', // 全局引入 scss 变量
                },
            },
            devSourcemap: true,
        },
    };
});
