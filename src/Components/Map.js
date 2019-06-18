import React from 'react';
import { Link } from 'react-router-dom'

import '../style.css';


class Map extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			panel: 'find',
            center: [30.3165, 59.9392],
			coordinates: { lat: null, long: null },
			scooters: [[30.342459, 59.914796]]
		}
		this.onChangePanel = this.onChangePanel.bind(this);
		this.onGeolocation = this.onGeolocation.bind(this);
	}

    componentDidMount() {
		// localStorage.setItem('coordinates', '');
		localStorage.setItem('scooters', JSON.stringify(this.state.scooters));

		var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
        mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZS1wZXRyb3YiLCJhIjoiY2p4MW1idnI2MGFnczQ5cWZtcHExYXVucSJ9.R5eaAB5PePMxt7dM9PEFqg';
        var map = new mapboxgl.Map({
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.state.center,
			zoom: 12
        });

		document.getElementById('btn-now').addEventListener('click', function() {
			setTimeout(function() {
				let coordinates = JSON.parse(localStorage.getItem('coordinates'));
				map.flyTo({
					center: coordinates,
					zoom: 15
				});

				new mapboxgl.Marker({color:'#e20074'})
				.setLngLat(coordinates)
				.addTo(map);

			}, 1000);
		});

        map.on('load', function () {
			let scooters = JSON.parse(localStorage.getItem('scooters'));
			for(let i = 0; i < scooters.length; i++) {
				let scooters = JSON.parse(localStorage.getItem('scooters'));
				let coordinates = scooters[i];
				let point = 'scooter#'+i;

				map.loadImage('https://i.ibb.co/HXTWdct/scooter.png', function(error, image) {
					if (error)
						throw error;
					map.addImage('scooter', image);
					map.addLayer({
						"id": "point",
						"type": "symbol",
						"source": {
							"type": "geojson",
							"data": {
								"type": "FeatureCollection",
								"features": [
									{
										"type": "Feature",
										"geometry": {
											"type": "Point",
											"coordinates": coordinates
										}
									}
								]
							}
						},
						"layout": {
							"icon-image": "scooter",
							"icon-size": 0.1
						}
					});
				});

				// map.addSource(point, {
				// 	"type" : "geojson",
				// 	"data" : {
				// 	    "type": "FeatureCollection",
				// 	    "features": [{
				//             "type": "Feature",
				//             "geometry": {
				//                 "type": "Point",
				//                 "coordinates": coordinates
				//             }
				//         }]
				// 	}
				// });
				//
				// map.addLayer({
				//     "id": point,
				//     "type": "circle",
				//     "source": point,
				//     "paint": {
				//         "circle-radius": 6,
				//         "circle-color": '#e74c3c'
				//     }
				// });

				map.on('click', point, function (e) {
					let scooters = JSON.parse(localStorage.getItem('scooters'));
					let coordinates = scooters[i];
					let description = 'Scooter#' + i;

					map.flyTo({
						center: coordinates,
						zoom: 15
					});

					new mapboxgl.Popup()
					.setLngLat(coordinates)
					.setHTML(description)
					.addTo(map);
				});

				map.on('mouseenter', point, function () {
					map.getCanvas().style.cursor = 'pointer';
				});

				map.on('mouseleave', point, function () {
					map.getCanvas().style.cursor = '';
				});
			}
		});
    }

	onChangePanel(_panel) {
		this.setState({ panel: _panel });
	}

	onGeolocation() {
		window.navigator.geolocation.getCurrentPosition((position) => {
			let _lat = position.coords.latitude;
			let _long = position.coords.longitude;
			let coordinates = [_long,_lat];
			localStorage.setItem('coordinates', JSON.stringify(coordinates));
			this.setState({ coordinates: { lat: _lat, long: _long } });
		});
	}

    render() {
        return (
			<div className="map">
				<div id="panel">
					<div onClick={()=>{this.onChangePanel('profile')}}>
						<i className="fas fa-user"></i>
					</div>
					<div onClick={()=>{this.onChangePanel('find')}}>
						<i className="fas fa-search"></i>
					</div>
					<div onClick={()=>{this.onGeolocation()}} id="btn-now">
						<i className="fas fa-location-arrow"></i>
					</div>
				</div>
				<div id="mapbox"></div>
				<div id="package">
					{this.state.panel === 'find' &&
						<React.Fragment>
							<div>
								<img src="./img/scooter.png" />
							</div>
							<div className="scooter-info">
								<div id="scooter-number">
									<i className="fas fa-hashtag"></i> 225403
								</div>
								<div id="scooter-name">
									Xiaomi
								</div>
								<div id="scooter-energy">
									<i className="fas fa-bolt"></i> 59 %
								</div>
							</div>
							<div id="scooter-play" onClick={()=>{this.onChangePanel('start')}}>
								START
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'profile' &&
						<React.Fragment>
							<div id="scooter-name">
								User
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'start' &&
						<React.Fragment>
							<div id="scooter-name">
								Start
							</div>
						</React.Fragment>
					}
				</div>
             </div>
        );
    }
}

export default Map;
