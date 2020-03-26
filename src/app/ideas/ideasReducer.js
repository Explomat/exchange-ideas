import { constants } from './ideasActions';

const listReducer = (state = [], action) => {
	switch(action.type) {
		case constants.IDEAS_ADD_SUCCESS: {
			return state.concat(action.payload);
		}

		case constants.IDEAS_REMOVE_SUCCESS: {
			const id = action.id;
			return state.filter(t => t.id !== id);
		}

		case constants.IDEAS_EDIT_SUCCESS: {
			const id = action.id;
			return state.map(t => {
				if (t.id === id){
					return action.payload;
				}
				return t;
			});
		}
		default: return state;
	}
}

const topicsReducer = (state = {
	list: [],
	currentIdea: {},
	ui: {
		isLoading: false
	}
}, action) => {
	switch(action.type) {
		case constants.IDEAS_FETCH_SUCCESS: {
			return {
				...state,
				list: action.payload
			}
		}

		case constants.IDEA_FETCH_SUCCESS: {
			return {
				...state,
				currentIdea: action.payload
			}
		}

		case constants.IDEA_ADD_SUCCESS:
		case constants.IDEA_REMOVE_SUCCESS:
		case constants.IDEA_EDIT_SUCCESS: {
			return {
				...state,
				list: listReducer(state.list, action)
			}
		}

		case constants.IDEA_LOADING: {
			return {
				...state,
				ui: {
					...state.ui,
					isLoading: action.payload
				}
			}
		}

		default: return state;
	}
}

export default topicsReducer;