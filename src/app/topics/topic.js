import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader, Icon, Card, Input, Button, Tooltip } from 'antd';
import Ideas from '../ideas';
import { getTopic, saveTopic, onChange } from './topicsActions';
import './index.css';


class Topic extends Component {

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
		const { getTopic, match } = this.props;
		getTopic(match.params.id);
	}

	handleToggleEdit() {
		this.setState({
			isEdit: !this.state.isEdit
		});
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

	handleSave() {
		const { topic, saveTopic } = this.props;
		saveTopic(topic.id);

		this.handleToggleEdit();
	}


	render() {
		const { topic, history } = this.props;
		const { isEdit } = this.state;

		/*return (
			<Card
				className='topic'
				actions={[
					(!isEdit && (topic.meta && topic.meta.canEdit) && <a key='list-edit' onClick={this.handleToggleEdit}>edit</a>),
					(isEdit && <a key='list-save' onClick={this.handleSave}>save</a>),
				]}
			>
				<div>Автор: {topic.author_fullname}</div> 
				{isEdit ? <Input value={topic.title} onChange={this.handleChangeTitle} /> : <div>Название: {topic.title}</div>}
				{isEdit ? <Input.TextArea value={topic.description} onChange={this.handleChangeDescription} /> : <div>Описание: {topic.description}</div>}
				<div>Дата публикации: {topic.publish_date}</div>

				<h3>Идеи</h3>
				<Ideas/>
			</Card>
		);*/

		return (
			<Card className='topic'>
				<div className='topic__header'>
					{/*<span className='topic__header_author-fullname'>
						{topic.author_fullname}
					</span>
					<span className='topic__header_publish-date'>{topic.publish_date}</span>
					{!isEdit && (topic.meta && topic.meta.canEdit) && <Icon type='edit' className='topic__header_edit-icon' onClick={this.handleToggleEdit} />}
					{isEdit && <Button type='primary' size='small' className='topic__header_save-button' onClick={this.handleSave}>Сохранить</Button>}*/}
				</div>
				<div className='topic__body'>
					{isEdit ?
						<Input value={topic.title} onChange={this.handleChangeTitle} /> :
						(
							<PageHeader
								onBack={history.goBack}
								title={<h3 className='topic__body_title'>{topic.title}</h3>}
								subTitle={
									<span>
										<span className='topic__header_author-fullname'>
											{topic.author_fullname}
										</span>
										{/*<span className='topic__header_publish-date'>{topic.publish_date}</span>*/}
									</span>
								}
								extra={
									(!isEdit && (topic.meta && topic.meta.canEdit) && <Tooltip title='Реактировать'><Icon type='edit' onClick={this.handleToggleEdit} /></Tooltip>)
								}
							/>
					)}
					{isEdit ? <Input.TextArea value={topic.description} onChange={this.handleChangeDescription} /> : <div className='topic__body_description'>{topic.description}</div>}
					{isEdit && <Button key='save-edit' type='primary' size='small' className='topic__header_save-button' onClick={this.handleSave}>Сохранить</Button>}
				</div>
				<div className='topic__footer'>
					<Ideas/>
				</div>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		topic: state.topics.currentTopic
	}
}

export default connect(mapStateToProps, { getTopic, saveTopic, onChange })(Topic);