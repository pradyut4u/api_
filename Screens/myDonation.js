import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {ListItem, Icon, Card} from 'react-native-elements'
import firebase from 'firebase'
import db from '../config.js'
import MyHeader from '../Components/myHeader'

export default class MyDonation extends React.Component{
    constructor(){
        super()

        this.state={
         donarId:firebase.auth().currentUser.email,
         donarName:"",
         allDonation:[]
        }
        this.requestRef=null
    }
    getDonarDetails = ()=>{
        db.collection('users').where('emailid','==',this.state.donarId).get()
        .then(snapShot=>{
            snapShot.forEach(doc=>{this.setState({
                donarName:doc.data().firstName+''+doc.data().lastName
            })})
        })
    }

    getDonation = ()=>{
        this.requestRef=db.collection('donations').where('donarId','==',this.state.donarId)
        .onSnapshot(snapshot=>{
            var allDonation=[]
            snapshot.docs.map(doc=>{
                var donation = doc.data()
                donation ["docId"]=doc.id
                allDonation.push(donation) 
            })
            this.setState({
                allDonation:allDonation
            })
        })
    }
    sendBook = (bookDetails)=>{
     if(bookDetails.requestStatus==="book sent"){
         var requestStatus="Donar Interested"
         db.collection('donations').doc(bookDetails.docId).update({
             requestStatus:"Donar Interested"
         })
     }
     else{
        var requestStatus="Donar Sent"
        db.collection('donations').doc(bookDetails.docId).update({
            requestStatus:"Donar Sent"
        })
     }
    }

    sendNotification = (bookDetails,requestStatus)=>{
        var requestId=bookDetails.requestId
        var donarId=bookDetails.donarId 
        db.collection('allNotifications').where('requestId','==',requestId).where('donarId','==',donarId).get()
        .then(snapShot=>{
            snapshot.forEach(doc=>{
             var message=''
             if(requestStatus==="book sent"){
                 message=this.state.donarName+"sent you the book"
             }
             else{
                message=this.state.donarName+"is interested in sending you the book"
             }
             db.collection('allNotifications').doc(doc.id).update({
                 message:message,
                 notificationStatus:"unread",
                 date:firebase.firestore.FieldValue.serverTimestamp()
             })
            })
        })
    }

    keyExtractor = (item,index) =>{
        index.toString()
       }
       renderItem = ({item,i}) =>{
       return(
           <ListItem key={i} title={item.bookName} subtitle={item.requestedBy+item.requestStatus}
           leftElement={
               <Icon name='book' type="font-awesome" color="cyan"></Icon>
           }
           titleStyle={{color:"blue",fontWeight:"bold"}}
           rightElement={
           <TouchableOpacity onPress={()=>{this.sendBook(item)}}>
           <Text>{item.requestStatus==="book sent"?"book sent":"send book"}</Text>
           </TouchableOpacity>}
           bottomDivider
           />
       )
       }
       componentDidMount(){
           this.getDonarDetails()
           this.getDonation()
       }
       componentWillUnmount(){
           this.requestRef()
       }
       render(){
           return(
               <View style={{flex:1}}>
                   <MyHeader title={"Donation"} navigation={this.props.navigation}/>
               <View>{this.state.allDonation.length===0
               ?(<View><Text>List of all donations</Text></View>)
            :(<FlatList keyExtractor={this.keyExtractor} data={this.state.allDonation} renderItem={this.renderItem}></FlatList>)}</View>
            </View>
           )
       }
}