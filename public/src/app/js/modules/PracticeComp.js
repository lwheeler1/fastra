import * as React from 'react';
import BigCalendar from 'react-big-calendar'

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
			<div className="topBanner">
				<h1>Wheeler Schedule</ h1>
			</div>
			<div className="leftColumn">
				<h1>left</ h1>
			</div>
			<div className="middleColumn">
				<h1>middle</ h1>
			</div>
			<div className="rightColumn">
				<h1>right</ h1>
			</div>
		</div>
		)
	}

}
