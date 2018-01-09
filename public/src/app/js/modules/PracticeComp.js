import * as React from 'react';

import { UserModal } from './UserModal.js';
import { ReviewModal } from './ReviewModal.js';

const velocity = require('velocity-react');


export class PracticeComp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuArrowArr: [],
			buildings: [],
			classes: [],
			people: [],
			categoryClickedMarkers: ['person', 'class', 'building'], //buildings people classes
			subCategoryClickedMarkers: [], //david straz center, barista, admin, clausen center, class_name
			subSubCategoryClickedMarkers: [], //floor, admin_name, barista_name
			subSubSubCategoryClickedMarkers: [], //room
			userModal: false,
			reviewModal: false
		};
		this.renderBuildingSubMenu = this.renderBuildingSubMenu.bind(this);
		this.renderClassesSubMenu = this.renderClassesSubMenu.bind(this);
		this.renderPeopleSubMenu = this.renderPeopleSubMenu.bind(this);
		this.menuArrowClicked = this.menuArrowClicked.bind(this);
	}

	componentDidMount() {
		let sub_categories = [];
		let sub_sub_categories = [];
		let sub_sub_sub_categories = [];
		let categories = {
			category: 'building',
			school_id: this.props.school_id

		}
		let data = JSON.stringify( categories );
		fetch('./getCategory', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				this.setState({buildings: result['reviewables']})

				for(let i = 0; i < result['reviewables'].length; i++) {
					if(!sub_categories.includes(result['reviewables'][i]['sub_category'])) {
						sub_categories.push(result['reviewables'][i]['sub_category']);
					}
					if(!sub_sub_categories.includes(result['reviewables'][i]['reviewable_description'])) {
						sub_sub_categories.push(result['reviewables'][i]['reviewable_description']);
					}
					if(!sub_sub_sub_categories.includes(result['reviewables'][i]['name'])) {
						sub_sub_sub_categories.push(result['reviewables'][i]['name']);
					}
				}

				//query to get people
				categories = {
					category: 'person',
					school_id: this.props.school_id

				}
				data = JSON.stringify( categories );
				fetch('./getCategory', {
					method: 'POST',
					body: data
				}).then(function(response: any){
					response.json().then(function(result: any){
						this.setState({people: result['reviewables']})

						for(let i = 0; i < result['reviewables'].length; i++) {
							if(!sub_categories.includes(result['reviewables'][i]['sub_category'])) {
								sub_categories.push(result['reviewables'][i]['sub_category']);
							}
							if(!sub_sub_categories.includes(result['reviewables'][i]['name'])) {
								sub_sub_categories.push(result['reviewables'][i]['name']);
							}
						}

						categories = {
							category: 'class',
							school_id: this.props.school_id

						}
						data = JSON.stringify( categories );
						fetch('./getCategory', {
							method: 'POST',
							body: data
						}).then(function(response: any){
							response.json().then(function(result: any){
								this.setState({classes: result['reviewables']})
								for(let i = 0; i < result['reviewables'].length; i++) {
									if(!sub_categories.includes(result['reviewables'][i]['name'])) {
										sub_categories.push(result['reviewables'][i]['name']);
									}
								}
								this.setState({subCategoryClickedMarkers: sub_categories, subSubCategoryClickedMarkers: sub_sub_categories, subSubSubCategoryClickedMarkers: sub_sub_sub_categories})
								this.props.setClicked(this.state.categoryClickedMarkers, sub_categories, sub_sub_categories, sub_sub_sub_categories);
								this.props.setMarkers();
							}.bind(this))
						}.bind(this))

					}.bind(this))
				}.bind(this))

			}.bind(this))
		}.bind(this))
	}

	menuArrowClicked(string) {

		let array=this.state.menuArrowArr;
		if (this.state.menuArrowArr.includes(string.target.id))
		{
			/*the menu is open - close it.*/
			let index = array.indexOf(string.target.id);
			array.splice(index, 1);
		}
		else
		{
			/*the menu is closed - open it.*/
			array.push(string.target.id);
		}
		this.setState({menuArrowArr: array});
	}

	categoryCheckBoxClicked(event){
		let temp = this.state.categoryClickedMarkers;
		//if the checkbox that was clicked is now unchecked, remove it from the clicked marker array
		if(!event.target.checked){
			
			let index = temp.indexOf(event.target.value);
			temp.splice(index, 1);

			//if the checkout that was clicked is now checked, and it exists in the menuArrowArr, remove it from the menuArrowArr, and add it to the clicked marker array
			// else add it to the clicked marker array
		} else {
			temp.push(event.target.value);
		}
		this.setState({categoryClickedMarkers: temp})
		this.props.setClicked(temp, this.state.subCategoryClickedMarkers, this.state.subSubCategoryClickedMarkers, this.state.subSubSubCategoryClickedMarkers);
	}

	subCategoryCheckBoxClicked(event){
		let temp = this.state.subCategoryClickedMarkers;
		//if the checkbox that was clicked is now unchecked, remove it from the clicked marker array
		if(!event.target.checked){
			
			let index = temp.indexOf(event.target.value);
			temp.splice(index, 1);

			//if the checkout that was clicked is now checked, and it exists in the menuArrowArr, remove it from the menuArrowArr, and add it to the clicked marker array
			// else add it to the clicked marker array
		} else {
			temp.push(event.target.value);
		}
		this.setState({subCategoryClickedMarkers: temp})
		this.props.setClicked(this.state.categoryClickedMarkers, temp, this.state.subSubCategoryClickedMarkers, this.state.subSubSubCategoryClickedMarkers);
	}

	subSubCategoryCheckBoxClicked(event){
		let temp = this.state.subSubCategoryClickedMarkers;
		//if the checkbox that was clicked is now unchecked, remove it from the clicked marker array
		if(!event.target.checked){
			
			let index = temp.indexOf(event.target.value);
			temp.splice(index, 1);

			//if the checkout that was clicked is now checked, and it exists in the menuArrowArr, remove it from the menuArrowArr, and add it to the clicked marker array
			// else add it to the clicked marker array
		} else {
			temp.push(event.target.value);
		}
		this.setState({subSubCategoryClickedMarkers: temp})
		this.props.setClicked(this.state.categoryClickedMarkers, this.state.subCategoryClickedMarkers, temp, this.state.subSubSubCategoryClickedMarkers);
	}

	subSubSubCategoryCheckBoxClicked(event){
		let temp = this.state.subSubSubCategoryClickedMarkers;
		//if the checkbox that was clicked is now unchecked, remove it from the clicked marker array
		if(!event.target.checked){
			
			let index = temp.indexOf(event.target.value);
			temp.splice(index, 1);

			//if the checkout that was clicked is now checked, and it exists in the menuArrowArr, remove it from the menuArrowArr, and add it to the clicked marker array
			// else add it to the clicked marker array
		} else {
			temp.push(event.target.value);
		}
		this.setState({subSubSubCategoryClickedMarkers: temp})
		this.props.setClicked(this.state.categoryClickedMarkers, this.state.subCategoryClickedMarkers, this.state.subSubCategoryClickedMarkers, temp);
	}

	renderBuildingSubMenu() {
		if (this.state.menuArrowArr.includes("building"))
		{
			let sub_categories = [];
			for(let i = 0; i < this.state.buildings.length; i++) {
				if(!sub_categories.includes(this.state.buildings[i]['sub_category'])) {
					sub_categories.push(this.state.buildings[i]['sub_category']);
				}
			}
			let options = [];
			for(let i = 0; i < sub_categories.length; i++) {
				options.push(
					<div>
						<h3 className="menuItem2" key={i}>
							<label className="container2" for="XXXstring" >
			  				<input type="checkbox" name="XXXstring" defaultChecked="checked" value={sub_categories[i]} onClick={(event) => this.subCategoryCheckBoxClicked(event)}/>
			  				<span className="checkmark"></span>
								<span className="mapMenuText2">{sub_categories[i].charAt(0).toUpperCase() + sub_categories[i].slice(1)}</span>
							</label>
							<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow2" id={sub_categories[i]} onClick={(event) => this.menuArrowClicked(event)} />
						</h3>

					<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
						{this.renderBuildingSubSubMenu(sub_categories[i])}
					</velocity.VelocityTransitionGroup>
						
					</div>
				);
			}
			return (
				<div>
					{options}
				</div>
			);
		}
	}
	renderBuildingSubSubMenu(sub_category){
		if (this.state.menuArrowArr.includes(sub_category))
		{
			let sub_categories = [];
			for(let i = 0; i < this.state.buildings.length; i++) {
				if(!sub_categories.includes(this.state.buildings[i]['reviewable_description']) && this.state.buildings[i]['sub_category'] == sub_category) {
					sub_categories.push(this.state.buildings[i]['reviewable_description']);
				}
			}
			let options = [];
			for(let i = 0; i < sub_categories.length; i++) {
				let split = sub_categories[i].split('-');
				options.push(
					<div>
						<h4 className="menuItem3" key={i}>
							<label className="container3" for="XXXstring" >
			  				<input type="checkbox" name="XXXstring" defaultChecked="checked" value={sub_categories[i]} onClick={(event) => this.subSubCategoryCheckBoxClicked(event)}/>
			  				<span className="checkmark"></span>
								<span className="mapMenuText3">{"Floor " + split[split.length-1]}</span>
							</label>
							<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow3" id={sub_categories[i]} onClick={(event) => this.menuArrowClicked(event)} />
						</h4>

					<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
						{this.renderBuildingSubSubSubMenu(sub_categories[i])}
					</velocity.VelocityTransitionGroup>
						
					</div>
				);
			}
			return (
				<div>
					{options}
				</div>
			);
		}
	}
	renderBuildingSubSubSubMenu(sub_category){
		if (this.state.menuArrowArr.includes(sub_category))
		{
			let options = [];
			for(let i = 0; i < this.state.buildings.length; i++) {
				if(this.state.buildings[i]['reviewable_description'] == sub_category) {
					options.push(
						<div>
							<h5 className="menuItem4" key={i}>
								<label className="container4" for="XXXstring" >
				  				<input type="checkbox" name="XXXstring" defaultChecked="checked" value={this.state.buildings[i]['name']} onClick={(event) => this.subSubSubCategoryCheckBoxClicked(event)}/>
				  				<span className="checkmark"></span>
									<span className="mapMenuText4">{this.state.buildings[i]['name']}</span>
								</label>
							</h5>
						</div>
					);
				}
			}
			return (
				<div>
					{options}
				</div>
			);
		}
	}

	renderClassesSubMenu() {
		if (this.state.menuArrowArr.includes("class"))
		{
			let options = [];
			for(let i = 0; i < this.state.classes.length; i++) {
				options.push(
					<h3 className="menuItem2"  key={i}>
						<label className="container2" for="XXXstring" >
		  				<input type="checkbox" name="XXXstring" defaultChecked="checked" value={this.state.classes[i]['name']} onClick={(event) => this.subCategoryCheckBoxClicked(event)}/>
		  				<span className="checkmark"></span>
							<span className="mapMenuText2">{this.state.classes[i]['name']}</span>
						</label>
					</h3>
				);
			}
			return (
				<div>
					{options}
				</div>
			);
		}
	}

	renderPeopleSubMenu() {
		if (this.state.menuArrowArr.includes("person"))
		{
			let sub_categories = [];
			for(let i = 0; i < this.state.people.length; i++) {
				if(!sub_categories.includes(this.state.people[i]['sub_category'])) {
					sub_categories.push(this.state.people[i]['sub_category']);
				}
			}
			let options = [];
			for(let i = 0; i < sub_categories.length; i++) {
				options.push(
					<div>
						<h3 className="menuItem2" key={i}>
							<label className="container2" for="XXXstring" >
			  				<input type="checkbox" name="XXXstring" defaultChecked="checked" value={sub_categories[i]} onClick={(event) => this.subCategoryCheckBoxClicked(event)}/>
			  				<span className="checkmark"></span>
								<span className="mapMenuText2">{sub_categories[i].charAt(0).toUpperCase() + sub_categories[i].slice(1)}</span>
							</label>
							<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow2" id={sub_categories[i]} onClick={(event) => this.menuArrowClicked(event)} />
						</h3>

					<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
						{this.renderPeopleSubSubMenu(sub_categories[i])}
					</velocity.VelocityTransitionGroup>
						
					</div>
				);
			}
			return (
				<div>
					{options}
				</div>
			);
		}
	}

	renderPeopleSubSubMenu(sub_category) {
		if(this.state.menuArrowArr.includes(sub_category)) {
			let options = [];
			for (let i=0; i<this.state.people.length; i++) {
				if(this.state.people[i]["sub_category"] == sub_category){
					options.push(
						<div>
							<h4 className="menuItem3">
								<label className="container3" for="XXXstring" >
									<input type="checkbox" name="XXXstring" defaultChecked="checked" value={this.state.people[i]['name']} onClick={(event) => this.subSubCategoryCheckBoxClicked(event)}/>
									<span className="checkmark"></span>
									<span className="mapMenuText3">{this.state.people[i]['name']}</span>
								</label>
							</h4>
						</div>
					)
				}
			}
			return (
				<div>
					{options}
				</div>
			);
		}
		
	}

	render() {
		return (
		<div className="mapMenu">
			<velocity.VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
				<div className="mapMenuSearchBar"><input type="text" name="search" placeholder="Search..." /></div>

				<h2 className="menuItem">
					<label className="container" for='check1'>
	  				<input type="checkbox" name='check1' defaultChecked="checked" value='building' onClick={(event) => this.categoryCheckBoxClicked(event)}/>
	  				<span className="checkmark"></span>
						<span className="mapMenuText">{this.props.menuItems[0]}</span>
					</label>
					<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow" id={'building'} onClick={(event) => this.menuArrowClicked(event)} />
				</h2>
				<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
					{this.renderBuildingSubMenu()}
				</velocity.VelocityTransitionGroup>
				<h2  className="menuItem">
					<label className="container" for='check2'>
	  				<input type="checkbox" name='check2' defaultChecked="checked" value='class' onClick={(event) => this.categoryCheckBoxClicked(event)}/>
	  				<span className="checkmark"></span>
						<span className="mapMenuText">{this.props.menuItems[1]}</span>
					</label>
					<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow" id={'class'} onClick={(event) => this.menuArrowClicked(event)} />
				</h2>
				<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
					{this.renderClassesSubMenu()}
				</velocity.VelocityTransitionGroup>
				<h2  className="menuItem">
					<label className="container" for='check3'>
	  				<input type="checkbox" name='check3' defaultChecked="checked" value='person' onClick={(event) => this.categoryCheckBoxClicked(event)}/>
	  				<span className="checkmark"></span>
						<span className="mapMenuText">{this.props.menuItems[2]}</span>
					</label>
					<img src="closemenu.png" alt="arrow" height="42" width="42" className="mapMenuArrow" id={'person'} onClick={(event) => this.menuArrowClicked(event)} />
				</h2>
				<velocity.VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
					{this.renderPeopleSubMenu()}
				</velocity.VelocityTransitionGroup>
				<div className="mapMenuButton"><button onClick={this.toggleNewReviewModal.bind(this)}> Make A Review</button></div>
				<div className='profile-settings-div' onClick={this.toggleUserModal.bind(this)}> <img className='gear' src="src/app/css/gear.png"/> <span> Profile Settings </span></div>
				{this.renderModal()}
			</velocity.VelocityTransitionGroup>
		</div>
		)
	}

	renderModal(){
		if(this.state.userModal) {
			let props = {
				username: this.props.username,
				handleClick: this.toggleUserModal.bind(this)
			}
			return (<UserModal {...props} />)
		} else if(this.state.reviewModal) {
			let props = {
				username: this.props.username,
				school_id: this.props.school_id,
				reviews: this.props.marker_info,
				handleClick: this.toggleNewReviewModal.bind(this)
			}
			return (<ReviewModal {...props} />)
		}
	}

	toggleUserModal(){
		this.setState({userModal: !this.state.userModal})
	}
	toggleNewReviewModal(){
		this.setState({reviewModal: !this.state.reviewModal})
	}
}
