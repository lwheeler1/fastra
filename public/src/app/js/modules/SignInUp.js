import * as React from 'react';

const velocity = require('velocity-react');
import 'whatwg-fetch'


export class SignInUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signIn: true,
			newSchool: false,
			addBuildings: false,
			contentMargin: 15,
			username: '',
			password: '',
			email: '',
			firstname: '',
			lastname: '',
			school_id: -1,
			school_lat: -1,
			school_long: -1,
			buildings: [],
			schools: []
		}
	}

	render() {
		return (
			<div className='signInBackground'>
				<div className="signInFade">
					<div className ='signInContent' style={{ marginTop: this.state.contentMargin + "%"}}>
					<h1 className='logHeader'> Reviewable </h1>
						<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
							{this.renderSignIn()}
							{this.renderSignUp()}
							{this.renderNewSchool()}
							{this.renderAddBuildings()}
						</velocity.VelocityTransitionGroup>
					</div>
				</div>
			</div>
		)
	}

	renderSignIn(){
		if(this.state.signIn){
			return (
				<div id='signinForm'>
					<h3 className='logSubHeader'><label htmlFor='username'> Username </label></h3>
					<input type='text' placeholder='Username' name='username' id='username'/>
					<h3 className='logSubHeader'><label htmlFor='password'> Password </label></h3>
					<input type='password' placeholder='Password' name='password' id='password'/>
					<p className='error' id='signInError' width='100%'/>
					<div className="submitButtons">
						<a className='signup' onClick={this.signInToggle.bind(this)}> Sign Up </a>
						<a className='login btn' onClick={this.submitSignIn.bind(this)}> Log In </a>
					</div>
				</div>
			);
		}
	}

	renderSignUp(){
		if(!this.state.signIn && !this.state.newSchool && !this.state.addBuildings){
			return (
				<div id='signupForm'>
					<div className="span_6">
						<h5 className='logSubHeader'><label htmlFor='username'> Username </label></h5>
						<input type='text' placeholder='Username' name='username' id='username'/>
						<h5 className='logSubHeader'><label htmlFor='password'> Password </label></h5>
						<input type='password' placeholder='Password' name='password' id='password'/>
						<h5 className='logSubHeader'><label htmlFor='firstname'> First Name </label></h5>
						<input type='text' placeholder='First Name' name='firstname' id='fn'/>
					</div>
					<div className="span_6">
						<h5 className='logSubHeader'><label htmlFor='email'> Email </label></h5>
						<input type='text' placeholder='Email' name='email' id='email'/>
						<h5 className='logSubHeader'><label htmlFor='confirmpassword'> Confirm Password </label></h5>
						<input type='password' placeholder='Confirm Password' name='confirmpassword' id='cp'/>
						<h5 className='logSubHeader'><label htmlFor='lastname'> Last Name </label></h5>
						<input type='text' placeholder='Last Name' name='lastname' id='ln'/>
					</div>
					<p className='desc'>*your name will not appear anywhere on site, we require a first and last name for security purposes only </p>
					<div className='span_12'>
						<h5 className='logSubHeader'><label htmlFor='email'> Select Your School </label></h5>
						<select id='school-select'>
							{this.renderSchoolOptions()}
						</select>
					</div>
					<div><span className="error" id='error-message'/></div>
					<div className="submitButtons">
						<a className='signup btn' onClick={this.submitSignUp.bind(this)}>Submit!</a>
						<a className='cancel' onClick={this.signInToggle.bind(this)}>Cancel</a>
					</div>
				</div>
			);
		}
	}
	renderSchoolOptions(){
		if(this.state.schools.length != 0){
			let options = [];
			options.push(<option value="">Select</option>);
			for(let i = 0; i < this.state.schools.length; i++) {
				options.push(<option value={this.state.schools[i]['school_id']} key={"school-" + this.state.schools[i]['school_id']}>{this.state.schools[i]['school_name']}</option>);
			}
			options.push(<option value="new">Add New School</option>);
			return options;
		} else {
			this.getSchoolOptions();
			let options = [];
			options.push(<option value="">Select</option>);
			options.push(<option value="new">Add New School</option>);
			return options;
		}
	}

	renderNewSchool(){
		if(this.state.newSchool) {
			return ( 
				<div id='newSchoolForm'>
					<p className='desc'>Your school doesn't exist in our system yet! Please take a moment to set up your school.</p>
					<h3 className='logSubHeader'><label htmlFor='schoolname'> School Name </label></h3>
					<input type='text' placeholder='Name' name='schoolname' id='schoolname'/>
					<h3 className='logSubHeader'><label htmlFor='lat'> Latitude </label></h3>
					<input type='number' placeholder='Latitude' name='lat' id='lat'/>
					<h3 className='logSubHeader'><label htmlFor='lng'> Longitude </label></h3>
					<input type='number' placeholder='Longitude' name='lng' id='lng'/>
					<a href='https://www.latlong.net/convert-address-to-lat-long.html' target='_blank'>Get Your Latitude and Longitude Here</a>
					<div className="submitButtons">
						<a className='addSchool btn' onClick={this.addSchool.bind(this)}>Add School</a>
						<a className='cancel' onClick={this.cancelSchool.bind(this)}>Cancel</a>
					</div>
				</div>
			);
		}
	}

	renderAddBuildings(){
		if(this.state.addBuildings) {
			return(
				<div id='newBuildingForm'>
					<p className='desc'>
						Now that we have located your school, please take a moment to add all significant buildings on our campus to assist us in making the most accurate review locations possible.
					</p>
					<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
						{this.renderBuildings()}
					</velocity.VelocityTransitionGroup>
					<h3 className='logSubHeader'><label htmlFor='buildingname'> Building Name </label></h3>
					<input type='text' placeholder='Name' name='buildingname' id='buildingname'/>
					<h3 className='logSubHeader'><label htmlFor='lat'> Latitude </label></h3>
					<input type='number' placeholder='Latitude' name='lat' id='lat'/>
					<h3 className='logSubHeader'><label htmlFor='lng'> Longitude </label></h3>
					<input type='number' placeholder='Longitude' name='lng' id='lng'/>
					<h3 className='logSubHeader'><label htmlFor='lng'> Number of Floors </label></h3>
					<input type='number' min='1' placeholder='Number of Floors' name='Floors' id='floors'/>
					<div className="submitButtons">
						<a className='addBuilding btn' onClick={this.addBuilding.bind(this)}>Add Building</a>
						<a className='finalizeBuildings btn' onClick={this.finalizeBuildings.bind(this)}>Finalize Buildings</a>
					</div>
					
				</div>

			);
		}
	}

	renderBuildings(){
		if(this.state.buildings.length == 0){
			return(<h5 key="1">No Buildings Have Been Added</h5>);
		} else {
			let b = []
			for(let i = 0; i < this.state.buildings.length; i++) {
				b.push(
					<h6 key={this.state.buildings[i]['name']}> {this.state.buildings[i]['name']} 
						<span className='building-delete-button' data-name={this.state.buildings[i]['name']} onClick={(event) => this.deleteBuilding(event)}>Delete</span>
					</h6>
				);
			}
			return (
				<div className='building-div' key="2">
					<div className='building-inner'>
						<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
							{b}
						</velocity.VelocityTransitionGroup>
					</div>
				</div>
			);
		}
	}

	addSchool(){
		//do ajax to add a school, then begin adding buildings
		let s = document.getElementById('schoolname').value;
		let lat_long = document.getElementById('lat').value + '/' + document.getElementById('lng').value;
		let categories = {
			schoolName: s,
			schoolCoordinates: lat_long
		}
		let data = JSON.stringify( categories );
		fetch('./addSchool', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				this.setState({school_id: result['schoolID']});
				this.setState({addBuildings: true, newSchool: false});
			}.bind(this))
		}.bind(this))

	}

	cancelSchool(){
		this.setState({newSchool: false, signIn: true, contentMargin: 15});
	}

	addBuilding(){
		let n = document.getElementById('buildingname').value;

		for(let i = 0; i < this.state.buildings.length; i++) {
			//do an ajax call to the server for each building in the array
			if(this.state.buildings[i]['name'] == n){
				return;
			}
		}
		let temp = this.state.buildings;
		let lat = document.getElementById('lat').value;
		let lng = document.getElementById('lng').value;
		let num = document.getElementById('floors').value;
		
		temp.push({name: n, pos:lat + '/' + lng, noOfFloors: num});

		this.setState({buildings: temp});
	}

	finalizeBuildings(){
		for(let i = 0; i < this.state.buildings.length; i++) {
			//do an ajax call to the server for each building in the array
			let categories = {
				schoolID: this.state.school_id,
				name: this.state.buildings[i]['name'],
				noOfFloors: this.state.buildings[i]['noOfFloors'],
				coordinates: this.state.buildings[i]['pos']
			}
			let data = JSON.stringify( categories );
			fetch('./addBuilding', {
				method: 'POST',
				body: data
			}).then(function(response: any){
				response.json().then(function(result: any){
				}.bind(this))
			}.bind(this))	
		}
		//add new user now
		let categories = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email,
			firstName: this.state.firstname,
			lastName: this.state.lastname
		}
		let data = JSON.stringify( categories );
		fetch('./signUp', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				if(result['signed_up']){
					this.props.function_pointer(true, this.state.username, this.state.school_id);
				}
			}.bind(this))
		}.bind(this))

		//change states
	}

	deleteBuilding(event){
		let n = event.target.getAttribute('data-name');
		let temp = [];
		for(let i = 0; i < this.state.buildings.length; i++) {
			//do an ajax call to the server for each building in the array
			if(this.state.buildings[i]['name'] != n){
				temp.push(this.state.buildings[i]);
			}
		}
		this.setState({buildings: temp});
	}

	getSchoolOptions(){
		//do ajax call to get school options and return them to the previous function
		if(this.state.schools.length == 0)
		{
			let categories = {
			}
			let data = JSON.stringify( categories );
			fetch('./getSchools', {
				method: 'POST',
				body: data
			}).then(function(response: any){
				response.json().then(function(result: any){
					this.setState({schools: result['schools']});
				}.bind(this))
			}.bind(this))
		}
	}

	signInToggle(){
		if(!this.state.signIn) {
			this.setState({contentMargin: 15});
		} else {
			this.setState({contentMargin: 5});
		}
		this.setState({signIn: !this.state.signIn});
	}

	submitSignUp(){
		let u = document.getElementById('username').value;
		let p = document.getElementById('password').value;
		let p2 = document.getElementById('cp').value;
		let fn = document.getElementById('fn').value;
		let ln = document.getElementById('ln').value;
		let e = document.getElementById('email').value;
		let s = document.getElementById('school-select').value;

		if(p == p2 && p != "" && fn != "" && ln != "" && u != "" && e != "" && s != ""){
			if(s != 'new'){
				let categories = {
					username: u,
					password: p,
					email: e,
					firstName: fn,
					lastName: ln,
					schoolID: s
				}
				let data = JSON.stringify( categories );
				fetch('./signUp', {
					method: 'POST',
					body: data
				}).then(function(response: any){
					response.json().then(function(result: any){
						if(result['signed_up']){
							this.props.function_pointer(true, this.state.username, s);
						}
					}.bind(this))
				}.bind(this))
			} else {
				this.setState({
					username: u,
					password: p,
					email: e,
					firstname: fn,
					lastname: ln,
					newSchool: true
				})
			}
			
		} else {
			let errorText = '';
			if(p == ""){
				errorText += 'You must input a password<br/>';
				$('#password').addClass('error');
				$('#cp').addClass('error');
			} else {
				errorText += 'You two passwords did not match, retry<br/>';
				$('#password').addClass('error');
				$('#cp').addClass('error');
			}
			if (fn == "") {
				errorText += 'You must input a first name<br/>';
				$('#fn').addClass('error');
			} 
			if (ln == "") {
				errorText += 'You must input a last name<br/>';
				$('#ln').addClass('error');
			} 
			if (u == "") {
				errorText += 'You must input a username<br/>';
				$('#username').addClass('error');
			}
			if(e == "") {
				errorText += 'You must input an email<br/>';
				$('#email').addClass('error');
			}
			if (s == "") {
				errorText += 'You must select a school<br/>';
				$('#school-select').addClass('error');
			}
			$('#error-message').html(errorText);
		}
	}

	submitSignIn(){
		let u = document.getElementById('username').value;
		let p = document.getElementById('password').value;
		let categories = {
			username: u,
			password: p
		}
		let data = JSON.stringify( categories );
		fetch('./signIn', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				if(result['signed_up']){
					this.props.function_pointer(true, u, result['schoolID']);
				} else {
					$('#signInError').text("Incorrect Username or Password, retry");
				}
			}.bind(this))
		}.bind(this))
	}
}