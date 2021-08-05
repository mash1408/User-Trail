import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import exampleIcon from '../hiker.png';




MapboxGL.setAccessToken(
  'pk.eyJ1IjoibWFzaDE0MDgiLCJhIjoiY2tybWlxcmgxMWthYjJ3dGoxMXRlZ3YyZSJ9.Ler-SblIXMyAWcVNeyyAcg',
);
const is_android=Platform.OS === "android";
//*********************************************************USER INITIAL COORDINATES****************************************************************
//NAVIGATOR.GEOLOCATOR WASNT WORKING , SO I HARDCODED THE INITIAL COORDS
let coords= [
	[
		73.9931433,
		15.2838388
	  ]	  
]

	
export default class showMap extends Component {
	
	async UNSAFE_componentWillMount(){
		if(is_android){
			const isgranted= await MapboxGL.requestAndroidLocationPermissions();
		
			this.setState({
				isAndroidPermissionGranted: isgranted,
				isFetchingAndroidPermission: true
			})
		}

	}
	componentDidMount() {
		MapboxGL.locationManager.start();
		
	  }
	
	componentWillUnmount() {
		MapboxGL.locationManager.stop();
	  }

	  findCoordinates = () => {
		navigator.geolocation.getCurrentPosition(
			position => {
				const location = JSON.stringify(position);
				
				this.setState({ location });
			}
		);
	}
	  onUserLocationUpdate(location) {
		this.setState({
		  timestamp: location.timestamp,
		  latitude: location.coords.latitude,
		  longitude: location.coords.longitude,
		  altitude: location.coords.altitude,
		  heading: location.coords.heading,
		  accuracy: location.coords.accuracy,
		  speed: location.coords.speed,
		});
		let x=[ ]
		x.push(this.state.longitude)
		x.push(this.state.latitude)
		console.debug(coords);
		if(this.state.longitude!= 0 && this.state.latitude!= 0 )
		coords.push(x)
	  }

 
	 
	constructor(props){
		super(props);
		this.state={
			i:0,
				locationStart: null,
				timestamp: 0,
				latitude: 0.0,
				longitude: 0.0,
				altitude: 0.0,
				heading: 0.0,
				accuracy: 0.0,
				speed: 0.0,
			followUserLocation: true,
      		showsUserHeadingIndicator: false,
			isAndroidPermissionGranted: false,
			isFetchingAndroidPermission: is_android,
			showUserLocation: true,
			
			location:   [-122.084, 37.42],
			route:
			{
			  "type": "FeatureCollection",
			  "features": [
				{
				  "type": "Feature",
				  "properties": {},
				  "geometry": {
					"type": "LineString",
					"coordinates": coords
				  }
				}
			  ]
			},  
		}
		this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
	}


	render(){
		
  	return(
		<View style={styles.container} >
		
		   
			  <MapboxGL.MapView
			   ref={c=>(this._map=c)}
			   zoomLevel={2}
			   showUserLocation={true}
			   style={styles.container}
			   userTrackingMode={this.state.userSelectedUserTrackingMode}
			   tintColor={'red'} 
			  >
				  <MapboxGL.Camera
				  zoomLevel={1}
				  animationDuration={0}
				  animationMode={'flyTo'}
				  ref={c=>(this.camera=c)}
				  centerCoordinate={this.state.location}
				  followUserLocation={this.state.followUserLocation}
				  followUserMode={'normal'}
				  >

				  </MapboxGL.Camera>
				  <MapboxGL.UserLocation
				  showsUserHeadingIndicator={true}
				//   minDisplacement={1}
				  visible={true}
				  renderMode={'custom'}
				  onUpdate={this.onUserLocationUpdate}
				  >
					  <MapboxGL.SymbolLayer
					    id={'custom-user-symbol'}
					    style={{
					      iconImage: exampleIcon,
					      iconRotationAlignment: 'map',
					      iconAllowOverlap: true,
					    }}
					  />	
				</MapboxGL.UserLocation>
				<MapboxGL.ShapeSource id='line1' shape={this.state.route}>
					<MapboxGL.LineLayer id='linelayer1' style={{lineColor:'red'}} />
				</MapboxGL.ShapeSource>
			  </MapboxGL.MapView>
			  <Text>Timestamp: {this.state.timestamp}</Text>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Altitude: {this.state.altitude}</Text>
        <Text>Heading: {this.state.heading}</Text>
        <Text>Accuracy: {this.state.accuracy}</Text>
        <Text>Speed: {this.state.speed}</Text>
		<Text>changes: {coords.length}</Text>
	   </View>
  	);
  }
  }
const styles=StyleSheet.create({
	container:{
		flex:1,
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
}

)
