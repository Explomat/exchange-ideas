import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { createBaseUrl } from '../../utils/request';
import reqwest from 'reqwest';
import './index.css';

class UploadFile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fileList: []
		}
	}

	render() {
		const { fileList } = this.state;
		const { url, data, onFileUploaded, disabled } = this.props;

		return (
			<div className='upload-file'>
				<Upload
					accept='.xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					name='file'
					fileList={fileList}
					action={url}
					data={data}
					showUploadList={{
						showDownloadIcon: false,
						showRemoveIcon: true
					}}
					beforeUpload={
						file => {
							this.setState({
								fileList: [ ...this.state.fileList, file ]
							});
						}
					}
					onSuccess={
						d => {
							onFileUploaded(d.data);
						}
					}
					onRemove = {() => {
						this.setState({
							fileList: []
						});
						this.props.onRemove();
					}}
				>
					{disabled && <Button className='learnings-upload-file'>
						<Icon type='upload' /> Загрузить файл
					</Button>}
				</Upload>
			</div>
		);
	}
}

export default UploadFile;
