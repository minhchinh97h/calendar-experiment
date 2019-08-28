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

    translateX = new Animated.Value(0)
    old_translateX = 0
    record_translateX = 0

    translateX_2 = new Animated.Value(this.dimension_width)
    record_translateX_2 = this.dimension_width

    translateX_3 = new Animated.Value(- this.dimension_width)
    record_translateX_3 = - this.dimension_width

    accerlation_value = 100

    main_index = 0

    opacity_0 = new Animated.Value(1)
    opacity_1 = new Animated.Value(1)
    opacity_2 = new Animated.Value(1)

    record_opacity_0 = 1
    record_opacity_1 = 1
    record_opacity_2 = 1

    state = {
        month_0: new Date().getMonth(),
        month_1: new Date().getMonth() + 1 > 11 ? 0 : new Date().getMonth(),
        month_2: 0,

        year_0: new Date().getFullYear(),
        year_1: 0,
        year_2: 0
    }

    componentDidMount() {
        let month_0 = new Date().getMonth(),
            year_0 = new Date().getFullYear(),
            month_1, year_1 = year_0,
            month_2, year_2 = year_0

        month_1 = month_0 + 1
        if (month_1 > 11) {
            month_1 = 0
            year_1 += 1
        }

        month_2 = month_0 - 1
        if (month_2 < 0) {
            month_2 = 11
            year_2 -= 1
        }

        this.setState({
            month_0,
            month_1,
            month_2,
            year_0,
            year_1,
            year_2
        })
    }


    _onGestureEvent = Animated.event(
        [
            {},
        ],
        {
            listener: ({ nativeEvent }) => {
                this.record_translateX += nativeEvent.translationX - this.old_translateX
                this.record_translateX_2 += nativeEvent.translationX - this.old_translateX
                this.record_translateX_3 += nativeEvent.translationX - this.old_translateX
                this.old_translateX = nativeEvent.translationX

                this.translateX.setValue(this.record_translateX)
                this.translateX_2.setValue(this.record_translateX_2)
                this.translateX_3.setValue(this.record_translateX_3)

                if (this.main_index === 0) {
                    if (this.record_translateX >= -120 && this.record_translateX <= 120) {
                        this.opacity_1.setValue(1)
                        this.opacity_2.setValue(1)
                    }

                    this.record_opacity_0 = (this.dimension_width - Math.abs(this.record_translateX)) / (this.dimension_width * 1.3)
                    this.opacity_0.setValue(this.record_opacity_0)

                }

                else if (this.main_index === 1) {
                    if (this.record_translateX_2 >= -120 && this.record_translateX_2 <= 120) {
                        this.opacity_0.setValue(1)
                        this.opacity_2.setValue(1)
                    }

                    this.record_opacity_1 = (this.dimension_width - Math.abs(this.record_translateX_2)) / (this.dimension_width * 1.3)
                    this.opacity_1.setValue(this.record_opacity_1)
                }

                else {
                    if (this.record_translateX_3 >= -120 && this.record_translateX_3 <= 120) {
                        this.opacity_0.setValue(1)
                        this.opacity_1.setValue(1)
                    }

                    this.record_opacity_2 = (this.dimension_width - Math.abs(this.record_translateX_3)) / (this.dimension_width * 1.3)
                    this.opacity_2.setValue(this.record_opacity_2)
                }
            }
        }
    )

    handleAnimation = (main_index) => {
        // translateX
        if (main_index === 0) {
            if (this.record_translateX >= -120 && this.record_translateX <= 120) {
                this.opacity_0.setValue(1)

                this.record_translateX = 0
                this.record_translateX_2 = this.dimension_width
                this.record_translateX_3 = -this.dimension_width

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()
            }

            // swipe left
            else if (this.record_translateX < -120) {
                this.record_translateX = -this.dimension_width
                this.record_translateX_2 = 0
                this.record_translateX_3 = this.dimension_width

                this.main_index = 1

                this.translateX_3.setValue(this.record_translateX_3)

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

                let { month_1, month_2, year_1, year_2 } = this.state

                month_2 = month_1 + 1
                year_2 = year_1

                if (month_2 > 11) {
                    month_2 = 0
                    year_2 = year_1 + 1
                }

                this.setState({
                    month_2,
                    year_2
                })
            }

            // swipe right
            else if (this.record_translateX > 120) {
                this.record_translateX = this.dimension_width
                this.record_translateX_2 = - this.dimension_width
                this.record_translateX_3 = 0

                this.main_index = 2

                this.translateX_2.setValue(this.record_translateX_2)

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

                let { month_1, month_2, year_1, year_2 } = this.state

                month_1 = month_2 - 1
                year_1 = year_2

                if (month_1 < 0) {
                    month_1 = 11
                    year_1 = year_2 - 1
                }

                this.setState({
                    month_1,
                    year_1
                })
            }
        }

        // translateX_2
        else if (main_index === 1) {
            if (this.record_translateX_2 >= -120 && this.record_translateX_2 <= 120) {
                this.opacity_1.setValue(1)

                this.record_translateX_2 = 0
                this.record_translateX = -this.dimension_width
                this.record_translateX_3 = this.dimension_width

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()
            }

            else if (this.record_translateX_2 < -120) {
                this.record_translateX_2 = -this.dimension_width
                this.record_translateX = this.dimension_width
                this.record_translateX_3 = 0

                this.main_index = 2

                this.translateX.setValue(this.record_translateX)

                Animated.parallel([
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),

                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

                let { month_0, month_2, year_0, year_2 } = this.state

                month_0 = month_2 + 1
                year_0 = year_2

                if (month_0 > 11) {
                    month_0 = 0
                    year_0 = year_2 + 1
                }

                this.setState({
                    month_0,
                    year_0
                })
            }

            else if (this.record_translateX_2 > 120) {
                this.record_translateX_2 = this.dimension_width
                this.record_translateX = 0
                this.record_translateX_3 = - this.dimension_width

                this.main_index = 0

                this.translateX_3.setValue(this.record_translateX_3)

                Animated.parallel([
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),

                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

                let { month_0, month_2, year_0, year_2 } = this.state

                month_2 = month_0 - 1
                year_2 = year_0

                if (month_2 < 0) {
                    month_2 = 11
                    year_2 = year_0 - 1
                }

                this.setState({
                    month_2,
                    year_2
                })
            }
        }

        // translateX_3
        else {
            if (this.record_translateX_3 >= -120 && this.record_translateX_3 <= 120) {
                this.opacity_2.setValue(1)

                this.record_translateX_3 = 0
                this.record_translateX_2 = -this.dimension_width
                this.record_translateX = this.dimension_width

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()
            }

            else if (this.record_translateX_3 < -120) {
                this.record_translateX_3 = -this.dimension_width
                this.record_translateX_2 = this.dimension_width
                this.record_translateX = 0

                this.main_index = 0

                this.translateX_2.setValue(this.record_translateX_2)

                Animated.parallel([
                    Animated.spring(this.translateX, {
                        toValue: this.record_translateX
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

                let { month_0, month_1, year_0, year_1 } = this.state

                month_1 = month_0 + 1
                year_1 = year_0

                if (month_1 > 11) {
                    month_1 = 0
                    year_1 = year_0 + 1
                }

                this.setState({
                    month_1,
                    year_1
                })
            }

            else if (this.record_translateX_3 > 120) {
                this.record_translateX_3 = this.dimension_width
                this.record_translateX_2 = 0
                this.record_translateX = -this.dimension_width

                this.main_index = 1

                this.translateX.setValue(this.record_translateX)

                Animated.parallel([
                    Animated.spring(this.translateX_2, {
                        toValue: this.record_translateX_2
                    }),
                    Animated.spring(this.translateX_3, {
                        toValue: this.record_translateX_3
                    })
                ],
                    {
                        stopTogether: true
                    }
                ).start()

                let { month_0, month_1, year_0, year_1 } = this.state

                month_0 = month_1 - 1
                year_0 = year_1

                if (month_0 < 0) {
                    month_0 = 1
                    year_0 = year_1 - 1
                }

                this.setState({
                    month_0,
                    year_0
                })
            }

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
                            transform: [{ translateX: this.translateX }],
                            opacity: this.opacity_0,
                        }}
                    >
                        <Calendar
                            month={this.state.month_0}
                            year={this.state.year_0}
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
                            opacity: this.opacity_1,
                        }}
                    >
                        <Calendar
                            month={this.state.month_1}
                            year={this.state.year_1}
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
                            transform: [{ translateX: this.translateX_3 }],
                            position: "absolute",
                            backgroundColor: "gainsboro",
                            opacity: this.opacity_2,
                        }}
                    >
                        <Calendar
                            month={this.state.month_2}
                            year={this.state.year_2}
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