import { ROW_CLICKED } from '../constants';

const initialState = {
	cryptocurrency: null
}

export default function tableReducer(state = initialState, action) {
    switch (action.type) {
        case `${ROW_CLICKED}`:
            return {
                ...state,
                cryptocurrency: action.payload
            }
        default:
            return state;
    }
}