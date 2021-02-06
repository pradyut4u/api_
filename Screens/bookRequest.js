import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import firebase from 'firebase'
import db from '../config.js'
import MyHeader from '../Components/myHeader';
import {BookSearch} from 'react-native-google-books';
import { FlatList } from 'react-native-gesture-handler';

export default class BookRequest extends React.Component{
	constructor(){
		super()
		this.state={
			userId:firebase.auth().currentUser.email,
			bookName: '',
			reason: '',
			requestId:'',
			docId:'',
			bookStatus:'',
			bookrequestactive:'',
			userDoc:'',
			dataSource:'',
			showFlatList:false
		}
	}
	uniqueId(){
		return(
			Math.random().toString(36).substring(7)
		)
	}
	addRequest = (bookName,reason) =>{
		var userId=this.state.userId
		var requestId=this.uniqueId()
		db.collection('requestedBook').add({
		userId:userId,bookName:bookName,reason:reason,requestId:requestId,bookStatus:"requested"})
		this.setState({
			bookName:'',
			reason:''
		})
		this.getBookRequest()
		db.collection("users").where("emailid","==",this.state.userId).get()
		.then(snapShot=>{
			snapShot.forEach(doc=>{
				db.collection("users").doc(doc.id).update({
					bookrequestactive:true
				})
			})
		})
		return(
			alert("Book requested Succesfully")
		)
	}

    getBookRequest = ()=>{
		db.collection('requestedBook').where("userId","==",this.state.userId).get()
		.then(snapShot=>{
			snapShot.forEach(doc=>{
				if(doc.data().bookStatus!=="recived"){
					this.setState({
						requestId:doc.data().requestId,
						bookStatus:doc.data().bookstatus,
						bookName:doc.data().bookName,
						docId:doc.id
					})
				}

			})
		})
	}

	bookrequestactive = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				this.setState({
					bookrequestactive:doc.data().bookrequestactive,
					userDoc:doc.id
				})
			})
		})
	}

	updateBookRequestStaus = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				db.collection("users").doc(doc.id).update({
					bookrequestactive:false
				})
			})
		})
		db.collection("requestedBook").doc(this.state.docId).update({
			bookStatus:"recived"
		})
	}

	sendNotification = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				var name = doc.data().firstName+doc.data().lastName
				db.collection("allNotifications").where("reqestId","==",this.state.requestId).onSnapshot(snapShot=>{
					snapShot.forEach(doc=>{
						var donarId = doc.data().donarId
						var bookName = doc.data().bookName
						db.collection("allNotifications").add({
							targetUserId:donarId,bookName:bookName,notificationStatus:"unread",message:name+"recived"+bookName
						})
					})
				})
			})
		})
	}

	async getBookApi(bookName){
		//alert("inside get book API")
		this.setState({
			bookName:bookName,
			showFlatList:true
		})
		if(bookName.length > 2){
	//		alert("get book API flatlist"+this.state.showFlatList)
            var books = await BookSearch.searchbook("Harry Potter","AIzaSyDs5qH61LrIlsfhtdq7aTLfcegv2FZ2h3Y")
            this.setState({
				dataSource:books.data,
				showFlatList:true
			})
	//		alert("get book API flatlist"+this.state.showFlatList)
		}
	
	}

	renderItem = ({item,i})=>{
	//	alert("inside render")
	//	alert(item.volumeInfo.title)
        let obj = {
			title:item.volumeInfo.title,selfLink:item.selfLink,buyLink:item.saleInfo.buyLink,imageLink:item.volumeInfo.imageLinks
		}
		return(
			<TouchableHighlight style={{backgroundColor:"red", padding:10, width:"80%"}}
			activeOpacity={0.5} underlayColor="orange" 
			onPress={()=>{
				this.setState({
					showFlatList:false,
					bookName:item.volumeInfo.title
				})
			}} 
			bottomDivider>
				<Text>{item.volumeInfo.title}</Text>
			</TouchableHighlight>
		)
	}

	componentDidMount(){
		this.bookrequestactive()
		this.getBookRequest()
	// var books = BookSearch.searchbook("Harry Potter","AIzaSyDs5qH61LrIlsfhtdq7aTLfcegv2FZ2h3Y")
	// console.log(books)
	}

	render(){
		console.log(this.state.bookrequestactive)
		if(this.state.bookrequestactive === true){
			return(
				<View style={{flex:1, justifyContent:'center'}}>
					<View style={{borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10}}>
						<Text>Book Name</Text>
						<Text>{this.state.bookName}</Text>
					</View>
					<View style={{borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10}}>
						<Text>Book Status</Text>
						<Text>{this.state.bookStatus}</Text>
					</View>
					<TouchableOpacity style={{
						borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10
						}}
						onPress={()=>{
							this.updateBookRequestStaus();
							this.sendNotification()
						}}>
						<Text>I recived the book</Text>
					</TouchableOpacity>
				</View>
			)
		}
		else{
		return(
			<View>
				<MyHeader title={"Request"} navigation={this.props.navigation}/>
			<KeyboardAvoidingView>
			<TextInput placeholder="Book name" onChangeText={text=>{this.getBookApi(text)}} value={this.state.bookName}/>
			
			<FlatList data={this.state.dataSource} 
				renderItem={this.renderItem} 
				style={{marginTop:20}} 
				keyExtractor={(item,index)=>index.toString()
				}></FlatList>
				
					<View>
			         <TextInput 
			           placeholder="Reason" 
			multiline numberOfLines={5}
			onChangeText={text=>{this.setState({reason:text})}} 
			value={this.state.reason}/>
			<TouchableOpacity 
			 onPress={()=>{this.addRequest(this.state.bookName,this.state.reason)}}>
			<Text>Request</Text>
			</TouchableOpacity>
			</View>
				
			</KeyboardAvoidingView>
			</View>
		)
		}
	}
}