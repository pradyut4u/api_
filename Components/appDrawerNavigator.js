import React from 'react'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {AppTabNavigator} from './AppTabNavigator.js'
import CustomSideBar from './customSideBar.js'
import Setting from '../Screens/Setting.js'
import MyDonation from '../Screens/myDonation.js'
import Notification from '../Screens/notification.js'

export const AppDrawerNavigator = createDrawerNavigator({
	Home:{screen:AppTabNavigator},
	MyDonation:{screen:MyDonation},
	Setting:{screen:Setting},
	Notification:{screen:Notification}
},{contentComponent:CustomSideBar},{intialRouteName:'Home'})