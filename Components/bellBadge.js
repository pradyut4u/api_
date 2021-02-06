import React from 'react'
import {View, TouchableOpaacity, Text, TextInput} from 'react-navigation'
import {Header, Icon, Badge} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'

export default class Bellbadge extends React.Component{
	
	render(){
	return(
		<View>
			<Icon name="bell" type='font-awesome' color='cyan' onPress = {()=>{this.props.navigation.navigate("Notification")}}/>
			
		</View>
	)
	}
}