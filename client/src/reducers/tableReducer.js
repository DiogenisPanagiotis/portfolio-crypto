import { ROW_CLICKED, HANDLE_CRYPTOCURRENCY_VALUE, TOGGLE_INVALID_VALUE } from '../constants';

const initialState = {
	cryptocurrency: null,
    cryptocurrencyValue: '',
    invalid: false
}

export default function tableReducer(state = initialState, action) {
    switch (action.type) {
        case `${ROW_CLICKED}`:
            return {
                ...state,
                cryptocurrency: action.payload
            }
        case `${HANDLE_CRYPTOCURRENCY_VALUE}`:
            return {
                ...state,
                invalid: false,
                cryptocurrencyValue: action.payload
            }
        case `${TOGGLE_INVALID_VALUE}`:
            return {
                ...state,
                invalid: action.payload
            }
        default:
            return state;
    }
}