import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 获取环境变量
    const root = process.cwd();
    const { VITE_PORT } = loadEnv(mode, root);

    return {
        plugins: [
            vue(),
            AutoImport({
                // 自动导入 Element Plus 相关函数, 如: ElMessage, ElMessageBox... (带样式)
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                // 自动注册 Element Plus 相关组件
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
        },
    };
});
