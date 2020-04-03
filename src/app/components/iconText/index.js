import React from 'react';
import { Icon} from 'antd';

const IconText = ({ type, text, ...props }) => (
	<span className={props.className}>
		<Icon type={type} style={{ marginRight: 4 }} onClick={props.onClick}/>
		{text}
	</span>
);

export default IconText;