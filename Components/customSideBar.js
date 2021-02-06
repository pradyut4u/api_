import React from 'react'
import {TouchableOpacity, StyleSheet, View, Text, TextInput} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'
import {Avatar} from 'react-native-elements'
import *as ImagePicker from 'expo-image-picker'
import db from '../config'

export default class CustomSideBar extends React.Component{
	constructor(){
		super()

		this.state={
			image:'#',
			userID:firebase.auth().currentUser.email,
			name:''
		}
	}
	
	selectPicture = async ()=>{
		const {canncelled,uri}=await ImagePicker.launchImageLibraryAsync({
			mediaTypes:ImagePicker.MediaTypeOptions.All, allowsEditing:true, aspect:[4,5], quality:1
		})
		if(!canncelled){
			this.setState({
				image:uri
			})
		}
		this.uploadImage(uri,this.state.userID)
	}

	uploadImage = async (uri,userID)=>{
	 var response = await fetch(uri)
	 var blob = await response.blob()
	 var upload = firebase.storage().ref().child("userProfile/"+userID)
	 return upload.put(blob).then(response=>{
		 this.fetchImage(userID)
	 })
	}

	fetchImage = (imageName)=>{
	 var image = firebase.storage().ref().child("userProfile/"+imageName)
	 image.getDownloadURL()
	     .then(url=>{
		 this.setState({
			 image:url
		 })
		})
		 .catch(error=>{
			 this.setState({
				 image:'#'
			 })
		 })
	}

	getUser = ()=>{
		db.collection("users").where("emailid","==",this.state.userID).onSnapshot(snapshot=>{
			snapshot.forEach(doc=>{
				this.setState({
					name:doc.data().firstName+doc.data().lastName
				})
			})
		})
	}

	componentDidMount(){
		this.fetchImage(this.state.userID)
		this.getUser()
	}

	render(){
		return(
		 <View style={{flex:1}}>
			 <View style={{flex:0.5, alignItems:"center", backgroundColor:"orange"}}>
				 <Avatar rounded source={{uri:this.state.image}} size="large" onPress={()=>this.selectPicture()} showEditButton/>
				 <Text>{this.state.name}</Text>
			 </View>
		 <View style={{flex:0.8}}>
		 <DrawerItems {...this.props}/>
		 </View>
		 <View style={{flex:0.2, justifyContent:'flex-end'}}>
		 </View>
		 <TouchableOpacity style={{height:30, width:'100%', justifyContent:'center', padding:10}}
		  onPress = {()=> {this.props.navigation.navigate('Welcome');
		 firebase.auth().signOut()}}>
		 <Text>Logout</Text>
		 </TouchableOpacity>
		 </View>
		)
	}
}