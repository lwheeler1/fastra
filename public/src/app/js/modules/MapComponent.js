import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GoogleMap} from './GoogleMap';
import {ReviewableModal} from './ReviewableModal';
import 'whatwg-fetch'

const velocity = require('velocity-react');


export class MapComponent extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			markerClicked: false,
			activeMarker: -1,
			markers: this.props.marker_info,
			markerTitle: '',
			reviews: [],
			map: null
		}
	}

	componentDidMount() {
		 setTimeout( function() {
			this.buildMap('map', this.props.lat, this.props.long, this.props.zoom, this.props.marker_info);	
		}.bind(this), 100 );
		
		$('.modal-close').on('click', function(){
			this.setState({markerClicked: false, activeMarker: -1});
			$('#reviewable-modal').toggleClass('active');
		}.bind(this));
	}

	render() {
		if(this.state.map != null) {
			for (var i = 0; i < this.markers.length; i++ ) {
				this.markers[i].setMap(null);
			}
  			this.markers.length = 0;
			this.marker_info = this.props.marker_info;
			this.initMarkers(this.state.map)
		}
		
		return (
			<div className="mapContainer">
				<div id='map'>

				</div>
				<velocity.VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
					{this.renderModal()}
				</velocity.VelocityTransitionGroup>
			</div>
		
		);
	}

	renderModal() {
		if(this.state.markerClicked){
			let props = {
				title: this.state.markerTitle,
				reviewableID: this.state.activeMarker,
				username: this.props.username,
				handleClick: this.closeModal.bind(this)
			}; 
			return (<ReviewableModal {...props} />);
		}
	}

	buildMap(id, lat, long, zoom, marker_info) {
		this.id = id;
		this.lat = lat;
		this.long = long;
		this.zoom = zoom;
		this.marker_info = marker_info;
		this.markers = [];

		jQuery(document).ready(function(){
			this.mapHeight();
			this.initMap();
		}.bind(this));
		jQuery(window).resize(function(){
			this.mapHeight();
		}.bind(this));

	}

	mapHeight(){
		if(jQuery(window).width() > 769){
			let h = jQuery('#small-images .sign-image').height();
			jQuery('#' + this.id).css({
				width: '',
				height: h
			});
		}
	}

	initMap() {

		let lat = this.lat;
		let lng = this.long;
		let center = { lat , lng };
		let myStyles =[
			{
				featureType: "poi",
				elementType: "labels",
				stylers: [
					{ visibility: "off" }
				]
			}
		];

		let map = new google.maps.Map(document.getElementById(this.id), {
			center: center,
			scrollwheel: false,
			zoom: this.zoom,
			styles: myStyles
		});

		this.setState({map: map});
		
		this.initMarkers(map);

		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(center);
		});
	}

	initMarkers(map){
		for(let i = 0; i < this.marker_info.length; i++)
		{
			let mark = this.marker_info[i];
			let lat = parseFloat(mark['coordinates'].split('/')[0]);
			let lng = parseFloat(mark['coordinates'].split('/')[1]);
			let infowindow = new google.maps.InfoWindow({
				content: '<h5 data-id="' + mark['reviewableID'] + '">' + mark['name'] + '</h5>'
			});
			let marker = null;
			if(mark.hasOwnProperty('mark') && mark['mark'] != '')
			{
				marker = new google.maps.Marker({
					position: {lat , lng },
					map: map,
					icon: mark['mark'], 
					title: mark['name'],
					reviewableID: mark['reviewableID']
				});
			} else {
				marker = new google.maps.Marker({
					position: {lat , lng },
					map: map,
					reviewableTitle: mark['name'],
					reviewableID: mark['reviewableID']
				});
			}
			google.maps.event.addListener(marker, 'click', function() {
				this.setState({markerClicked: true, activeMarker: marker['reviewableID'], markerTitle: marker['reviewableTitle']});
				jQuery('#reviewable-modal').toggleClass('active');
			}.bind(this));
			google.maps.event.addListener(marker, 'mouseover',  function() {
				infowindow.open(map, marker);
			}.bind(this));
			google.maps.event.addListener(marker, 'mouseout',  function() {
				infowindow.close(map, marker);
			}.bind(this));
			this.markers.push(marker);
			
		}
	}

	closeModal(){
		this.setState({markerClicked: false, activeMarker: -1});
		jQuery('#reviewable-modal').toggleClass('active');
	}
}