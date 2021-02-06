import React from 'react'
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView} from 'react-native'
import firebase from 'firebase'
import db from '../config.js'
import MyHeader from '../Components/myHeader'

export default class Welcome extends React.Component{
constructor(){
	super()
	this.state={
	  email: "",
	  password: "",
	  lastName: "",
	  firstName: "",
	  mobileNo: "",
	  address: "",
	  isModalVisible: false,
	  confirmPassword: ""
	}
}

showModal = () => {
	return(
	<Modal animationType="fade" visible={this.state.isModalVisible}>
	<View>
	<ScrollView>
	<KeyboardAvoidingView>
	<Text>SignUp form</Text>
	<TextInput placeholder="First Name" onChangeText={text=>{this.setState({firstName:text})}}/>
	<TextInput placeholder="Last Name" onChangeText={text=>{this.setState({lastNmae:text})}}/>
	<TextInput placeholder="Address" multiline={true} onChangeText={text=>{this.setState({address:text})}}/>
	<TextInput placeholder="Phone Number" keyboardType={'numeric'} maxLength={10} onChangeText={text=>{this.setState({mobileNo:text})}}/>
	<TextInput placeholder="Email" keyboardType={'email-address'} onChangeText={text=>{this.setState({email:text})}}/>
	<TextInput placeholder="Password" secureTextEntry={true} onChangeText={text=>{this.setState({password:text})}}/>
	<TextInput placeholder="Confirm Password" secureTextEntry={true} onChangeText={text=>{this.setState({confirmPassword:text})}}/>
	<TouchableOpacity onPress= {() => {this.usersignup(this.state.email,this.state.password,this.state.confirmPassword)}}>
	<Text>Submit</Text>
	</TouchableOpacity>
	<TouchableOpacity onPress= {() => {this.setState({isModalVisible:false})}}>
	<Text>Cancel</Text>
	</TouchableOpacity>
	</KeyboardAvoidingView>
	</ScrollView>
	</View>
	</Modal>
	)
}

usersignup = (email,password,confirmPassword) => {
if(password !== confirmPassword){
alert("Password does not match")
}
else{
		firebase.auth().createUserWithEmailAndPassword(email,password).then(response=>{return alert("User account is created")}).catch(
		function(error){
			return alert(error.message)
		}
	)
	db.collection("users").add({
	firstName:this.state.firstName,
	lastName:this.state.lastName,
	emailId:this.state.email,
	address:this.state.address,
	mobileNo:this.state.mobileNo,
	bookrequestactive:false
	})
	}
}

userloginin = (email,password) => {
	firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{return this.props.navigation.navigate("BookDonate")}).catch(
		function(error){
			return alert(error.message)
		}
	)
}

	render(){
		return(
		<View>
			
		<View>
		{this.showModal()}
		</View>
		  <TextInput placeholder="E mail" keyboardType='email-address' onChangeText={item=>{this.setState({email : item})}} style={ss.tinput}/>
		  <TextInput placeholder="Password" secureTextEntry={true} onChangeText={item=>{this.setState({password : item})}} style={ss.tinput}/>
		  <TouchableOpacity style={ss.button} onPress = {() => {this.userloginin(this.state.email,this.state.password)}}>
		  <Text>Login</Text>
		  </TouchableOpacity>

		  <TouchableOpacity style={ss.button} onPress = {() => {this.setState({isModalVisible:true})}}>
		  <Text>Signin</Text>
		  </TouchableOpacity>
		</View>
		)
	}
}

const ss = StyleSheet.create({
tinput:{
 backgroundColor : 'cyan',
 borderWidth : 5,
 marginTop : 20,
 width : 200,
 height : 50
},
button:{
	backgroundColor : 'green',
	borderRadius : 50,
	width : 100,
	height : 30,
	alignItems : "center",
	marginTop : 30
}
})