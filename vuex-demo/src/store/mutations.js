import {NUMUP,NUMDOWN} from './type'
import getters from './getters'

const state ={
	count :20
}

const mutations = {
	[NUMUP](state){
		state.count++;
	},
	[NUMDOWN](state){
		state.count--;
	}
}

export default {
	state,
	mutations,
	getters
}
