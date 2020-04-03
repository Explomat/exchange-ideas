import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Avatar, Icon, Card, Input, Button } from 'antd';
import Rate from '../components/rate';
import IconText from '../components/iconText';
import { Link } from 'react-router-dom';

import { getIdeas, removeIdea, newIdea, rateIdea } from './ideasActions';
import './index.css';


class Ideas extends Component {

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
		const { match, getIdeas } = this.props;
		getIdeas(match.params.id);
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
		const { match, newIdea} = this.props;

		newIdea(addTextTitle, addTextDescription, match.params.id);

		this.setState({
			addTextTitle: '',
			addTextDescription: ''
		});
	}

	render() {
		const { ideas, match, removeIdea, rateIdea } = this.props;
		const { addTextTitle, addTextDescription } = this.state;

		return (
			<div className='ideas'>
				{ideas.map(item => {
					return (
						<div key={item.id} className='ideas__idea-list'>
							<div className='ideas__idea-list_header'>
								<Link to={`/topics/${match.params.id}/ideas/${item.id}`}>
									<Icon type='alert' className='ideas__idea-list_body_icon'/>
									<span>{item.title}</span>
								</Link>
								<span className='ideas__idea-list_body_pubish-date'>{item.publish_date}</span>
							</div>
							<div className='ideas__idea-list_footer'>
								<Rate text={parseInt(item.rate, 10)} className='icon-text' disabled={item.meta.isRated} onChange={val => rateIdea(item.id, val)}/>
								<IconText type='message' text={item.comments_count} className='icon-text'/>
								{item.meta.canDelete && <IconText type='delete' className='ideas__idea-list_footer_delete' onClick={(() => removeIdea(item.id))}/>}
								<span className='ideas__idea-list_footer-descr'>
									<span>{item.author_fullname}</span>
								</span>
							</div>
						</div>
					);
				})}
				{/*<List
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
									<Rate text={parseInt(item.rate, 10)} disabled={item.meta.isRated} onChange={val => rateIdea(item.id, val)}/>,
									<IconText type='message' text={item.comments_count} key='list-vertical-message' />,
									item.meta.canDelete && <IconText type='delete' key='list-vertical-remove-o' onClick={(() => removeIdea(item.id))}/>
								]}
							>
								<List.Item.Meta
									avatar={<Avatar src={item.image_id} />}
									title={<Link to={`/topics/${match.params.id}/ideas/${item.id}`}>{item.title}</Link>}
									description={item.description}
								/>
							</List.Item>
						);
					})}

				</List>*/}

				<div className='ideas__new'>
					<h4>Добавить новую идею</h4>
					<Input className='ideas__new_title' value={addTextTitle} placeholder='Название' onChange={this.handleChangeAddTitle}/>
					<Input.TextArea className='ideas__new_description' value={addTextDescription} placeholder='Описание' onChange={this.handleChangeAddDescription}/>
					<Button type='primary' onClick={this.handleAdd}>Добавить</Button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		ideas: state.ideas.list
	}
}

export default withRouter(connect(mapStateToProps, { getIdeas, removeIdea, newIdea, rateIdea })(Ideas));