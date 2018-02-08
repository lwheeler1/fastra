import * as React from 'react';

const velocity = require('velocity-react');


export class PracticeComp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuArrowArr: []
		};
	}

	render() {
		return (
		<div>
			<h1>hello world</ h1>
		</div>
		)
	}

}
