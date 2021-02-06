import React from 'react'
import {createStackNavigator} from 'react-navigation-stack' 
import BookDonate from '../Screens/bookDonate.js'
import BookReciver from '../Screens/bookReciver.js'

export const AppStackNavigator=createStackNavigator({
    Donate:{screen:BookDonate},
    Reciver:{screen:BookReciver}
},{
    intialRouteName:'Donate'
})