import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var state = {
	count:20
}
 
const getters = {
	count(state){
		return state.count
	}
}
const mutations = {
	numup(state){
		state.count++
	},
	numdown(state){
		state.count--
	}
}
const actions = {
	numup : ({
		commit
	}) => {
		commit('numup')
	},
	numdown : ({
		commit
	}) => {
		commit('numdown')
	},
}
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
