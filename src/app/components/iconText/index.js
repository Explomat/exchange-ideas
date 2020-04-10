import React from 'react';
import { Icon} from 'antd';
import './index.css';

const IconText = ({ type, text, ...props }) => (
	<span className='my-icon-text'>
		<Icon type={type} style={{ marginRight: 4 }} onClick={props.onClick}/>
		{text}
	</span>
);

export default IconText;