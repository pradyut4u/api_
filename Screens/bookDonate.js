import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {ListItem} from 'react-native-elements'
import firebase from 'firebase'
import db from '../config.js'
import MyHeader from '../Components/myHeader.js'

export default class BookDonate extends React.Component{
constructor(){
	super()
	this.state={
		requestedBookList:[]
	}
	this.requestref=null
}

getBookList = () =>{
this.requestref=db.collection("requestedBook").onSnapshot(snapShot=>{
	var bookList = snapShot.docs.map(doc=>doc.data())
	this.setState({
		requestedBookList:bookList
	})
})
}

componentDidMount (){
	this.getBookList()
}

componentWillUnmount (){
	this.requestref()
}

keyExtractor = (item,index) =>{
 index.toString()
}
renderItem = ({item,i}) =>{
return(
	<ListItem key={i} title={item.bookName} subtitle={item.reason} titleStyle={{color:"blue",fontWeight:"bold"}}
	rightElement={
	<TouchableOpacity onPress = {()=>{this.props.navigation.navigate("Reciver",{'details':item})}}>
	<Text>View</Text>
	</TouchableOpacity>}
	bottomDivider
	/>
)
}
render(){
	return(
		<View>
		<MyHeader title='Donate books' navigation={this.props.navigation}/>
		<View>
		{this.state.requestedBookList.length===0?
		(<Text>List of books</Text>)
		:(<FlatList keyExtractor={this.keyExtractor}data={this.state.requestedBookList} renderItem={this.renderItem}/>)}
		</View>
		</View>
	)
}
}