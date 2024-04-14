import { createStore } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'

const initialState = {
  authLogin : "",
}

const reducer = persistReducer(state = initialState, action) => {
	if(action.type==="CHANGE_STATE"){
		if(action.payload.authLogin)
			state.authLogin = action.payload.authLogin;
	}
	
    return state
}

let storeLogin = createStore(reducer)

let persistorLogin = persistStore(storeLogin)


export {storeLogin}