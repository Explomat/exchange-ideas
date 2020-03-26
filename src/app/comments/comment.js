import React, { Component } from 'react';
import { List, Avatar, Input, Button } from 'antd';

class Comment extends Component {

	constructor(props) {
		super(props);

		this.handleToggleEdit = this.handleToggleEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);

		this.state = {
			isEdit: false,
			editText: props.text
		}
	}

	handleRemove() {
		const { id, onRemove } = this.props;
		onRemove(id);
	}

	handleSave() {
		const { id, onSave } = this.props;
		onSave(id, this.state.editText);

		this.handleToggleEdit();
	}

	handleChange(e) {
		this.setState({
			editText: e.target.value
		});
	}

	handleToggleEdit() {
		this.setState({
			isEdit: !this.state.isEdit
		});
	}

	render() {
		const { author_fullname, publish_date, text } = this.props;
		const { isEdit, editText } = this.state;

		return (
			<div>
				<List.Item
					actions={[
						(!isEdit && <a key='list-edit' onClick={this.handleToggleEdit}>edit</a>),
						(!isEdit && <a key='list-remove' onClick={this.handleRemove}>remove</a>)
					]}
				>
					<List.Item.Meta
						avatar={
							<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
						}
						title={<span>{author_fullname} {publish_date}</span>}
						description={isEdit ? <Input.TextArea value={editText} onChange={this.handleChange}/> : text}
					/>
				</List.Item>
				{isEdit && <Button type='primary' onClick={this.handleSave}>Save</Button>}
			</div>
		);
	}
}

export default Comment;