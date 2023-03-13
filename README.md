# 如何在项目中使用路径别名

1. 在 vite.config.ts 中配置路径别名:

```ts
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
```

2. 在 tsconfig.json 中配置路径别名:

```json
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"]
        }
    }
}
```

现在即可在项目中使用路径别名啦~

```ts
const routes = [
    {
        path: '/login',
        component: () => import('@/views/login.vue'), // 使用路径别名
    },
] as RouteRecordRaw[];
```

<br><br>

# Vue-Router4 中如何捕获所有路由

Vue-Router4 中需要配置自定义正则来捕获所有路由：

```ts
{
    path: "/:catchAll(.*)", // 动态参数, 配置自定义正则;  `.` 为正则中的通配符;  `*` 为正则中的量词, 表示 0 个或多个
    redirect: '/404',
}
```
