import { createStore } from 'redux'

const initialState = {
  authLogin : "",
}

const reducer = (state = initialState, action) => {
	if(action.type==="CHANGE_STATE"){
		if(action.payload.modulState)
			state.modulState = action.payload.modulState;
	}
	
    return state
}

const storeLogin = createStore(reducer)


export {storeLogin}