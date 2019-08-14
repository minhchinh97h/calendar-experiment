import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native'

import {createStackNavigator, createAppContainer} from 'react-navigation'

import DayCalendar from './components/DayCalendar'
import WeekCalendar from './components/WeekCalendar'
import MonthCalendar from './components/MonthCalendar'

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
    MonthCalendar: {
      screen: MonthCalendar
    }
  }
)

const AppContainer = createAppContainer(StackContainer)

