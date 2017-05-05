import * as type from './type'

export default {
	numup:({
		commit
	})=>{
		commit(type.NUMUP);
	},
	numdown:({
		commit
	})=>{
		commit(type.NUMDOWN);
	}
}
