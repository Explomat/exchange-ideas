import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Card } from 'antd';
import { Link } from 'react-router-dom';
//import { MessageOutlined, StarOutlined } from '@ant-design/icons';

import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';

import { getTopics } from './topicsActions';
import './index.css';

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);

class Topics extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.getTopics();
	}

	render() {
		const { topics } = this.props;

		return (
			<Card className='topics'>
				<List
					itemLayout='vertical'
					size='large'
					pagination={{
						onChange: page => {
							console.log(page);
						},
						pageSize: 3
					}}
				>
					{topics.map(item => {
						return (
							<List.Item
								key={item.title}
								actions={[
									<IconText type='star-o' text={item.rate} key='list-vertical-star-o' />
								]}
								extra={
									<img
										width={272}
										alt='logo'
										src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
									/>
								}
							>
								<List.Item.Meta
									avatar={<Avatar src={item.image_id} />}
									title={<Link to={`/topics/${item.id}`}>{item.title}</Link> /*<a href={`/topics/${item.id}`}>{item.title}</a>*/}
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
		topics: state.topics.list
	}
}

export default connect(mapStateToProps, { getTopics })(Topics);