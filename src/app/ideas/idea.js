import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Card, Input, Button } from 'antd';
import Comments from '../comments';
import { getIdea, onChange, saveIdea } from './ideasActions';
import './index.css';


class Idea extends Component {

	constructor(props){
		super(props);

		this.handleToggleEdit = this.handleToggleEdit.bind(this);
		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleChangeDescription = this.handleChangeDescription.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.state = {
			isEdit: false
		}
	}

	componentDidMount(){
		const { getIdea, match } = this.props;
		getIdea(match.params.id);
	}

	handleSave() {
		const { idea, saveIdea } = this.props;
		saveIdea(idea.id);

		this.handleToggleEdit();
	}

	handleChangeTitle(e) {
		const { onChange } = this.props;

		onChange({
			title: e.target.value
		});
	}

	handleChangeDescription(e) {
		const { onChange } = this.props;

		onChange({
			description: e.target.value
		});
	}

	handleToggleEdit() {
		this.setState({
			isEdit: !this.state.isEdit
		});
	}

	render() {
		const { idea, meta } = this.props;
		const { isEdit } = this.state;

		/*return (
			<Card
				className='idea'
				actions={[
					(!isEdit && (idea.meta && idea.meta.canEdit) && <a key='list-edit' onClick={this.handleToggleEdit}>edit</a>),
					(isEdit && <a key='list-save' onClick={this.handleSave}>save</a>),
				]}
			>
				<div>Автор: {idea.author_fullname}</div> 
				{isEdit ? <Input value={idea.title} onChange={this.handleChangeTitle} /> : <div>Название: {idea.title}</div>}
				{isEdit ? <Input.TextArea value={idea.description} onChange={this.handleChangeDescription} /> : <div>Описание: {idea.description}</div>}
				<div>Дата публикации: {idea.publish_date}</div>

				<h3>Комментарии</h3>
				<Comments />
			</Card>
		);*/
		return (
			<Card className='idea'>
				<div className='idea__header'>
					<span className='idea__header_author-fullname'>
						{idea.author_fullname}
					</span>
					<span className='idea__header_publish-date'>{idea.publish_date}</span>
					{!isEdit && (idea.meta && idea.meta.canEdit) && <Icon type='edit' className='idea__header_edit-icon' onClick={this.handleToggleEdit} />}
					{isEdit && <Button type='primary' size='small' className='idea__header_save-button' onClick={this.handleSave}>Сохранить</Button>}
				</div>
				<div className='idea__body'>
					{isEdit ? <Input value={idea.title} onChange={this.handleChangeTitle} /> : <h2 className='idea__body_title'>{idea.title}</h2>}
					{isEdit ? <Input.TextArea value={idea.description} onChange={this.handleChangeDescription} /> : <div className='idea__body_description'>{idea.description}</div>}
				</div>
				<div className='idea__footer'>
					<Comments/>
				</div>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		idea: state.ideas.currentIdea
	}
}

export default connect(mapStateToProps, { getIdea, onChange, saveIdea })(Idea);