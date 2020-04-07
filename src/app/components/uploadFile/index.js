import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { createBaseUrl } from '../../../utils/request';
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
		const { url, data, accept, onSuccess, onRemove } = this.props;

		return (
			<div className='upload-file'>
				<Upload
					accept={accept}
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
							if (onSuccess) {
								onSuccess(d.data);
							}
						}
					}
					onRemove = {() => {
						this.setState({
							fileList: []
						});

						if (onRemove) {
							onRemove();
						}
					}}
				>
					<Button className='learnings-upload-file'>
						<Icon type='upload' /> Загрузить файл
					</Button>
				</Upload>
			</div>
		);
	}
}

export default UploadFile;
