import React from 'react'
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Animated, Dimensions} from 'react-native'
import { SwipeListView } from "react-native-swipe-list-view";
import db from '../config'
import { ListItem, Icon } from "react-native-elements";

export default class SwipeFlatList extends React.Component{
    constructor(props){
        super(props);
        console.log("props")
        console.log(this.props.allNotifications)
        this.state={
            allNotifications:this.props.allNotifications
        }
    }

    renderItem = (data)=>{
        return(
        <Animated.View>
            <ListItem
             leftElement={<Icon name="book" type="font-awesome" color="green"/>}
             title={data.item.bookName} subtitle={data.item.message} titleStyle={{color:"blue",fontWeight:"bold"}}
             bottomDivider
            />
        </Animated.View>
        )
        //console.log("render")
    }

    renderHiddenItem = ()=>{
        return(
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text>
              Remove notification
          </Text>
        </View>
        //console.log("hiddenItems")
    )
        }

    onSwipeValueChange = (swipeData)=>{
        console.log(swipeData)
        var allNotifications=this.state.allNotifications
        const {key,value}=swipeData
        if(value < -Dimensions.get("window").width){
            const newData = [...allNotifications]
            newData.splice(key,1)
            this.updateread(allNotifications[key])
            this.setState({
                allNotifications:newData
            })
        }
    }

    updateread = (notification)=>{
        db.collection('allNotifications').doc(notification.docId).update({
            notificationStatus:"read"
        })
    }

    render(){
        return(
           <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get("window").width}
            previewRowKey={"0"}
            previewOpenValue={-100}
            previewOpenDelay={4000}
            onSwipeValueChange={this.onSwipeValueChange}
            keyExtractor={(Item,index)=>{
                index.toString()
            }}
           />
        )
    }
}