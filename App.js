import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native'

import {createStackNavigator, createAppContainer} from 'react-navigation'

import DayCalendar from './components/DayCalendar'
import WeekCalendar from './components/WeekCalendar'
import DayCalendarVer2 from './components/DayCalendarVer2'

export default class App extends React.Component {
  
  render() {
    return (
      <AppContainer />
    )
  }
}

const StackContainer = createStackNavigator(
  {
    DayCalendar: {
      screen: DayCalendar
    },
    WeekCalendar: {
      screen: WeekCalendar
    },
    DayCalendarVer2: {
      screen: DayCalendarVer2
    }
  }
)

const AppContainer = createAppContainer(StackContainer)

