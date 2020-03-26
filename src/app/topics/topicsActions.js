import createRemoteActions from '../../utils/createRemoteActions';
import { error } from '../../appActions';
//import { getIdeas } from '../ideas/ideasActions';
import request from '../../utils/request';

export const constants = {
	...createRemoteActions([
		'TOPICS_FETCH',
		'TOPIC_FETCH'
	]),
	'TOPICS_LOADING': 'TOPICS_LOADING'
};

export function loading(isLoading){
	return {
		type: constants.TOPICS_LOADING,
		payload: isLoading
	}
};

export function getTopic(id) {
	return (dispatch, getState) => {
		request('Topics')
			.get({ id })
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPIC_FETCH_SUCCESS,
					payload: d.data
				});

				//dispatch(getIdeas(id));
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
}

export function getTopics(){
	return (dispatch, getState) => {
		request('Topics')
			.get()
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPICS_FETCH_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};