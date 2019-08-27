import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

export default class DayCalendar extends React.Component {
  year = new Date().getFullYear()
  month = new Date().getMonth()

  target_year = this.year + 0

  month_data_array = []

  start_index = 0

  state = {
    should_flatlist_update: 0,

    current_month_index: -1,
    last_month_index: -1,

    current_day_index: -1,
    last_day_index: -1,

  }

  chooseDay = (month_index, day_index) => {
    this.setState(prevState => ({
      current_month_index: month_index,
      last_month_index: prevState.current_month_index,
      current_day_index: day_index,
      last_day_index: prevState.current_day_index,

      should_flatlist_update: prevState.should_flatlist_update + 1
    }))
  }

  _keyExtractor = (item, index) => `month-${index}`

  _renderItem = ({ item, index }) => (
    <MonthHolder
      item={item}
      month_index={index}
      current_month_index={this.state.current_month_index}
      last_month_index={this.state.last_month_index}
      current_day_index={this.state.current_day_index}
      last_day_index={this.state.last_day_index}
      chooseDay={this.chooseDay}
    />
  )

  _onEndReached = () => {
    this.month += 1

    if (this.month > 11) {
      this.month = 0
      this.year += 1
    }

    this.initDaysInMonth(this.month, this.year)

    this.setState(prevState => ({
      should_flatlist_update: prevState.should_flatlist_update + 1
    }))
  }


  initDaysInMonth = (month, year) => {
    let first_day_of_month = new Date(year, month + 1, 1).getDate(),
      last_day_of_month = new Date(year, month + 1, 0).getDate(),
      day_data_array = []

    for (let i = first_day_of_month; i <= last_day_of_month; i++) {
      let day_in_week = new Date(year, month, i).getDay()
      day_data_array.push({
        day: i,
        month: month,
        year: year,
        day_in_week
      })
    }

    this.month_data_array.push(day_data_array)
  }

  _scrollToOffset = (index) => {
    if (this._flatlist)
      this._flatlist.scrollToOffset({ animated: false, offset: index * 400 })
  }

  _getItemLayout = (data, index) => ({
    length: 400,
    offset: 400 * index,
    index
  })

  goToWeekCalendar = () => {
      this.props.navigation.navigate('WeekCalendar')
  }

  gotoDayCalendarVer2 = () => {
    this.props.navigation.navigate('DayCalendarVer2')
}

  componentDidMount() {
    for (let i = this.year; i <= this.target_year; i++) {
      if (this.month > 11) {
        this.month = 0
      }
      while (this.month <= 11) {
        this.initDaysInMonth(this.month, i)
        this.month += 1
      }

    }

    this.start_index = this.month_data_array.length - 1

    this.year = this.target_year

    this.setState(prevState => ({
      should_flatlist_update: prevState.should_flatlist_update + 1
    }))

  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 400,
            height: 300,
            borderWidth: 1,
            borderColor: "gainsboro"
          }}
        >
          <FlatList
            data={this.month_data_array}
            extraData={this.state.should_flatlist_update}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            horizontal={true}
            onEndReachedThreshold={0.9}
            onEndReached={this._onEndReached}
            // maxToRenderPerBatch={13}
            // windowSize={13}
            // removeClippedSubviews={true}
            // initialNumToRender={1}
            getItemLayout={this._getItemLayout}
            initialScrollIndex={this.start_index}
            ref={(r) => this._flatlist = r}
          />
        </View>
        <TouchableOpacity
            style={{
                width: 130,
                height: 50,
                backgroundColor: "blue",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
            }}
            onPress={this.goToWeekCalendar}
        >
            <Text
                style={{
                    color: "white"
                }}
            >
                Week Calendar
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{
                width: 130,
                height: 50,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
            }}
            onPress={this.gotoDayCalendarVer2}
        >
            <Text
                style={{
                    color: "white"
                }}
            >
                Day Calendar Ver 2
            </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class MonthHolder extends React.Component {

  state = {
    item_array: null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.month_index === nextProps.current_month_index || this.props.month_index === nextProps.last_month_index || this.state.item_array === nextState.item_array
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.item_array === null) {
      let diff = nextProps.item[0].day_in_week === 0 ? 6 : (nextProps.item[0].day_in_week - 1)
     
      let item_array = []

      for (let i = 0; i < diff; i++) {
        item_array.push(
          <View
            key={`dummy-${i}`}
            style={styles.notChosen}
          >

          </View>
        )
      }

      return({
        item_array: [...item_array]
      })
    }


    return null
  }

  componentDidMount() {

  }


  render() {
    return (
      <View
        style={{
          flex: 1,
          width: 400,
        }}
      >
        <View
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",

          }}
        >
          <Text>{`${this.props.item[0].month} - ${this.props.item[0].year}`}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {this.state.item_array}
          {this.props.item.map((data, index) => (
            <Day
              key={`day-${index}`}
              data={data}
              day_index={index}
              {... this.props}

            />
          ))}
        </View>
      </View>
    )
  }
}

class Day extends React.Component {

  state = {
    style: styles.notChosen
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.day_index === nextProps.current_day_index) && (nextProps.month_index === nextProps.current_month_index))
      || ((nextProps.day_index === nextProps.last_day_index) && (nextProps.month_index === nextProps.current_month_index))
      || ((nextProps.day_index === nextProps.last_day_index) && (nextProps.month_index === nextProps.last_month_index))

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ((nextProps.day_index === nextProps.current_day_index) && (nextProps.month_index === nextProps.current_month_index)) {
      return ({
        style: styles.chosen
      })
    }

    else if ((nextProps.day_index === nextProps.last_day_index) && (nextProps.month_index === nextProps.current_month_index)) {
      return ({
        style: styles.notChosen
      })
    }

    else if ((nextProps.day_index === nextProps.last_day_index) && (nextProps.month_index === nextProps.last_month_index)) {
      return ({
        style: styles.notChosen
      })
    }


    return null
  }

  _onPress = () => {
    this.props.chooseDay(this.props.month_index, this.props.day_index)
  }


  render() {
    return (
      <TouchableOpacity
        style={this.state.style}
        onPress={this._onPress}
      >
        <Text>
          {this.props.data.day}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  notChosen: {
    height: 40,
    width: 400 / 7,
    justifyContent: "center",
    alignItems: "center",
  },

  chosen: {
    height: 40,
    width: 400 / 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink"
  }
});
