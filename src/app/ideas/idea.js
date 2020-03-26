import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Card } from 'antd';
import Comments from '../comments';
import { getIdea } from './ideasActions';
import './index.css';


class Idea extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
		const { getIdea, match } = this.props;
		getIdea(match.params.id);
	}

	render() {
		const { idea } = this.props;

		return (
			<Card className='idea'>
				<div>Автор: {idea.author_fullname}</div> 
				<div>Название: {idea.title}</div>
				<div>Описание: {idea.description}</div>
				<div>Дата публикации: {idea.publish_date}</div>

				<h3>Комментарии</h3>
				<Comments />
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		idea: state.ideas.currentIdea
	}
}

export default connect(mapStateToProps, { getIdea })(Idea);