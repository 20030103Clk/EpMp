import App from './App'
import store from './store'


// #ifdef VUE2
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia';
import Vuex from "vuex";


export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.use(Pinia.createPinia());
	return {
		app,
		Vuex, // 如果 nvue 使用 vuex 的各种map工具方法时，必须 return Vuex
		Pinia, // 此处必须将 Pinia 返回
	}
}
// #endif
