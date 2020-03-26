import createRemoteActions from '../../utils/createRemoteActions';
import { error } from '../../appActions';
//import { getComments } from '../comments/commentsActions';
import request from '../../utils/request';

export const constants = {
	...createRemoteActions([
		'IDEAS_FETCH',
		'IDEA_FETCH'
	]),
	'IDEAS_LOADING': 'IDEAS_LOADING'
};

export function getIdea(id){
	return (dispatch, getState) => {
		request('Ideas')
			.get({
				id
			})
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.IDEA_FETCH_SUCCESS,
					payload: d.data
				});


			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function getIdeas(topicId){
	return (dispatch, getState) => {
		request('Ideas')
			.get({
				topic_id: topicId
			})
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.IDEAS_FETCH_SUCCESS,
					payload: d.data
				});


			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};