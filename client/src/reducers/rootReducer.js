import { combineReducers } from 'redux'
import userReducer from './userReducer'
import appReducer from './appReducer'
import signupReducer from './signupReducer'
import loginReducer from './loginReducer'
import cryptoReducer from './cryptoReducer'
import tableReducer from './tableReducer'

const rootReducer = combineReducers({
	appReducer,
	userReducer,
	signupReducer,
	loginReducer,
	cryptoReducer,
	tableReducer
})

export default rootReducer