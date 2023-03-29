import { createPinia } from 'pinia';
import { App } from 'vue';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(piniaPluginPersistedstate); // 数据持久化

export function setupStore(app: App<Element>) {
    app.use(store);
}
