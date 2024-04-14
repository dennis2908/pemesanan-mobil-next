import { createStore } from 'redux'

const initialState = {
  menu : '',
}

const reducer = (state = initialState, action) => {
	
	
	if(action.type==="CHANGE_STATE"){
		if(action.payload.addmenu){
			state.menu = action.payload.addmenu;
		}	
		
	}
	
    return state
}

const storeMenu = createStore(reducer)


export {storeMenu}