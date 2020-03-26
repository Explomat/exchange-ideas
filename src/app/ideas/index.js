import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Avatar, Icon, Card } from 'antd';
import { Link } from 'react-router-dom';

import { getIdeas } from './ideasActions';
//import './index.css';

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);

class Ideas extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
		const { match, getIdeas } = this.props;
		getIdeas(match.params.id);
	}

	render() {
		const { ideas, match } = this.props;

		return (
			<Card className='ideas'>
				<List
					itemLayout='vertical'
					pagination={{
						onChange: page => {
							console.log(page);
						},
						pageSize: 3
					}}
				>
					{ideas.map(item => {
						return (
							<List.Item
								key={item.title}
								actions={[
									<IconText type='like' text={item.rate} key='list-vertical-star-o' />
								]}
							>
								<List.Item.Meta
									avatar={<Avatar src={item.image_id} />}
									title={<Link to={`/topics/${match.params.id}/ideas/${item.id}`}>{item.title}</Link> /*<a href={`/topics/${item.id}`}>{item.title}</a>*/}
									description={item.description}
								/>
							</List.Item>
						);
					})}

				</List>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		ideas: state.ideas.list
	}
}

export default withRouter(connect(mapStateToProps, { getIdeas })(Ideas));