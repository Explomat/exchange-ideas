import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Card, Input, Button } from 'antd';
import Rate from '../components/rate';
import { Link } from 'react-router-dom';
//import { MessageOutlined, StarOutlined } from '@ant-design/icons';

//import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';

import { getTopics, removeTopic, newTopic, rateTopic } from './topicsActions';
import './index.css';

const IconText = ({ type, text, ...props }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} onClick={props.onClick}/>
		{text}
	</span>
);

class Topics extends Component {

	constructor(props){
		super(props);

		this.handleChangeAddTitle = this.handleChangeAddTitle.bind(this);
		this.handleChangeAddDescription = this.handleChangeAddDescription.bind(this);
		this.handleAdd = this.handleAdd.bind(this);

		this.state = {
			addTextTitle: '',
			addTextDescription: ''
		}
	}

	componentDidMount(){
		this.props.getTopics();
	}

	handleChangeAddTitle(e) {
		this.setState({
			addTextTitle: e.target.value
		});
	}

	handleChangeAddDescription(e) {
		this.setState({
			addTextDescription: e.target.value
		});
	}

	handleAdd() {
		const { addTextTitle, addTextDescription } = this.state;
		const { match, newTopic} = this.props;

		newTopic(addTextTitle, addTextDescription);

		this.setState({
			addTextTitle: '',
			addTextDescription: ''
		});
	}

	render() {
		const { topics, removeTopic, rateTopic } = this.props;
		const { addTextTitle, addTextDescription } = this.state;

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
									<Rate text={parseInt(item.rate, 10)} disabled={item.meta.isRated} onChange={val => rateTopic(item.id, val)}/>,
									<IconText type='alert' text={item.ideas_count} key='list-vertical-alert' />,
									item.meta.canDelete && <IconText type='delete' key='list-vertical-remove-o' onClick={(() => removeTopic(item.id))}/>
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

				<div>
					<h3>Добавить новую тему</h3>
					<Input value={addTextTitle} placeholder='Название' onChange={this.handleChangeAddTitle}/>
					<Input.TextArea value={addTextDescription} placeholder='Описание' onChange={this.handleChangeAddDescription}/>
					<Button type='primary' onClick={this.handleAdd}>Добавить</Button>
				</div>
			</Card>
		);
	}
}

function mapStateToProps(state){
	return {
		topics: state.topics.list
	}
}

export default connect(mapStateToProps, { getTopics, removeTopic, newTopic, rateTopic })(Topics);