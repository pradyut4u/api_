import React from 'react'
import { View, TouchableOpacity, Text, FlatList } from 'react-native'
import {ListItem} from 'react-native-elements'
import MyHeader from '../Components/myHeader'
import  firebase from 'firebase'
import db from '../config.js'
import SwipeFlatList from '../Components/swipeFlatList'

export default class Notification extends React.Component{
    constructor(props){
        super()
        this.state={
            allNotifications:[],
            userId:firebase.auth().currentUser.email
        }
        this.notificationref=null
    }

    getNotifications =()=>{
        this.notificationref=db.collection('allNotifications')
        .where('notificationStatus','==','unread')
        .where('targetUserId','==',this.state.userId)
        .onSnapshot(snapshot=>{
            var allNotifications=[]
            snapshot.docs.map(doc=>{
                var notification=doc.data()
                notification["docId"]=doc.id
                allNotifications.push(notification)
            })

            this.setState({
                allNotifications:allNotifications
            })
        })
    }

    componentDidMount(){
        this.getNotifications()
    }

    componentWillUnmount(){
        this.notificationref
    }

    keyExtractor = (item,index) =>{
        index.toString()
       }
       renderItem = ({item,i}) =>{
       return(
           <ListItem key={i} title={item.bookName} subtitle={item.message} titleStyle={{color:"blue",fontWeight:"bold"}}
           bottomDivider
           />
       )
       }

       render(){
           return(
               <View style={{flex:1}}>
                  <View style={{flex:0.1}}>
                      <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
                  </View>
                  <View style={{flex:0.8}}>
                  {this.state.allNotifications.length===0?
                  (<Text>List of books</Text>)
                  ://(<FlatList keyExtractor={this.keyExtractor}data={this.state.allNotifications} renderItem={this.renderItem}/>)
                  (<SwipeFlatList allNotifications={this.state.allNotifications}/>)
                }
                  </View>
               </View>
           )
       }
}