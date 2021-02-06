import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './Screens/welcome.js'
import {AppTabNavigator} from './Components/AppTabNavigator.js'
import {AppDrawerNavigator} from './Components/appDrawerNavigator.js'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'

export default class App extends React.Component {
render (){
  return (
   <AppContainer/>
  );
  }
}

const switchNavigator = createSwitchNavigator({
    Welcome:{screen:Welcome},
    Drawer:{screen:AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator)