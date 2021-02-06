import React from 'react'
import {Image} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import BookDonate from '../Screens/bookDonate.js'
import BookRequest from '../Screens/bookRequest.js'
import {AppStackNavigator} from './appStackNavigator.js'


export const AppTabNavigator = createBottomTabNavigator({
BookDonate : { screen: AppStackNavigator,
navigationOptions:{ tabBarIcon : <Image source={require("../assets/request-book.png")}
style={{width:20, height:20}}/>, tabBarLabel : "Donate Books", } },

BookRequest: { screen: BookRequest, 
navigationOptions :{ tabBarIcon : <Image source={require("../assets/request-list.png")}
style={{width:20, height:20}}/>, tabBarLabel : "Book Request", } } 
});