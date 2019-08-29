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
    // the width of the current mobile screen, will be use as two ends of translation X range. In my code,
    // a month calendar will be wrapped in a View component that has a width of dimension_width. So to fit your
    // purposes, do adjustments based on dimension_width.
    dimension_width = Dimensions.get("window").width

    // to record the last translation X occured from Panning Gesture event handler
    old_translateX = 0

    // to keep track of the current item that is visible. Index is regarded to translateX_array, record_translateX_array and opacity_array
    main_index = 0

    // hold indexed Animated value for each View component of translateX property
    translateX_array = [new Animated.Value(0), new Animated.Value(this.dimension_width), new Animated.Value(-this.dimension_width)]

    // hold indexed Animated value in float number for other usages (Animated value is not number)
    record_translateX_array = [0, this.dimension_width, -this.dimension_width]

    // hold indexed Animated value for opacity property per View component. This is used to create fading effect. (optional)
    opacity_array = [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]

    state = {
        month_array: [0, 0, 0], // hold month data accordingly to each View component
        year_array: [0, 0, 0] // hold the numbers of year accordingly to each View component
    }

    componentDidMount() {
        // below we initialize month_array and year_array.
        // We set up our order in the screen as 2 0 1 (based on index).
        // Index 2 View component will be the previous month, index 0 component will be the current month and index 1 component will be the following month.
        let current_month = new Date().getMonth(),
            current_year = new Date().getFullYear(),
            month_array = [], year_array = []

        // check if the current month is January or not
        if (current_month === 0) {
            month_array = [current_month, current_month + 1, 11]
            year_array = [current_year, current_year, current_year - 1]
        }

        // check if the current month is December or not
        else if (current_month === 11) {
            month_array = [current_month, 0, current_month - 1]
            year_array = [current_year, current_year + 1, current_year]
        }

        // if both cases are not met, proceed as normal
        else {
            month_array = [current_month, current_month + 1, current_month - 1]
            year_array = [current_year, current_year, current_year]
        }

        this.setState({
            month_array: [...month_array],
            year_array: [...year_array]
        })
    }

    handleMonthYearWhenSwipe = (swipe_direction, main_index) => {
        let month_array = [... this.state.month_array],
            year_array = [... this.state.year_array]

        // swipe to the right => go back in calendar => decrease month
        if (swipe_direction === 1) {
            // since decreasing month, for example, we have our order of components as 2 0 1.
            // Then, the month data of the component in the left of the currently present component will be recaculated.
            // The completed order will be 1 2 0.

            // if the month data of the present component is January, then the previous month will be December and its year is decreased by 1.
            if (month_array[main_index] === 0) {
                // we will only consider the left most and the present components which are in use. Meaning from the example above, when the set up is
                // 2 0 1, we only consider changing the months & years of index 2 and 0 components.
                if (main_index === 0) {
                    month_array[2] = 11
                    year_array[2] = year_array[main_index] - 1
                }

                // We set the month & year of the left component of the present component.
                else {
                    month_array[(main_index - 1) % 3] = 11
                    year_array[(main_index - 1) % 3] = year_array[main_index] - 1
                }
            }

            // if the month data is not January, we proceed as normal.
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
            // the set up order is considered as 2 0 1.
            // The completed order will be 0 1 2. 
            // We will only consider the present and right most components. As from the example 2 0 1, components with index 0 and 1 will
            // be considered.
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
            // This is where we do the fading and scrolling effects.
            listener: ({ nativeEvent }) => {
                // record_translateX_array will be used to handle further comparisions of X-axis translations
                // so basically record_translateX_array = translateX_array. The only difference is that items
                // that record_translateX_array hold are Number, while translateX_array's are Animated Value.
                this.record_translateX_array.forEach((translate, index, arr) => {

                    // we add the differentiate of X-axis translation to each component to create synchronizing scrolling effect.
                    arr[index] += nativeEvent.translationX - this.old_translateX
                })

                // set the Animated Value to actually make components move.
                this.translateX_array.forEach((translate, index, arr) => {
                    arr[index].setValue(this.record_translateX_array[index])
                })

                // record the last occurring translation.
                this.old_translateX = nativeEvent.translationX

                // *1

                // as said above, record_translateX_array will be used for these kinds of intents. Here we do a comparision as if
                // the translation of the present component is between -120 and 120, we will not trigger any fading effect. So to make sure
                // all the components visible, we set their opacity values to always be 1 in this case.
                if (this.record_translateX_array[this.main_index] >= -120 && this.record_translateX_array[this.main_index] <= 120) {
                    this.opacity_array[(this.main_index + 1) % 3].setValue(1)

                    if (this.main_index === 0) {
                        this.opacity_array[2].setValue(1)
                    }
                    else {
                        this.opacity_array[(this.main_index - 1) % 3].setValue(1)
                    }
                }

                // we can put the below code at *1 (before we do the comparision) to create a certain different effect.
                // the fading will be calculated as the moving-away-from-present component will fade and the coming-to-present-from-hidden component
                // will visible (not fade). So the opacity, which decides the fading of the moving-away-from-present component will be calculated based
                // on the division of its current translate X and dimension_width. For example, dimension_width = 400 and the translation X = 200, then
                // we have 0.5 opacity value (if our offset is 1). In my equation, the offset is 1.3  
                this.opacity_array[this.main_index].setValue((this.dimension_width - Math.abs(this.record_translateX_array[this.main_index])) / (this.dimension_width * 1.3))
            }
        }
    )

    // this will be called with the present component as it will be panned or scrolled.
    // We create snapping animation in this function.
    handleAnimation = (main_index) => {
        // I set -120 and 120 to be my two ends for a 'safe' range of translationX. If the present component's translationX
        // is in between, it will not trigger any scrollings.
        if (this.record_translateX_array[main_index] >= -120 && this.record_translateX_array[main_index] <= 120) {
            // make certain that the present component is visible, not faded.
            this.opacity_array[main_index].setValue(1)

            // if not making any translations, we set it back to 0.
            this.record_translateX_array[main_index] = 0
            // we set the right most component to its right-end value.
            this.record_translateX_array[(main_index + 1) % 3] = this.dimension_width

            // if main_index === 0, then the left most will have index of 2 ((6-1) % 3 = 2)
            if (main_index - 1 < 0) {
                main_index = 6
            }

            // we set the left most component to its left-end value
            this.record_translateX_array[(main_index - 1) % 3] = - this.dimension_width

            // spring animation provided from Animated will do the trick. We can tweak its options to create a more wanted snapping effect.
            let animation_array = this.translateX_array.map((translate, index) =>
                Animated.spring(this.translateX_array[index], {
                    toValue: this.record_translateX_array[index]
                })
            )

            // activate the animations concurrently.
            Animated.parallel(
                animation_array,
                {
                    stopTogether: true
                }
            ).start()
        }

        // if the translation of the present component is lower than the left limit => we swipe to the left => go to the future calendars.
        else if (this.record_translateX_array[main_index] < -120) {

            // the present component will become the left most component, so its translation will be changed.
            this.record_translateX_array[main_index] = - this.dimension_width
            // the right most component will become the present.
            this.record_translateX_array[(main_index + 1) % 3] = 0

            // if main_index === 0, then the left most will have index of 2 ((6-1) % 3 = 2)
            if (main_index - 1 < 0) {
                main_index = 6
            }

            // the left most component will be the right most component.
            this.record_translateX_array[(main_index - 1) % 3] = this.dimension_width

            // we do not do any spring animations for the left most component, since its z-index is fixed (will always the biggest according to our View component set up).
            // so we just reposition its not to make any weird overlapping animations.
            this.translateX_array[(main_index - 1) % 3].setValue(this.dimension_width)

            // we will do the animations of the rest components (present and right most)
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

            // don't forget to handle the month & year data
            this.handleMonthYearWhenSwipe(-1, this.main_index)

            // because we swipe to the left, main_index will be the index of the right most component since it will be the present.
            this.main_index = (main_index + 1) % 3
        }

        // this is when we swipe to the right. Thus, all the below code will have the opposite of the above explantions.
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

    // I decide doing the snapping effect and handling month & year changings only when I release the finger.
    _onHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            // make sure to reset the tracking translateX value to get exact translation differentiate in the next scrolling/panning/swipping.
            this.old_translateX = 0

            this.handleAnimation(this.main_index)
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