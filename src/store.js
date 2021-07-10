import Vue from 'vue'
import Vuex from 'vuex'
import jwt from "jsonwebtoken";

const config = require('./config');
Vue.use(Vuex)

const state = {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || [],
    sensor: JSON.parse(localStorage.getItem('sensor')) || [],
    fbInitData: {},
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || [],
}

export default new Vuex.Store({
    state,
    mutations: {
        toggleSidebarDesktop(state) {
            const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
            state.sidebarShow = sidebarOpened ? false : 'responsive'
        },
        toggleSidebarMobile(state) {
            const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
            state.sidebarShow = sidebarClosed ? true : 'responsive'
        },
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, token) {
            state.status = 'success'
            state.token = token
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
        },
        INIT_FIREBASE(state, fbInitData) {
            for (const key of Object.keys(fbInitData)) {
                Vue.set(state.fbInitData, key, fbInitData[key]);
            }
        },
        INIT_ACCOUNT(state, accountDetails) {
            state.user = accountDetails
        },
        INIT_SENSOR(state, sensors) {
            state.sensor = sensors
        },
        SET_CURRENT_USER(state, userAccount){
            // Vue.set(state, "currentUser", userAccount)
            state.currentUser = userAccount
        },
        set(state, [variable, value]) {
            state[variable] = value
        }
    },
    actions: {
        login({commit, state}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                const userAccount = state.user.find(u => u.email == user.email);
                if (userAccount && userAccount.password === user.password) {
                    let token = jwt.sign({name: user.email}, config.secret, {expiresIn: 86400})
                    localStorage.setItem('token', token)
                    commit('auth_success', token)
                    localStorage.setItem('currentUser', JSON.stringify(userAccount))
                    commit('SET_CURRENT_USER', userAccount)
                    resolve()
                } else {
                    commit('auth_error')
                    alert("User not existed or wrong credentials given")
                    localStorage.removeItem('token')
                    reject()
                }
            })
        },
        logout({commit}) {
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('token')
                resolve()
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        getAllDataFromFirebase: (state) => {
            return state;
        },
        getFirebaseSensor: (state) => {
            return state.sensor
        },
        getCurrentUser: (state) => {
            return state.currentUser
        },
    }
})