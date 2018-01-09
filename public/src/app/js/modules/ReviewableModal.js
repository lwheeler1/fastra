import * as React from 'react';
import { render } from 'react-dom';	
import 'whatwg-fetch'

const velocity = require('velocity-react');

export class ReviewableModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			averageRating: 1,
			newRating: 1,
			newRatingTemp: 1,
			createReview: false,
			reviews: []
		}
	}

	componentDidMount(){
		this.requestReviewsFromServer(this.props.reviewableID);
	}

	render() {
		
		return  (
			<div id="reviewable-modal" className='modal'>
				<div className="reviewable-content">
					<div className="modalHeader">
						<span className='modalHeadline'> {this.props.title} </span>
						<div className='rating-stars'>
							{this.getRatingsGraphic(this.getAverageRating(), '')}
						</div>
						<a className="modal-close" onClick={this.props.handleClick}>
						</a>
					</div>
					<velocity.VelocityTransitionGroup enter={{animation: "fadeIn", delay: "400"}} leave={{animation: "fadeOut"}}>
						{this.renderReviewData()}
						{this.renderReviewForm()}
					</velocity.VelocityTransitionGroup>
				</div>
			</div> 
		);
	}

	requestReviewsFromServer(id){
		let categories = {
			reviewableID: id

		}
		let data = JSON.stringify( categories );
		fetch('/getReviews', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				this.setState({reviews: result['reviews']});
			}.bind(this))
		}.bind(this))
	}

	renderReviewData(){
		if(!this.state.createReview){
			return (
				<div className='modal-section'>
					<h1 className="reviews-header"> Reviews </h1>
					<div className="span_8 modal-reviews">
						<div className="scrollable-review-div">
							{this.renderReviews()}
						</div>
					</div>
					<div className="span_4 modal-make-review">
						<div className="mapMenuButton"><a className='btn' onClick={this.toggleReviewForm.bind(this)}> Make A Rating</a></div>
					</div>
				</div>
			);
		}
	}

	renderReviewForm(){
		if(this.state.createReview){
			return (
					<div className='modal-section'>
						<textarea id="reviewable-textarea-input" className='review-textarea' name='the-review' placeholder='Write a review...' rows='12'/>
						<h1 className="reviews-header"> Rating: </h1>
						<div className='new-review-rating-graphic'>
							{this.getClickableRatingsGraphic(this.state.newRatingTemp, '')}
						</div>
						<div className="new-rating-submit">
							<a className='btn' onClick={this.submitReview.bind(this)}>Submit</a>
							<a className='cancel new-rating-cancel' onClick={this.toggleReviewForm.bind(this)}>Cancel</a>
						</div>
					</div>
				);
		}
	}

	getRatingsGraphic(r, c){
		let graphic = [];
		for(let i = 0; i < 5; i++){
			if(i < r) {
				graphic.push(<img src="src/app/css/solid-star.png" className={'star solid-star ' + c} key={'star-' + i}/>);
			} else {
				graphic.push(<img src="src/app/css/empty-star.png" className={'star empty-star ' + c}  key={'star-' + i}/>);
			}
		}
		return graphic;
	}

	getClickableRatingsGraphic(r, c){
		let graphic = [];
		for(let i = 0; i < 5; i++){
			if(i < r) {
				graphic.push(<img src="src/app/css/solid-star.png" data-rating={i+1} className={'star solid-star ' + c} onClick={(event) => this.setNewReviewRating(event)} onMouseEnter={(event) => this.setNewTempReviewRating(event)} onMouseLeave={this.resetNewReviewRating.bind(this)} key={'star-' + i}/>);
			} else {
				graphic.push(<img src="src/app/css/empty-star.png" data-rating={i+1} className={'star empty-star ' + c}  onClick={(event) => this.setNewReviewRating(event)} onMouseEnter={(event) => this.setNewTempReviewRating(event)} onMouseLeave={this.resetNewReviewRating.bind(this)} key={'star-' + i}/>);
			}
		}
		return graphic;
	}

	renderReviews(){
		let reviews = [];
		for(let i = 0; i < this.state.reviews.length; i++) {
			//build JSX review object
			let reviewRating = this.state.reviews[i]['up_votes'] - this.state.reviews[i]['down_votes'];
			let reviewRatingClass = '';
			if(reviewRating > 0){
				reviewRatingClass = 'green';
			} else {
				reviewRatingClass = 'red';
			}
			reviews.push(
				<div className='single-review' key={'review-' + i}>
					<h3 className='user-header'>{this.state.reviews[i]['username']} says: </h3>
					<p className='review-text'>"{this.state.reviews[i]['review']}"</p>
					<span className='review-rating'>Was this review helpful? 
						<span className='review-rating-option' id={'reviewUp-' + this.state.reviews[i]['reviewID']} onClick={(event) => this.eventUpVote(event)}> Yes </span> 
						<span className='review-rating-option' id={'reviewDown-' + this.state.reviews[i]['reviewID']} onClick={(event) => this.eventDownVote(event)}>No </span> 
						<span className={'reviewRating ' + reviewRatingClass}>({reviewRating})</span>
						<span className='mini-rating'>
							{this.getRatingsGraphic(this.state.reviews[i]['rating'], 'mini-graphic')}
						</span>
					</span>

				</div>
			);

		}
		if(this.state.reviews.length == 0) {
			reviews.push(
				<div className='single-review' key={'review-' + 1}>
					<h3 className='user-header'>No Reviews Available</h3>
				</div>
			);
		}
		return reviews;
	}

	getAverageRating(){
		let temp = 0;
		if(this.state.reviews != null) {
			for(let i = 0; i < this.state.reviews.length; i++) {
				temp += this.state.reviews[i]['rating'];
			}
			temp = temp / this.state.reviews.length;
		}
		return temp;
	}
	eventUpVote(event){
		let id = event.target.id.split('-')[1];
		let categories = {
			reviewID: id,
			votetype: 1
		}
		let data = JSON.stringify( categories );
	
		fetch('./vote', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				for(let i = 0; i < this.state.reviews.length; i++){
					if(this.state.reviews[i]['reviewID'] == id) {
						let temp = this.state.reviews;
						temp[i]['up_votes'] += 1;
						this.setState({reviews: temp});
					}
				}
			}.bind(this))
		}.bind(this))
	}
	eventDownVote(event){
		let id = event.target.id.split('-')[1];
		let categories = {
			reviewID: id,
			votetype: -1
		}
		let data = JSON.stringify( categories );
	
		fetch('./vote', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				for(let i = 0; i < this.state.reviews.length; i++){
					if(this.state.reviews[i]['reviewID'] == id) {
						let temp = this.state.reviews;
						temp[i]['down_votes'] += 1;
						this.setState({reviews: temp});
					}
				}
			}.bind(this))
		}.bind(this))
	}
	toggleReviewForm(){
		this.setState({createReview: !this.state.createReview});
		this.setState({newRating: this.state.averageRating})
		this.setState({newRatingTemp: this.state.averageRating})
	}
	setNewReviewRating(event){
		let newRate = parseInt(event.target.getAttribute('data-rating'));
		this.setState({newRating: newRate})
		this.setState({newRatingTemp: newRate})
	}
	setNewTempReviewRating(event){
		let newRate = parseInt(event.target.getAttribute('data-rating'));
		this.setState({newRatingTemp: newRate})
	}
	resetNewReviewRating(){
		this.setState({newRatingTemp: this.state.newRating})
	}
	submitReview(){
		//review Submission AJAX goes here
		// action /addReview
		let val = document.getElementById('reviewable-textarea-input').value;
		let categories = {
			reviewableID: this.props.reviewableID,
			review: val,
			rating: this.state.newRating,
			username: this.props.username
		}
		let data = JSON.stringify( categories );
		fetch('./addReview', {
			method: 'POST',
			body: data
		}).then(function(response: any){
			response.json().then(function(result: any){
				let temp = this.state.reviews;
				temp.push(categories);
				this.setState({createReview: false, reviews: temp})
			}.bind(this))
		}.bind(this))
				this.setState({createReview: false})
	}
}