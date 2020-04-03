import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Avatar, Icon, Card, Tree, Input, Button } from 'antd';
import Comment from './comment';
import IconText from '../components/iconText';
import { Link } from 'react-router-dom';

import { getComments, removeComment, saveComment, newComment, likeComment } from './commentsActions';
import './index.css';

function listToTree(list, sortFieldName) {

	function compare(a, b) {
		if (a[sortFieldName] > b[sortFieldName]) {
			return 1;
		}
		if (a[sortFieldName] < b[sortFieldName]) {
			return -1;
		}

		return 0;
	}

	function sortTree(_tree, fieldName){
		const newTree = [..._tree].sort(compare);

		const queue = [];
		for (let i = 0; i < newTree.length; i++) {
			queue.push(newTree[i]);
		}
		let index = queue.length - 1;

		while (index >= 0) {
			const u = queue[index];
			index = index - 1;

			if (u['children'] === undefined) {
				u.children = [];
			}

			u.children = u.children.sort(compare);
			for (let i = 0; i < u.children.length; i++) {
				index = index + 1;
				queue[index] = u.children[i];
			}
		}
		return _tree;
	}

	const map = {};
	const roots = [];
	const newList = [ ...list ];

	for (let i = 0; i < newList.length; i += 1) {
		map[newList[i].id] = i;
	}

	for (let i = 0; i < newList.length; i += 1) {
		const node = newList[i];

		const parentId = node['parent_id'];
		if (parentId) {
			const l = newList[map[node.parent_id]];
			if (l['children'] === undefined) {
				l.children = [];
			}
			l.children.push(node);
		} else {
			roots.push(node);
		}
	}
	return sortTree(roots, sortFieldName);
}

class Comments extends Component {

	constructor(props){
		super(props);

		this.handleChangeAdd = this.handleChangeAdd.bind(this);
		this.handleAdd = this.handleAdd.bind(this);

		this.state = {
			addText: ''
		}
	}

	componentDidMount(){
		const { match, getComments } = this.props;
		getComments(match.params.id);
	}

	handleChangeAdd(e) {
		this.setState({
			addText: e.target.value
		});
	}

	handleAdd() {
		const { addText } = this.state;
		const { match, newComment } = this.props;

		newComment(addText, match.params.id);

		this.setState({
			addText: ''
		});
	}

	renderTree(data) {
		const { match, comments, removeComment, saveComment, newComment, likeComment } = this.props;

		return data.map(item => {
			if (item.children.length > 0) {
				return (
					<Tree.TreeNode
						className='comment__node'
						title={
							<Comment
								{...item}
								onSave={saveComment}
								onRemove={removeComment}
								onNew={newComment}
								onLike={likeComment}
								ideaId={match.params.id}
							/>}
						key={item.id}
					>
						{this.renderTree(item.children)}
					</Tree.TreeNode>
				);
			}
			return <Tree.TreeNode
				className='comment__node'
				title={
					<Comment
						{...item}
						onSave={saveComment}
						onRemove={removeComment}
						onNew={newComment}
						onLike={likeComment}
						ideaId={match.params.id}
					/>}
				key={item.id}
			/>
		});
	}

	render() {
		const { comments, commentsLength } = this.props;
		const { addText } = this.state;

		return (
			<div className='comments'>
				<h3>Комментарии {commentsLength}</h3>
				<Tree
					selectable={false}
				>
					{this.renderTree(comments)}
				</Tree>
				<div className='comments__new'>
					<h4>Добавить комментарий</h4>
					<Input.TextArea className='comments__new_text' value={addText} autoSize={false} onChange={this.handleChangeAdd}/>
					<Button type='primary' onClick={this.handleAdd}>Добавить</Button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		comments: listToTree(JSON.parse(JSON.stringify(state.comments.list)), 'publish_date'),
		commentsLength: state.comments.list.length
		//tree: state.comments.tree
	}
}

export default withRouter(connect(mapStateToProps, { getComments, removeComment, saveComment, newComment, likeComment })(Comments));