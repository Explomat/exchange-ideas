import React, { Component } from 'react';
import { Input, Button, Icon, Tooltip } from 'antd';

class Comment extends Component {

	constructor(props) {
		super(props);

		this.handleToggleEdit = this.handleToggleEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);

		this.handleToggleEditNew = this.handleToggleEditNew.bind(this);
		this.handleChangeNew = this.handleChangeNew.bind(this);
		this.handleSaveNew = this.handleSaveNew.bind(this);

		this.handleLike = this.handleLike.bind(this);

		this.state = {
			isEdit: false,
			isNew: false,
			editText: props.text,
			newText: ''
		}
	}

	handleRemove(e) {
		e.preventDefault();

		const { id, onRemove } = this.props;
		onRemove(id);
	}

	handleSave(e) {
		const { id, onSave } = this.props;
		onSave(id, this.state.editText);

		this.handleToggleEdit(e);
	}

	handleSaveNew(e) {
		const { ideaId, id, onNew } = this.props;
		onNew(this.state.newText, ideaId, id);

		this.handleToggleEditNew(e);
	}

	handleChange(e) {
		this.setState({
			editText: e.target.value
		});
	}

	handleChangeNew(e) {
		this.setState({
			newText: e.target.value
		});
	}

	handleToggleEdit(e) {
		e.preventDefault();

		this.setState({
			isEdit: !this.state.isEdit
		});
	}

	handleToggleEditNew(e) {
		e.preventDefault();

		this.setState({
			isNew: !this.state.isNew
		});
	}

	handleLike() {
		const { id, onLike } = this.props;
		onLike(id);
	}

	render() {
		const { pict_url, author_id, author_fullname, publish_date, text, likes, meta } = this.props;
		const { isEdit, editText, isNew, newText } = this.state;

		return (
			<div className='comment'>
				<div className='comment__header'>
					{pict_url ? (
						<span className='ant-avatar ant-avatar-circle ant-avatar-image'>
							<img src={pict_url}/>
						</span>
					) : (
						<Icon className='comment__avatar' type='user' />
					)}
					<span>
						<a href={'/view_doc.html?mode=collaborator&object_id=' + author_id}>{author_fullname}</a>
						<span className='comment__publish-date'>{new Date(publish_date).toLocaleDateString()}</span>
					</span>
					<span className='comment__header_crud'>
						{!isEdit && meta.canEdit && <Tooltip title='Удалить'><Icon type='delete' style={{ padding: '10px' }} onClick={this.handleRemove}/></Tooltip>}
						{!isEdit && meta.canEdit && <Tooltip title='Редактировать'><Icon type='edit'  style={{ padding: '10px' }} onClick={this.handleToggleEdit}/></Tooltip>}
					</span>
				</div>
				<div>{isEdit && meta.canEdit ? <Input.TextArea value={editText} onChange={this.handleChange}/> : text}</div>
				{isEdit && <Button type='primary' onClick={this.handleSave}>Сохранить</Button>}
				{!isEdit && <a onClick={this.handleToggleEditNew}>Ответить</a>}
				{isNew && 
					(<div>
						<Input.TextArea value={newText} onChange={this.handleChangeNew}/>
						<Button type='primary' onClick={this.handleSaveNew}>Сохранить</Button>
					</div>)
				}
				<span className='comment__like'>
					<Icon type='like' theme={meta.isLiked ? 'twoTone' : ''} twoToneColor={meta.isLiked ? '#23de21' : ''} style={{ marginRight: 8 }} onClick={this.handleLike}/>
					{likes}
				</span>
			</div>
		);
	}
}

export default Comment;