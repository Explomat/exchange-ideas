import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Card, Input, Button } from 'antd';
import Rate from '../components/rate';
import IconText from '../components/iconText';
import { Link } from 'react-router-dom';
import { getTopics, removeTopic, newTopic, rateTopic } from './topicsActions';
import './index.css';

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
							<div key={item.id} className='topics__topic-list'>
								<div className='topics__topic-list_header'>
									<Link to={`/topics/${item.id}`}>
										<Icon type='project' className='topics__topic-list_body_icon'/>
										<span>{item.title}</span>
									</Link>
									<span className='topics__topic-list_body_pubish-date'>{item.publish_date}</span>
								</div>
								<div className='topics__topic-list_footer'>
									<Rate text={parseInt(item.rate, 10)} className='icon-text' disabled={item.meta.isRated} onChange={val => rateTopic(item.id, val)}/>
									<IconText type='alert' text={item.ideas_count} className='icon-text'/>
									{item.meta.canDelete && <IconText type='delete' className='topics__topic-list_footer_delete' onClick={(() => removeTopic(item.id))}/>}
									<span className='topics__topic-list_footer-descr'>
										<span>{item.author_fullname}</span>
									</span>
								</div>
							</div>
							/*<List.Item
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
									title={<Link to={`/topics/${item.id}`}>{item.title}</Link>}
									description={item.description}
								/>
							</List.Item>*/
						);
					})}

				</List>

				<div className='topics__new'>
					<h4>Добавить новую тему</h4>
					<Input className='topics__new_title' value={addTextTitle} placeholder='Название' onChange={this.handleChangeAddTitle}/>
					<Input.TextArea className='topics__new_description' value={addTextDescription} placeholder='Описание' onChange={this.handleChangeAddDescription}/>
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