import createRemoteActions from '../../utils/createRemoteActions';
import { error } from '../../appActions';
//import { getIdeas } from '../ideas/ideasActions';
import request from '../../utils/request';

export const constants = {
	...createRemoteActions([
		'TOPICS_FETCH',
		'TOPIC_FETCH',
		'TOPICS_EDIT',
		'TOPICS_REMOVE',
		'TOPICS_ADD'
	]),
	'TOPICS_LOADING': 'TOPICS_LOADING',
	'TOPICS_CHANGE': 'TOPICS_CHANGE'
};

export function loading(isLoading){
	return {
		type: constants.TOPICS_LOADING,
		payload: isLoading
	}
};

export function onChange(data) {
	return {
		type: constants.TOPICS_CHANGE,
		payload: {
			data
		}
	}
}

export function removeTopic(id){
	return dispatch => {
		request('Topics')
			.delete({ id })
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPICS_REMOVE_SUCCESS,
					payload: {
						id
					}
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function newTopic(title, description){
	return dispatch => {
		request('Topics')
			.post({
				title,
				description
			})
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPICS_ADD_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function rateTopic(id, value){
	return dispatch => {
		request('TopicsRate')
			.post({
				id,
				value
			})
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPICS_EDIT_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function saveTopic(id){
	return (dispatch, getState) => {
		const st = getState();
		const topic = st.topics.currentTopic;


		request('Topics', { id })
			.post(topic)
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.TOPICS_EDIT_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
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