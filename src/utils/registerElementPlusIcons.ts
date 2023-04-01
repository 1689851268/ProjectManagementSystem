import { App } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

/**
 * 注册 element-plus icons
 * @param app Vue app
 */
export function registerElementPlusIcons(app: App<Element>) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }
}
