import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import jwt from "jsonwebtoken";
const config = require('./config');
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  status: '',
  token: localStorage.getItem('token') || '',
  user : {}
}

export default new Vuex.Store({
  state,
  mutations:{
      toggleSidebarDesktop (state) {
          const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
          state.sidebarShow = sidebarOpened ? false : 'responsive'
      },
      toggleSidebarMobile (state) {
          const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
          state.sidebarShow = sidebarClosed ? true : 'responsive'
      },
      auth_request(state){
          state.status = 'loading'
      },
      auth_success(state, token, user){
          state.status = 'success'
          state.token = token
          state.user = user
      },
      auth_error(state){
          state.status = 'error'
      },
      logout(state){
          state.status = ''
          state.token = ''
      },
      set (state, [variable, value]) {
          state[variable] = value
      }
  },
  actions: {
      login({commit}, user){
          return new Promise((resolve, reject) => {
              commit('auth_request')
              if (user.email === "admin" && user.password === "admin"){
                  let token = jwt.sign({ name: user.email }, config.secret, { expiresIn: 86400 // expires in 24 hours
                  })
                  console.log(token)
                  localStorage.setItem('token', token)
                  axios.defaults.headers.common['Authorization'] = token
                  commit('auth_success', token, user)
                  resolve()
              }
              else{
                  commit('auth_error')
                  alert("User not existed or wrong credentials given")
                  localStorage.removeItem('token')
                  reject()
              }


              // axios({url: 'http://localhost:3000/login', data: user, method: 'POST' })
              //     .then(resp => {
              //         const token = resp.data.token
              //         const user = resp.data.user
              //         localStorage.setItem('token', token)
              //         axios.defaults.headers.common['Authorization'] = token
              //         commit('auth_success', token, user)
              //         resolve(resp)
              //     })
              //     .catch(err => {
              //         commit('auth_error')
              //         localStorage.removeItem('token')
              //         reject(err)
              //     })
          })
      },
      logout({commit}){
          return new Promise((resolve) => {
              commit('logout')
              localStorage.removeItem('token')
              delete axios.defaults.headers.common['Authorization']
              resolve()
          })
      }
  },
  getters: {
      isLoggedIn: state => !!state.token,
      authStatus: state => state.status,
  }
})