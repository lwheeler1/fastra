import * as React from 'react';
import { render } from 'react-dom';	
import 'whatwg-fetch'

import { MapComponent } from './modules/MapComponent.js';
import { GoogleMap } from './modules/GoogleMap.js';
import { PracticeComp } from './modules/PracticeComp.js';
import { SignInUp } from './modules/SignInUp.js';

const velocity = require('velocity-react');

class App extends React.Component {

	constructor(){
		super();
		this.state = {
			logged_in: false,
			username: '',
			school_id: -1,
			lat: -1,
			long: -1,
			categoryClickedMarkers: [], //buildings people classes
			subCategoryClickedMarkers: [], //david straz center, barista, admin, clausen center, class_name
			subSubCategoryClickedMarkers: [], //floor, admin_name, barista_name
			subSubSubCategoryClickedMarkers: [], //room
			peopleMarkers: [],
			buildingMarkers: [],
			classMarkers: []
		}
	}


	render() {

		return  (
			<div>
				<velocity.VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
					{this.renderLogging()}
					{this.renderHome()} 
				</velocity.VelocityTransitionGroup>
			</div>
		);
		
	}

	renderLogging(){
		if(!this.state.logged_in) {
			let sign_props = {
				function_pointer: this.setLoggedIn.bind(this)
			}

			return (
				<SignInUp {...sign_props}/>
			)
		}
	}

	renderHome(){
		if(this.state.logged_in && this.state.school_id != -1) {
			let temp = [];
			for(let i = 0; i < this.state.buildingMarkers.length; i++) {
				temp.push(this.state.buildingMarkers[i]);
			}
			for(let i = 0; i < this.state.peopleMarkers.length; i++) {
				temp.push(this.state.peopleMarkers[i]);
			}
			for(let i = 0; i < this.state.classMarkers.length; i++) {
				temp.push(this.state.classMarkers[i]);
			}
			let props = {
				marker_info: temp,
				zoom: 17,
				lat: parseFloat(this.state.lat), 
				long: parseFloat(this.state.long),
				username: this.state.username,
				school_id: this.state.school_id,
				menuItems: ['Buildings', 'Classes', 'People'],
				setClicked: this.setClickedMarkers.bind(this),
				setMarkers: this.setMarkerInfo.bind(this)
			};
			return  (
				<div>
					<PracticeComp {...props}/> 
					<MapComponent {...props}/>
				</div>
			);
		}
	}

	resizeWindow(){
		$(window).trigger('resize');
	}

	setLoggedIn(val, user, id){
		this.setState({logged_in: val});
		this.setState({username: user});
		this.setState({school_id: id});
		let categories = {
			schoolID: id
		}
		let data = JSON.stringify( categories );
		fetch('/getSingleSchool', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				let l = result['schoolCoordinates'];
				let lat = l.split('/')[0];
				let long = l.split('/')[1];
				this.setState({lat: lat, long: long});
			}.bind(this))
		}.bind(this))
	}
	setClickedMarkers(c, s_c, s_s_c, s_s_s_c){
		this.setMarkerInfo();
		this.setState({
			categoryClickedMarkers: c,
			subCategoryClickedMarkers: s_c,
			subSubCategoryClickedMarkers: s_s_c,
			subSubSubCategoryClickedMarkers: s_s_s_c
		});
	}

	setMarkerInfo(){
		//room markers
		if(this.state.categoryClickedMarkers.includes('person')) {
			let temp = []
			let categories = {
				category: 'person',
				school_id: this.state.school_id

			}
			let data = JSON.stringify( categories );
			fetch('./getCategory', {
				method: 'POST',
				body: data
			}).then(function(response: any){
				response.json().then(function(result: any){
					for(let i = 0; i < result['reviewables'].length; i++) {
						if(this.state.subCategoryClickedMarkers.includes(result['reviewables'][i]['sub_category']) && this.state.subSubCategoryClickedMarkers.includes(result['reviewables'][i]['name'])) {
							temp.push(result['reviewables'][i]);
						}
					}
					this.setState({peopleMarkers: temp})
				}.bind(this))
			}.bind(this))
		} else {
			this.setState({peopleMarkers: []})
		}

		if(this.state.categoryClickedMarkers.includes('building')) {
			let temp = []
			let categories = {
				category: 'building',
				school_id: this.state.school_id

			}
			let data = JSON.stringify( categories );
			fetch('./getCategory', {
				method: 'POST',
				body: data
			}).then(function(response: any){
				response.json().then(function(result: any){
					for(let i = 0; i < result['reviewables'].length; i++) {
						if(this.state.subCategoryClickedMarkers.includes(result['reviewables'][i]['sub_category']) && this.state.subSubCategoryClickedMarkers.includes(result['reviewables'][i]['reviewable_description']) && this.state.subSubSubCategoryClickedMarkers.includes(result['reviewables'][i]['name'])) {
							temp.push(result['reviewables'][i]);
						}
					}
					this.setState({buildingMarkers: temp})
				}.bind(this))
			}.bind(this))
		} else {
			this.setState({buildingMarkers: []})
		}

		if(this.state.categoryClickedMarkers.includes('class')) {
			let temp = []
			let categories = {
				category: 'class',
				school_id: this.state.school_id

			}
			let data = JSON.stringify( categories );
			fetch('./getCategory', {
				method: 'POST',
				body: data
			}).then(function(response: any){
				response.json().then(function(result: any){
					for(let i = 0; i < result['reviewables'].length; i++) {
						if(this.state.subCategoryClickedMarkers.includes(result['reviewables'][i]['name'])) {
							temp.push(result['reviewables'][i]);
						}
					}
					this.setState({classMarkers: temp})
				}.bind(this))
			}.bind(this))
		} else {
			this.setState({classMarkers: []})
		}
	}
}


render( <App />, document.getElementById('react-root'));