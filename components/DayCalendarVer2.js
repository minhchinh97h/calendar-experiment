import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native'

import { PanGestureHandler, State } from 'react-native-gesture-handler'

export default class DayCalendarVer2 extends React.Component {

    dimension_width = Dimensions.get("window").width

    old_translateX = 0

    main_index = 0

    translateX_array = [new Animated.Value(0), new Animated.Value(this.dimension_width), new Animated.Value(-this.dimension_width)]
    record_translateX_array = [0, this.dimension_width, -this.dimension_width]
    opacity_array = [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]

    scrolled_month = 0
    scrolled_year = 0

    state = {
        month_array: [0, 0, 0],
        year_array: [0, 0, 0]
    }

    componentDidMount() {
        let current_month = new Date().getMonth(),
            current_year = new Date().getFullYear(),
            month_array = [], year_array = []

        if (current_month === 0) {
            month_array = [current_month, current_month + 1, 11]
            year_array = [current_year, current_year, current_year - 1]
        }

        else if (current_month === 11) {
            month_array = [current_month, 0, current_month - 1]
            year_array = [current_year, current_year + 1, current_year]
        }

        else {
            month_array = [current_month, current_month + 1, current_month - 1]
            year_array = [current_year, current_year, current_year]
        }

        this.setState({
            month_array: [... month_array],
            year_array: [... year_array]
        })
    }

    handleMonthYearWhenSwipe = (swipe_direction, main_index) => {
        let month_array = [... this.state.month_array],
            year_array = [... this.state.year_array]

        // swipe to the right => go back in calendar => decrease month
        if (swipe_direction === 1) {
            if (month_array[main_index] === 0) {
                if (main_index === 0) {
                    month_array[2] = 11
                    year_array[2] = year_array[main_index] - 1
                }

                else {
                    month_array[(main_index - 1) % 3] = 11
                    year_array[(main_index - 1) % 3] = year_array[main_index] - 1
                }
            }

            else {
                if (main_index === 0) {
                    month_array[2] = month_array[main_index] - 1
                    year_array[2] = year_array[main_index]
                }

                else {
                    month_array[(main_index - 1) % 3] = month_array[main_index] - 1
                    year_array[(main_index - 1) % 3] = year_array[main_index]
                }
            }
        }

        // swipe to the left => go forward in calendar => increase month
        else {
            if (month_array[main_index] === 11) {
                month_array[(main_index + 1) % 3] = 0
                year_array[(main_index + 1) % 3] = year_array[main_index] + 1
            }

            else {
                month_array[(main_index + 1) % 3] = month_array[main_index] + 1
                year_array[(main_index + 1) % 3] = year_array[main_index]
            }
        }

        this.setState({
            month_array: [...month_array],
            year_array: [...year_array]
        })
    }


    _onGestureEvent = Animated.event(
        [
            {},
        ],
        {
            listener: ({ nativeEvent }) => {
                this.record_translateX_array.forEach((translate, index, arr) => {
                    arr[index] += nativeEvent.translationX - this.old_translateX
                })

                this.translateX_array.forEach((translate, index, arr) => {
                    arr[index].setValue(this.record_translateX_array[index])
                })

                this.old_translateX = nativeEvent.translationX

                if (this.record_translateX_array[this.main_index] >= -120 && this.record_translateX_array[this.main_index] <= 120) {
                    this.opacity_array[(this.main_index + 1) % 3].setValue(1)

                    if (this.main_index === 0) {
                        this.opacity_array[2].setValue(1)
                    }
                    else {
                        this.opacity_array[(this.main_index - 1) % 3].setValue(1)
                    }
                }

                this.opacity_array[this.main_index].setValue((this.dimension_width - Math.abs(this.record_translateX_array[this.main_index])) / (this.dimension_width * 1.3))
            }
        }
    )

    handleAnimation = (main_index) => {
        if (this.record_translateX_array[main_index] >= -120 && this.record_translateX_array[main_index] <= 120) {
            this.opacity_array[main_index].setValue(1)


            this.record_translateX_array[main_index] = 0
            this.record_translateX_array[(main_index + 1) % 3] = this.dimension_width

            if (main_index - 1 < 0) {
                main_index = 6
            }

            this.record_translateX_array[(main_index - 1) % 3] = - this.dimension_width

            let animation_array = this.translateX_array.map((translate, index) =>
                Animated.spring(this.translateX_array[index], {
                    toValue: this.record_translateX_array[index]
                })
            )

            Animated.parallel(
                animation_array,
                {
                    stopTogether: true
                }
            ).start()
        }

        else if (this.record_translateX_array[main_index] < -120) {

            this.record_translateX_array[main_index] = - this.dimension_width
            this.record_translateX_array[(main_index + 1) % 3] = 0

            if (main_index - 1 < 0) {
                main_index = 6
            }

            this.record_translateX_array[(main_index - 1) % 3] = this.dimension_width

            this.translateX_array[(main_index - 1) % 3].setValue(this.dimension_width)


            let animation_array = this.translateX_array.map((translate, index) => {
                if (index !== (main_index - 1) % 3)
                    return (
                        Animated.spring(this.translateX_array[index], {
                            toValue: this.record_translateX_array[index]
                        })
                    )
            })

            Animated.parallel(
                animation_array,
                {
                    stopTogether: true
                }
            ).start()

            this.handleMonthYearWhenSwipe(-1, this.main_index)


            this.main_index = (main_index + 1) % 3
        }

        else if (this.record_translateX_array[main_index] > 120) {

            this.record_translateX_array[main_index] = this.dimension_width

            this.record_translateX_array[(main_index + 1) % 3] = - this.dimension_width

            this.translateX_array[(main_index + 1) % 3].setValue(-this.dimension_width)

            if (main_index - 1 < 0) {
                main_index = 6
            }
            this.record_translateX_array[(main_index - 1) % 3] = 0


            let animation_array = this.translateX_array.map((translate, index) => {
                if (index !== (main_index + 1) % 3)
                    return (
                        Animated.spring(this.translateX_array[index], {
                            toValue: this.record_translateX_array[index]
                        })
                    )
            })

            Animated.parallel(
                animation_array,
                {
                    stopTogether: true
                }
            ).start()

            this.handleMonthYearWhenSwipe(1, this.main_index)

            this.main_index = (main_index - 1) % 3
        }
    }

    _onHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            this.old_translateX = 0

            this.handleAnimation(this.main_index)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.should_update !== prevState.should_update) {
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <PanGestureHandler
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onHandlerStateChange}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ translateX: this.translateX_array[0] }],
                            opacity: this.opacity_array[0],
                        }}
                    >
                        <Calendar
                            month={this.state.month_array[0]}
                            year={this.state.year_array[0]}
                        />
                    </Animated.View>
                </PanGestureHandler>

                <PanGestureHandler
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onHandlerStateChange}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ translateX: this.translateX_array[1] }],
                            position: "absolute",
                            backgroundColor: "pink",
                            opacity: this.opacity_array[1],
                        }}
                    >
                        <Calendar
                            month={this.state.month_array[1]}
                            year={this.state.year_array[1]}
                        />
                    </Animated.View>
                </PanGestureHandler>

                <PanGestureHandler
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onHandlerStateChange}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ translateX: this.translateX_array[2] }],
                            position: "absolute",
                            backgroundColor: "gainsboro",
                            opacity: this.opacity_array[2],
                        }}
                    >
                        <Calendar
                            month={this.state.month_array[2]}
                            year={this.state.year_array[2]}
                        />
                    </Animated.View>
                </PanGestureHandler>
            </View>
        )
    }

}

class Calendar extends React.Component {

    state = {
        month_data_array: []
    }

    initDaysInMonth = (month, year) => {
        let month_data_array = []

        let first_day_of_month = new Date(year, month + 1, 1).getDate(),
            last_day_of_month = new Date(year, month + 1, 0).getDate()

        for (let i = first_day_of_month; i <= last_day_of_month; i++) {
            let day_in_week = new Date(year, month, i).getDay()
            month_data_array.push({
                day: i,
                month: month,
                year: year,
                day_in_week
            })
        }

        this.setState({
            month_data_array: [...month_data_array]
        })
    }

    componentDidMount() {
        this.initDaysInMonth(this.props.month, this.props.year)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.month !== prevProps.month) {
            this.initDaysInMonth(this.props.month, this.props.year)
        }
    }

    render() {
        return (
            <View
                style={{
                    width: 400,
                    height: 300,
                    borderWidth: 1,
                    borderColor: "gainsboro"
                }}
            >
                <MonthHolder
                    month_data_array={this.state.month_data_array}
                />
            </View>
        )
    }

}

class MonthHolder extends React.Component {

    state = {
        fill_array: null,
        month_text: "",
        year_text: ""
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.month_data_array !== prevProps.month_data_array) {
            let diff = this.props.month_data_array[0].day_in_week === 0 ? 6 : (this.props.month_data_array[0].day_in_week - 1)

            let fill_array = []

            for (let i = 0; i < diff; i++) {
                fill_array.push(
                    <View
                        key={`dummy-${i}`}
                        style={styles.notChosen}
                    >

                    </View>
                )
            }

            this.setState({
                fill_array: [...fill_array],
                month_text: this.props.month_data_array[0].month,
                year_text: this.props.month_data_array[0].year
            })
        }
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
                    <Text>{`${this.state.month_text} - ${this.state.year_text}`}</Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    {this.state.fill_array}
                    {this.props.month_data_array.map((data, index) => (
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
            // onPress={this._onPress}
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