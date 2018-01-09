/**
 *
 * Filename: GoogleMap.js
 * @version: 1.0.0
 * Created: 10/30/2017
 *
 * @author Jonah Larson, Equity Creative http://equity-creative.com
 * @link https://github.com/Equity-Creative/equity-theme
 * 
 * Builds a unique Google Map for the website.
 *
 * */

import jQuery from 'jquery';

export class GoogleMap {

	/**
	*
	* @param id: the ID of the map HTMLElement
	* @param lat: the latitude of where you would like the map center
	* @param long: the longitude of where you would like the map center
	* @param zoom: the zoom factor of the map. Higher number = more zoom.
	*
	* @param marker_info: the information for the marker locations. Requires following format to work properly.
	*	array(
	*		{
	*			lat: latitude_float_1
	*			long: longitude_float_1
	*			mark: marker_url_string
	*		},
	*		{
	*			lat: latitude_float_2
	*			long: longitude_float_2
	*			mark: marker_url_string
	*		}
	*		...
	*	)
	*
	* This allows for as many marker positions as you would like.
	* If the mark field is left blank the default map marker will be shown.
	* Marker pngs should be approx. 30x40
	*
	**/

	constructor(id, lat, long, zoom, marker_info) {
		jQuery(document).ready(function(){
			this.mapHeight();
			this.initMap();
		}.bind(this));
		jQuery(window).resize(function(){
			this.mapHeight();
		}.bind(this));

		this.id = id;
		this.lat = lat;
		this.long = long;
		this.zoom = zoom;
		this.marker_info = marker_info;
		this.markers = [];
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
		let map = new google.maps.Map(document.getElementById(this.id), {
			center: center,
			scrollwheel: false,
			zoom: this.zoom	
		});
		
		this.initMarkers(map);

		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(center);
		});
	}

	initMarkers(map){
		for(let i = 0; i < this.marker_info.length; i++)
		{
			let mark = this.marker_info[i];
			let lat = mark.lat;
			let lng = mark.long;
			if(mark.hasOwnProperty('mark') && mark['mark'] != '')
			{
				let marker = new google.maps.Marker({
					position: {lat , lng },
					map: map,
					icon: mark['mark']
				});
				this.markers.push(marker);
			} else {
				let marker = new google.maps.Marker({
					position: {lat , lng },
					map: map
				});
				this.markers.push(marker);
			}
			
		}
	}
}