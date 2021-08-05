import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
navigator.geolocation = require('@react-native-community/geolocation');

import ShowMap from './components/showMap'

export default class App extends Component{

	render(){
	return(
	<ShowMap></ShowMap>
	)
	}

}

