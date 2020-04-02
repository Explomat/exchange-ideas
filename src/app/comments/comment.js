import React, { Component } from 'react';
import { List, Avatar, Input, Button, Icon } from 'antd';

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
		const { author_fullname, publish_date, text, likes, meta } = this.props;
		const { isEdit, editText, isNew, newText } = this.state;

		return (
			<div className='comment'>
				<div>
					<span>{author_fullname} {publish_date}</span>
					<span style={{ marginLeft: '20px' }}>
						{!isEdit && meta.canEdit && <Icon type='delete' style={{ padding: '10px' }} onClick={this.handleRemove}/>}
						{!isEdit && meta.canEdit && <Icon type='edit'  style={{ padding: '10px' }} onClick={this.handleToggleEdit}/>}
					</span>
				</div>
				<div>{isEdit && meta.canEdit ? <Input.TextArea value={editText} onChange={this.handleChange}/> : text}</div>
				{isEdit && <Button type='primary' onClick={this.handleSave}>Save</Button>}
				{!isEdit && <a onClick={this.handleToggleEditNew}>Ответить</a>}
				{isNew && 
					(<div>
						<Input.TextArea value={newText} onChange={this.handleChangeNew}/>
						<Button type='primary' onClick={this.handleSaveNew}>Save</Button>
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