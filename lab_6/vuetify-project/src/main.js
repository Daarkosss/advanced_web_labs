/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';


// Composables
import { createApp } from 'vue';

const app = createApp(App)

registerPlugins(app)

app.use(router);
app.use(ToastPlugin);

app.mount('#app')

