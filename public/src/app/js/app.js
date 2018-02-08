import * as React from 'react';
import { render } from 'react-dom';
import 'whatwg-fetch'

import { PracticeComp } from './modules/PracticeComp.js';

const velocity = require('velocity-react');

class App extends React.Component {

	constructor(){
		super();
		this.state = {

		}
	}


	render() {

		return  (
			<div>
				<velocity.VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
					{this.renderHome()}
				</velocity.VelocityTransitionGroup>
			</div>
		);

	}

	renderHome(){
		let props = {
		};
		return  (
			<div>
				<PracticeComp {...props}/>
			</div>
		);
	}

	resizeWindow(){
		$(window).trigger('resize');
	}

}


render( <App />, document.getElementById('react-root'));
