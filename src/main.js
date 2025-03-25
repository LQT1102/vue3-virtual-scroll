import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);
app.use(VirtualScroller);
app.mount("#app");
