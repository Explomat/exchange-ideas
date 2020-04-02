import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, Avatar, Icon, Card, Input, Button } from 'antd';
import Rate from '../components/rate';
import { Link } from 'react-router-dom';

import { getIdeas, removeIdea, newIdea, rateIdea } from './ideasActions';
//import './index.css';

const IconText = ({ type, text, ...props }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} onClick={props.onClick}/>
		{text}
	</span>
);

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
									<Rate text={parseInt(item.rate, 10)} disabled={item.meta.isRated} onChange={val => rateIdea(item.id, val)}/>,
									<IconText type='message' text={item.comments_count} key='list-vertical-message' />,
									item.meta.canDelete && <IconText type='delete' key='list-vertical-remove-o' onClick={(() => removeIdea(item.id))}/>
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

				<div>
					<h3>Добавить новую идею</h3>
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
		ideas: state.ideas.list
	}
}

export default withRouter(connect(mapStateToProps, { getIdeas, removeIdea, newIdea, rateIdea })(Ideas));