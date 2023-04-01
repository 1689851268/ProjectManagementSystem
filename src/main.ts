// Vue & Libraries
import { createApp } from 'vue';
import i18n from '@/locales/index';

// Components
import App from '@/App.vue';

// Router & Store
import { setupRouter } from '@/router';
import { setupStore } from '@/store';

// Utils
import { registerElementPlusIcons } from '@/utils/registerElementPlusIcons';

// Styles
import '@/styles/global.scss';
import 'element-plus/dist/index.css';

function bootstrap() {
    const app = createApp(App);

    // element-plus icons
    registerElementPlusIcons(app);

    // i18n
    app.use(i18n);

    // router
    setupRouter(app);

    // store
    setupStore(app);

    app.mount('#app');
}
bootstrap();
