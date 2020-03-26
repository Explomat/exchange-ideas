import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Avatar, Icon, Card } from 'antd';
import Comment from './comment';
import { Link } from 'react-router-dom';

import { getComments, removeComment, saveComment } from './commentsActions';
//import './index.css';

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);

class Comments extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
		const { match, getComments } = this.props;
		getComments(match.params.id);
	}

	render() {
		const { comments, match } = this.props;
		const { removeComment, saveComment } = this.props;

		return (
			<Card className='comments'>
				<List
					itemLayout='horizontal'
					pagination={{
						onChange: page => {
							console.log(page);
						},
						pageSize: 3
					}}
				>
					{comments.map(item => {
						return (
							<Comment key={item.id} {...item} onSave={saveComment} onRemove={removeComment}/>
/*
							<List.Item
								key={item.id}
								actions={[
									<IconText type='like' text={item.rate} key='list-vertical-star-o' />
								]}
							>
								<List.Item.Meta
									avatar={<Avatar src={item.image_id} />}
									title={<Link to={`/topics/${match.params.id}/ideas/${item.id}`}>{item.title}</Link>}
									description={item.text}
								/>
							</List.Item>*/
						);
					})}

				</List>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		comments: state.comments.list
	}
}

export default withRouter(connect(mapStateToProps, { getComments, removeComment, saveComment })(Comments));