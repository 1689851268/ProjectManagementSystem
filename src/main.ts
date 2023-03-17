import { createApp } from 'vue';
import App from '@/App.vue';
import i18n from '@/locales/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import '@/styles/global.scss';

function bootstrap() {
    const app = createApp(App);

    // element-plus icons
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }

    // i18n
    app.use(i18n);

    // router
    setupRouter(app);

    // store
    setupStore(app);

    app.mount('#app');
}

bootstrap();
