import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Card, Input, Button, Tooltip, Skeleton } from 'antd';
//import Rate from '../components/rate';
import IconText from '../components/iconText';
import UploadButton from  '../components/uploadButton';
import createBaseUrl from '../../utils/request';
import { Link } from 'react-router-dom';
import { getTopics, removeTopic, newTopic, rateTopic } from './topicsActions';
import './index.css';

class Topics extends Component {

	constructor(props){
		super(props);

		this.handleChangeAddTitle = this.handleChangeAddTitle.bind(this);
		this.handleChangeAddDescription = this.handleChangeAddDescription.bind(this);
		//this.handleAdd = this.handleAdd.bind(this);
		//this.handleChangeFileUpload = this.handleChangeFileUpload.bind(this);
		this.handleNewSubmit = this.handleNewSubmit.bind(this);

		this.state = {
			addTextTitle: '',
			addTextDescription: '',
			addFile: null
		}

		this.formRef = React.createRef();
	}

	componentDidMount(){
		this.props.getTopics();
	}

	handleNewSubmit(e) {
		e.preventDefault();
		const formData = new FormData(this.formRef.current);
		const { newTopic} = this.props;
		newTopic(formData);

		this.setState({
			addTextTitle: '',
			addTextDescription: ''
		});
	}

	handleChangeFileUpload(file) {
		this.setState({
			addFile: file
		});
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

	render() {
		const { topics, removeTopic } = this.props;
		const { addTextTitle, addTextDescription } = this.state;

		return (
			<Card>
				<div className='topics'>
					{topics.map(item => {
						const descr = item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description;

						return (
							<div key={item.id} className='topics__topic-list'>
								{item.image_id ?
									<img className='topics__topic-list_image' src={`/download_file.html?file_id=${item.image_id}`} />
									: <Skeleton className='topics__topic-list_image'/>
								}
								<div className='topics__topic-list_header'>
									<Link to={`/topics/${item.id}`}>
										<Icon type='project' className='topics__topic-list_body_icon'/>
										<span>{item.title}</span>
									</Link>
									{/*<span className='topics__topic-list_body_pubish-date'>{item.publish_date}</span>*/}
								</div>
								<div className='topics__topic-list_body'>
									{descr}
								</div>
								<div className='topics__topic-list_footer'>
									{/*<Rate text={parseInt(item.rate, 10)} className='icon-text' disabled={item.meta.isRated} onChange={val => rateTopic(item.id, val)}/>*/}
									<Tooltip title='Идеи'>
										<span>
											<IconText type='alert' text={item.ideas_count} className='icon-text'/>
										</span>
									</Tooltip>
									{item.meta.canDelete &&
										<Tooltip title='Удалить'>
											<span>
												<IconText type='delete' className='topics__topic-list_footer_delete' onClick={(() => removeTopic(item.id))}/>
											</span>
										</Tooltip>
									}
									<span className='topics__topic-list_footer-descr'>
										<span>{item.author_fullname}</span>
									</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className='topics__new'>
					<h4>Добавить новую тему</h4>
					<form encType='multipart/form-data' ref={this.formRef} action={createBaseUrl('Topics')}>
						<Input name='title' className='topics__new_title' value={addTextTitle} placeholder='Название' onChange={this.handleChangeAddTitle}/>
						<Input.TextArea name='description' className='topics__new_description' value={addTextDescription} placeholder='Описание' onChange={this.handleChangeAddDescription}/>
						<UploadButton accept='image/x-png,image/gif,image/jpeg'/>
						<Button type='submit' disabled={!(addTextTitle.trim() && addTextDescription.trim())} onClick={this.handleNewSubmit}>Добавить</Button>
					</form>
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