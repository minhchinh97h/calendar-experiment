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
    month = new Date().getMonth()
    year = new Date().getFullYear()

    dimension_width = Dimensions.get("window").width

    translateX = new Animated.Value(0)
    old_translateX = 0
    record_translateX = 0

    translateX_2 = new Animated.Value(this.dimension_width)
    record_translateX_2 = this.dimension_width


    displacement = 0
    old_velocityX = 0

    accerlation_value = 100

    _onGestureEvent = Animated.event(
        [
            {},
        ],
        {
            listener: ({ nativeEvent }) => {
                this.record_translateX += nativeEvent.translationX - this.old_translateX
                this.record_translateX_2 += nativeEvent.translationX - this.old_translateX
                this.old_translateX = nativeEvent.translationX

                this.translateX.setValue(this.record_translateX)
                this.translateX_2.setValue(this.record_translateX_2)

                // this.displacement = nativeEvent.velocityX - this.old_velocityX
                // this.old_velocityX = nativeEvent.velocityX
            }
        }
    )

    _onHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            this.old_translateX = 0

            if ((this.record_translateX >= -120) && (this.record_translateX <= 120)) {
                this.record_translateX = 0
                this.record_translateX_2 = this.dimension_width

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: 0
                    }),
                    Animated.spring(this.translateX_2, {
                        toValue: this.dimension_width
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

            }

            else if ((this.record_translateX < -120)) {
                this.record_translateX = -this.dimension_width
                this.record_translateX_2 = 0
                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()
            }

            // console.log(this.displacement)

            // if (this.displacement < -90) {
            //     this.record_translateX = -this.dimension_width
            //     this.record_translateX_2 = 0
            //     Animated.parallel([
            //         Animated.spring(this.translateX, {
            //             toValue: this.record_translateX
            //         }),
            //         Animated.spring(this.translateX_2, {
            //             toValue: this.record_translateX_2
            //         })
            //     ],
            //         {
            //             stopTogether: true
            //         }
            //     ).start()
            // }

            // else if (this.displacement > 100){
            //     this.record_translateX = 0
            //     this.record_translateX_2 = this.dimension_width
            //     Animated.parallel([
            //         Animated.spring(this.translateX, {
            //             toValue: this.record_translateX
            //         }),
            //         Animated.spring(this.translateX_2, {
            //             toValue: this.record_translateX_2
            //         })
            //     ],
            //         {
            //             stopTogether: true
            //         }
            //     ).start()
            // }

            // else {
            //     this.record_translateX = 0
            //     this.record_translateX_2 = this.dimension_width

            //     Animated.parallel([
            //         Animated.spring(this.translateX, {
            //             toValue: 0
            //         }),
            //         Animated.spring(this.translateX_2, {
            //             toValue: this.dimension_width
            //         })
            //     ],
            //         {
            //             stopTogether: true
            //         }
            //     ).start()

            // }

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
                            transform: [{ translateX: this.translateX }]
                        }}
                    >
                        <Calendar
                            month={this.month}
                            year={this.year}
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
                            transform: [{ translateX: this.translateX_2 }],
                            position: "absolute",
                            backgroundColor: "pink",
                        }}
                    >
                        <Calendar
                            month={this.month}
                            year={this.year}
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
        if (this.props.translateX !== prevProps.translateX) {
            // console.log(this.props.translateX)
        }
    }

    render() {
        return (
            // <Animated.View
            //     style={{
            //         flex: 1,
            //         justifyContent: "center",
            //         alignItems: "center",
            //         transform: [{ translateX: this.props.translateX }]
            //     }}
            // >
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

            // </Animated.View>
        )
    }

}

class MonthHolder extends React.Component {

    state = {
        fill_array: null,
        month_text: "",
        year_text: ""
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   return this.props.month_index === nextProps.current_month_index || this.props.month_index === nextProps.last_month_index || this.state.item_array === nextState.item_array
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.fill_array === null && nextProps.month_data_array.length > 0) {
            let diff = nextProps.month_data_array[0].day_in_week === 0 ? 6 : (nextProps.month_data_array[0].day_in_week - 1)

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

            return ({
                fill_array: [...fill_array],
                month_text: nextProps.month_data_array[0].month,
                year_text: nextProps.month_data_array[0].year
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