import React from 'react';
import { Link } from 'react-router-dom'


import { data } from './data'

import '../style.css';


class Map extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			balance: 100,
			panel: 'find',
			time: null,
            center: [30.3165, 59.9392],
			coordinates: { lat: null, long: null },
			scooters: [[30.342459, 59.914796]]
		}
		this.onChangePanel = this.onChangePanel.bind(this);
		this.onGeolocation = this.onGeolocation.bind(this);
	}

    componentDidMount() {
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

			var layers = map.getStyle().layers;
			var firstSymbolId;
			for (var i = 0; i < layers.length; i++) {
			    if (layers[i].type === 'symbol') {
			        firstSymbolId = layers[i].id;
			        break;
			    }
			}

			map.addLayer({
				'id': 'areas-fill',
				'type': 'fill',
				'source': {
					'type': 'geojson',
					'data': data
				},
				'layout': {},
				'paint': {
					'fill-color': '#e20074',
					'fill-opacity': 0.5
				}
			}, firstSymbolId);

			map.on('click', 'areas-fill', function (e) {
				new mapboxgl.Popup()
				.setLngLat(e.lngLat)
				.setHTML(e.features[0].properties.name)
				.addTo(map);
			});

			let scooters = JSON.parse(localStorage.getItem('scooters'));
			for(let i = 0; i < scooters.length; i++) {
				let scooters = JSON.parse(localStorage.getItem('scooters'));
				let coordinates = scooters[i];
				let point = 'scooter#'+i;

				map.loadImage('https://i.ibb.co/Q9Bq7x8/scooter.png', function(error, image) {
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
							"icon-size": 0.06
						}
					});
				});

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
		if(_panel === 'book') {
			this.setState({ time: '5:00' });
			let _time = 300;
			let timer1 = setInterval(() => {
				if(this.state.panel === 'book') {
					_time = _time - 1;
					let _sec = _time;
					let _min = Math.floor(_sec / 60);
					_sec %= 60;
					this.setState({ time: _min + ':' + _sec });
				} else {
					clearInterval(timer1)
				};
			}, 1000);
		}
		if(_panel === 'start') {
			this.setState({ time: '0:00' });
			let _time_start = 0;
			let timer2 = setInterval(() => {
				if(this.state.panel === 'start') {
					_time_start = _time_start + 1;
					let _sec = _time_start;
					let _min = Math.floor(_sec / 60);
					_sec %= 60;
					this.setState({ time: _min + ':' + _sec });
				} else {
					clearInterval(timer2)
				};
			}, 1000);
		}
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
				<div className="panel panel-left">
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
				<div className="panel panel-right">
					<div>
						{ this.state.balance } <i className="fas fa-dice-d6"></i>
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
							<div id="scooter-play" onClick={()=>{this.onChangePanel('book')}}>
								BOOK
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'profile' &&
						<React.Fragment>
							<div className="scooter-block">
								<div className="scooter-profile">
									Mike Petrov
								</div>
								<div className="scooter-profile">
									Trip: 5
								</div>
								<div className="scooter-profile">
									4.2 / 5 <i className="fas fa-star"></i>
								</div>
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'book' &&
						<React.Fragment>
							<div className="scooter-block">
								<div id="scooter-time">
									{ this.state.time }
								</div>
								<div>
									<input id="scooter-input" placeholder="Finish point (discount 10%)"/>
								</div>
								<div id="scooter-play" onClick={()=>{this.onChangePanel('start')}}>
									START
								</div>
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'start' &&
						<React.Fragment>
							<div className="scooter-block">
								<div id="scooter-time">
									{ this.state.time }
								</div>
								<div id="scooter-play" onClick={()=>{this.onChangePanel('finish')}}>
									Finish
								</div>
							</div>
						</React.Fragment>
					}
					{this.state.panel === 'finish' &&
						<React.Fragment>
							<div className="scooter-block">
								<div id="scooter-time">
									{ this.state.time }
								</div>
								<div id="scooter-play" onClick={()=>{this.onChangePanel('find')}}>
									Ok
								</div>
							</div>
						</React.Fragment>
					}
				</div>
             </div>
        );
    }
}

export default Map;
