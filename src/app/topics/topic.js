import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Card } from 'antd';
import Ideas from '../ideas';
import { getTopic } from './topicsActions';
import './index.css';


class Topic extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
		const { getTopic, match } = this.props;
		getTopic(match.params.id);
	}

	render() {
		const { topic } = this.props;

		return (
			<Card className='topic'>
				<div>Автор: {topic.author_fullname}</div> 
				<div>Название: {topic.title}</div>
				<div>Описание: {topic.description}</div>
				<div>Дата публикации: {topic.publish_date}</div>

				<h3>Идеи</h3>
				<Ideas/>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		topic: state.topics.currentTopic
	}
}

export default connect(mapStateToProps, { getTopic })(Topic);