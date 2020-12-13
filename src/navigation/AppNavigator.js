import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from '../screens/HomeScreen';
import SensorsComponent from '../components/SensorsComponent';
import SettingsNavigator from '../navigation/SettingsNavigator';
import {Image} from 'react-native';
// import {createStackNavigator} from 'react-navigation-stack';
// import ChangeEmail from '../screens/ChangeEmail';
// import ChangePassword from '../screens/ChangePassword';
// import ChangeName from '../screens/ChangeName';

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <Image
            source={require('../../assets/main-logo.png')}
            style={{height: 24, width: 24, tintColor: tintColor}}
          />
        ),
      },
    },
    BLE: {
      screen: SensorsComponent,
      navigationOptions: {
        tabBarLabel: 'BLE',
        tabBarIcon: ({tintColor}) => (
          <Image
            source={require('../../assets/main-logo.png')}
            style={{height: 24, width: 24, tintColor: tintColor}}
          />
        ),
      },
    },
    Setting: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => (
          <Image
            source={require('../../assets/main-logo.png')}
            style={{height: 24, width: 24, tintColor: tintColor}}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#1e96fc',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white',
        shadowOffset: {width: 5, height: 3},
        shadowColor: '#1e96fc',
        shadowOpacity: 0.5,
        elevation: 5,
      },
    },
  },
);
export default AppNavigator;
