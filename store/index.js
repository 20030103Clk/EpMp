// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({})
// #endif

// #ifdef VUE3
import { createStore } from 'vuex';
const store = createStore({
// #endif
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null,
		userInfo: null
	},
	mutations: {
		login(state, userInfo) {
			state.hasLogin = true;
			state.userInfo = userInfo;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
			state.userInfo = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		}
	},
	getters: {
		isLoggedIn(state) {
			return state.hasLogin
		},
		currentUser(state) {
			return state.userInfo
		}
	},
	actions: {
		// 登录
		login(context, userInfo) {
			context.commit('login', userInfo)
		},
		// 退出登录
		logout(context) {
			context.commit('logout')
		}
	}
})

export default store
