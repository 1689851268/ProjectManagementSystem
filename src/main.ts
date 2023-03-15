import { createApp } from 'vue';
import App from '@/App.vue';
import i18n from '@/lang/index';

import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import '@/styles/global.scss';

function bootstrap() {
    const app = createApp(App);

    // i18n
    app.use(i18n);

    // router
    setupRouter(app);

    // store
    setupStore(app);

    app.mount('#app');
}

bootstrap();
