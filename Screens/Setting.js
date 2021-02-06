import React from 'react'
import {View, TouchableOpacity, Text, TextInput} from 'react-native'
import MyHeader from '../Components/myHeader'
import firebase from 'firebase'
import db from '../config.js'

export default class Setting extends React.Component{
constructor(){
	super()
	this.state={
	address:'',
	emailId:'',
	firstname:'',
	lastname:'',
	mobileno:'',
	docId:''
	}
}

updateUserDetails =()=>{
	console.log("insideupdate")
	db.collection("users").doc(this.state.docId).update({
	firstName:this.state.firstname,
	lastName:this.state.lastname,
	mobileNo:this.state.mobileno,
	address:this.state.address
	})
	alert("Document update succesful")
}

getUserDetails = ()=>{
	var email = firebase.auth().currentUser.email
	db.collection("users").where('emailid','==',email).get()
	.then(snapShot=>{
	snapShot.forEach(doc=>{
		var data = doc.data()
		this.setState({
			firstname:data.firstName,
			lastname:data.lastName,
			address:data.address,
			mobileno:data.mobileNo,
			emailId:data.emailid,
			docId:doc.id
		})
	})
	})
}

componentDidMount (){
	this.getUserDetails()
}

	render(){
		return(
			<View>
			<MyHeader title="Settings" navigation={this.props.navigation}/>
			<View>
			<TextInput placeholder={"First name"} onChangeText={text=>{this.setState({firstname:text})}} value={this.state.firstname}/>
			<TextInput placeholder={"Last name"} onChangeText={text=>{this.setState({lastname:text})}} value={this.state.lastname}/>
			<TextInput placeholder={"Mobile no"} onChangeText={text=>{this.setState({mobileno:text})}} value={this.state.mobileno}/>
			<TextInput placeholder={"Email Id"} onChangeText={text=>{this.setState({emailId:text})}} value={this.state.emailId}/>
			<TextInput placeholder={"Address"} multiLine={true} onChangeText={text=>{this.setState({address:text})}} value={this.state.address}/>
			<TouchableOpacity onPress = {()=>{
			this.updateUserDetails()}}>
			<Text>Save</Text>
			</TouchableOpacity>
			</View>
			</View>
		)
	}
}