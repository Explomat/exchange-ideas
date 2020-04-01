import React, { Component } from 'react';
import { Popover, Rate, Icon } from 'antd';
//import './index.css';

class MyRate extends Component {

	constructor(props) {
		super(props);

		this.handleToggle = this.handleToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			isShowRate: false
		}
	}

	handleChange(value) {
		this.handleToggle();
		this.props.onChange(value);
	}

	handleToggle() {
		this.setState({
			isShowRate: !this.state.isShowRate
		});
	}

	render() {
		const { text } = this.props;
		const { isShowRate } = this.state;

		return (
			<div className='rate'>
				<Popover placement='leftTop' content={<Rate value={text} onChange={this.handleChange} />}>
					<span>
						<Icon type='star-o' style={{ marginRight: 8 }} onClick={this.handleToggle}/>
						{text}
					</span>
				</Popover>
			</div>
		);
	}
}

export default MyRate;
