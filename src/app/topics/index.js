import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Card, Input, Button, Tooltip, Select, Tag, Pagination } from 'antd';
//import Rate from '../components/rate';
import IconText from '../components/iconText';
import UploadFile from  '../components/uploadFile';
import { createBaseUrl } from '../../utils/request';
import { Link } from 'react-router-dom';
import { getTopics, removeTopic, newTopic, rateTopic } from './topicsActions';
import toBoolean from '../../utils/toBoolean';
import unnamedImage from '../../images/unnamed_image.png';
import './index.css';

class Topics extends Component {

	constructor(props){
		super(props);

		this.handleChangeAddTitle = this.handleChangeAddTitle.bind(this);
		this.handleChangeAddDescription = this.handleChangeAddDescription.bind(this);
		this.handleNewSubmit = this.handleNewSubmit.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this.handleRemoveFile = this.handleRemoveFile.bind(this);

		this.state = {
			searchText: '',
			searchStatus: '',
			page: 1,
			pageSize: 1,
			addTextTitle: '',
			addTextDescription: '',
			addFile: null,
			isAddFileUploaded: false
		}

		//this.formRef = React.createRef();
	}

	componentDidMount(){
		this.props.getTopics();
	}

	handleUploadFile(f) {
		this.setState({
			addFile: f,
			isAddFileUploaded: true
		});
	}

	handleRemoveFile() {
		if (this.state.addFile) {
			this.setState({
				isAddFileUploaded: false,
				addFile: null
			});
		}
	}

	handleNewSubmit(e) {
		/*e.preventDefault();
		const formData = new FormData(this.formRef.current);
		const { newTopic} = this.props;
		newTopic(formData);

		this.setState({
			addTextTitle: '',
			addTextDescription: ''
		});*/

		const { newTopic} = this.props;
		const { addTextTitle, addTextDescription, addFile } = this.state;
		newTopic(addTextTitle, addTextDescription, addFile);

		this.setState({
			addTextTitle: '',
			addTextDescription: '',
			addFile: null
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
		const { meta, topics, getTopics, removeTopic } = this.props;
		const { addTextTitle, addTextDescription, addFile, isAddFileUploaded } = this.state;

		return (
			<div className='topics-container'>
				<h1 className='topics-container__title'>Биржа идей</h1>
				<div className='topics'>
					<div className='topics__filters'>
						<Input
							className='topics__filters_search'
							
							placeholder='Поиск'
							prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
							onPressEnter={() => getTopics(this.state.searchText, this.state.searchStatus, this.state.page)}
							onChange={e => this.setState({ searchText: e.target.value })}
						/>
						<Select
							className='topics__filters_status'
							defaultValue='all'
							onSelect={(val) => {
								this.setState({
									searchStatus: val
								});
								getTopics(this.state.searchText, val, this.state.page);
							}}
						>
							<Select.Option value='all'>Все темы</Select.Option>
							<Select.Option value='active'>Активные</Select.Option>
							<Select.Option value='archive'>Архивные</Select.Option>
						</Select>
					</div>
					{topics.map(item => {
						const descr = item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description;
						return (
							<div key={item.id} className='topics__topic-list'>
								<Link to={`/topics/${item.id}`}>
									{item.image_id ?
										<img className='topics__topic-list_image' src={`/download_file.html?file_id=${item.image_id}`} />
										: <img className='topics__topic-list_image' src={unnamedImage} />
									}
									{toBoolean(item.is_archive) && <Tag className='topics__topic-list_status' color='#f50'>В архиве</Tag>}
									<div className='topics__topic-list_header'>
										<span>{item.title}</span>
										{/*<span className='topics__topic-list_body_pubish-date'>{item.publish_date}</span>*/}
									</div>
								</Link>
								<div className='topics__topic-list_body'>
									{descr}
								</div>
								<div className='topics__topic-list_footer'>
									{/*<Rate text={parseInt(item.rate, 10)} className='icon-text' disabled={item.meta.isRated} onChange={val => rateTopic(item.id, val)}/>*/}
									<Tooltip title='Идеи'>
										<span>
											<IconText type='alert' text={item.ideas_count}/>
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
				<Pagination
					defaultCurrent={1}
					current={meta.page}
					pageSize={meta.pageSize}
					total={meta.total}
					onChange={(page, pageSize) => {
						this.setState({
							page,
							pageSize
						});
						getTopics(this.state.searchText, this.state.searchStatus, page);
					}}
				/>
				{meta.canAdd && <div className='topics__new'>
					<h4>Добавить новую тему</h4>
					<Input name='title' className='topics__new_title' value={addTextTitle} placeholder='Название' onChange={this.handleChangeAddTitle}/>
					<Input.TextArea name='description' className='topics__new_description' value={addTextDescription} placeholder='Описание' onChange={this.handleChangeAddDescription}/>
					<UploadFile
						url={createBaseUrl('File')}
						accept='image/x-png,image/gif,image/jpeg'
						disabled={isAddFileUploaded}
						onSuccess={this.handleUploadFile}
						onRemove={this.handleRemoveFile}
					/>
					<Button disabled={!(addTextTitle.trim() && addTextDescription.trim())} onClick={this.handleNewSubmit}>Добавить</Button>
				</div>}
			</div>	
		);
	}
}

function mapStateToProps(state){
	return {
		topics: state.topics.list,
		meta: state.topics.meta
	}
}

export default connect(mapStateToProps, { getTopics, removeTopic, newTopic, rateTopic })(Topics);