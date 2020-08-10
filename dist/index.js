

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactNative = require('react-native');
var Animated = require('react-native-reanimated');
var Animated__default = _interopDefault(Animated);
var reactNativeRedash = require('react-native-redash');
var MaskedView = _interopDefault(require('@react-native-community/masked-view'));
var reactNativeGestureHandler = require('react-native-gesture-handler');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var ITEM_HEIGHT = 32;
var VISIBLE_ITEMS = 5;

var withDecay = function (params) {
    var _a = __assign({ offset: new Animated.Value(0) }, params), value = _a.value, velocity = _a.velocity, gestureState = _a.state, offset = _a.offset, snapPoints = _a.snapPoints, onChange = _a.onChange, defaultValue = _a.defaultValue;
    var clock = new Animated.Clock();
    var state = {
        finished: new Animated.Value(0),
        position: new Animated.Value(defaultValue),
        time: new Animated.Value(0),
        frameTime: new Animated.Value(0),
    };
    var config = {
        toValue: new Animated.Value(0),
        duration: new Animated.Value(1000),
        easing: Animated.Easing.bezier(0.22, 1, 0.36, 1),
    };
    return Animated.block([
        Animated.startClock(clock),
        Animated.cond(Animated.eq(gestureState, reactNativeGestureHandler.State.BEGAN), Animated.set(offset, state.position)),
        Animated.cond(Animated.eq(gestureState, reactNativeGestureHandler.State.ACTIVE), [
            Animated.set(state.position, Animated.add(offset, value)),
            Animated.set(state.time, 0),
            Animated.set(state.frameTime, 0),
            Animated.set(state.finished, 0),
            Animated.set(config.toValue, reactNativeRedash.snapPoint(state.position, velocity, snapPoints)),
        ]),
        Animated.cond(Animated.and(Animated.not(state.finished), Animated.eq(gestureState, reactNativeGestureHandler.State.END)), [
            Animated.timing(clock, state, config),
            Animated.cond(state.finished, Animated.call([state.position], function (_a) {
                var finalOffset = _a[0];
                return onChange(Math.abs(finalOffset) / ITEM_HEIGHT);
            })),
        ]),
        state.position,
    ]);
};

var GestureHandler = function (_a) {
    var value = _a.value, max = _a.max, onChange = _a.onChange, defaultValue = _a.defaultValue;
    var _b = reactNativeRedash.usePanGestureHandler(), gestureHandler = _b.gestureHandler, translation = _b.translation, velocity = _b.velocity, state = _b.state;
    var snapPoints = new Array(max).fill(0).map(function (_, i) { return i * -ITEM_HEIGHT; });
    var translateY = withDecay({
        value: translation.y,
        velocity: velocity.y,
        state: state,
        snapPoints: snapPoints,
        onChange: onChange,
        defaultValue: defaultValue,
    });
    Animated.useCode(function () { return [Animated.set(value, Animated.add(translateY, ITEM_HEIGHT * 2))]; }, []);
    return (React__default.createElement(reactNativeGestureHandler.PanGestureHandler, __assign({}, gestureHandler),
        React__default.createElement(Animated__default.View, { style: reactNative.StyleSheet.absoluteFill })));
};

var styles = reactNative.StyleSheet.create({
    container: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        overflow: "hidden",
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
    },
    label: {
        color: "white",
        fontSize: 24,
        lineHeight: ITEM_HEIGHT,
        textAlign: "center",
        textAlignVertical: "center",
    },
});
var perspective = 600;
var RADIUS_REL = VISIBLE_ITEMS * 0.5;
var RADIUS = RADIUS_REL * ITEM_HEIGHT;
var Picker = function (_a) {
    var values = _a.values, defaultValue = _a.defaultValue, flex = _a.flex, onChange = _a.onChange;
    var translateY = reactNativeRedash.useValue(0);
    var maskElement = (React__default.createElement(Animated__default.View, { style: { transform: [{ translateY: translateY }] } }, values.map(function (v, i) {
        var y = Animated.interpolate(Animated.divide(Animated.sub(translateY, ITEM_HEIGHT * 2), -ITEM_HEIGHT), {
            inputRange: [i - RADIUS_REL, i, i + RADIUS_REL],
            outputRange: [-1, 0, 1],
            extrapolate: Animated.Extrapolate.CLAMP,
        });
        var rotateX = Animated.asin(y);
        var z = Animated.sub(Animated.multiply(RADIUS, Animated.cos(rotateX)), RADIUS);
        var opacity = reactNative.Platform.OS === "ios"
            ? 1
            : Animated.interpolate(y, {
                outputRange: [0, 1, 0],
                inputRange: [-1, 0, 1],
            });
        return (React__default.createElement(Animated__default.View, { key: v.value, style: [
                styles.item,
                {
                    transform: [
                        { perspective: perspective },
                        { rotateX: rotateX },
                        reactNativeRedash.translateZ(perspective, z),
                    ],
                    opacity: opacity,
                },
            ] },
            React__default.createElement(reactNative.Text, { style: styles.label }, v.label)));
    })));
    return (React__default.createElement(reactNative.View, { style: [styles.container, { flex: flex }] },
        reactNative.Platform.OS === "ios" ? (React__default.createElement(MaskedView, __assign({}, { maskElement: maskElement }),
            React__default.createElement(reactNative.View, { style: { height: ITEM_HEIGHT * 2, backgroundColor: "grey" } }),
            React__default.createElement(reactNative.View, { style: { height: ITEM_HEIGHT, backgroundColor: "white" } }),
            React__default.createElement(reactNative.View, { style: { height: ITEM_HEIGHT * 2, backgroundColor: "grey" } }))) : (maskElement),
        React__default.createElement(reactNative.View, { style: reactNative.StyleSheet.absoluteFill },
            React__default.createElement(reactNative.View, { style: {
                    borderColor: "grey",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    top: ITEM_HEIGHT * 2,
                    height: ITEM_HEIGHT,
                } })),
        React__default.createElement(GestureHandler, { max: values.length, value: translateY, onChange: function (index) { var _a; return onChange((_a = values[index]) === null || _a === void 0 ? void 0 : _a.value); }, defaultValue: defaultValue * -ITEM_HEIGHT })));
};

var styles$1 = reactNative.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    separator: {
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        borderTopColor: "grey",
        borderTopWidth: 1,
        height: ITEM_HEIGHT,
        justifyContent: "center",
    },
});
var getYearValues = function (min, max) {
    var yearValues = new Array(max - min + 1)
        .fill(0)
        .map(function (_, i) {
        var value = min + i;
        return { value: value, label: "" + value };
    })
        .reverse();
    return yearValues;
};
var monthValues = [
    { value: 0, label: "Jan" },
    { value: 1, label: "Feb" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Apr" },
    { value: 4, label: "May" },
    { value: 5, label: "Jun" },
    { value: 6, label: "Jul" },
    { value: 7, label: "Aug" },
    { value: 8, label: "Sep" },
    { value: 9, label: "Oct" },
    { value: 10, label: "Nov" },
    { value: 11, label: "Dec" },
];
var daysInMonth = function (year, month) {
    var x = new Date(year, month + 1, 0);
    return x.getDate();
};
var getDayValues = function (days) {
    return new Array(days).fill(0).map(function (_, i) { return ({ value: i + 1, label: "" + (i + 1) }); });
};
var hourValues = new Array(24)
    .fill(0)
    .map(function (_, i) { return ({ value: i, label: ("" + i).padStart(2, "0") }); });
var minValues = new Array(60)
    .fill(0)
    .map(function (_, i) { return ({ value: i, label: ("" + i).padStart(2, "0") }); });
var initialDate = new Date();
var Picker$1 = function (_a) {
    var _b = _a.minYear, minYear = _b === void 0 ? 2010 : _b, _c = _a.maxYear, maxYear = _c === void 0 ? 2030 : _c;
    var yearValues = React.useState(getYearValues(minYear, maxYear))[0];
    var date = React.useRef(initialDate.getDate()).current;
    var month = React.useRef(initialDate.getUTCMonth()).current;
    var year = React.useRef(initialDate.getUTCFullYear()).current;
    var hours = React.useRef(initialDate.getHours()).current;
    var minutes = React.useRef(initialDate.getUTCMinutes()).current;
    var _d = React.useState(getDayValues(daysInMonth(year, month))), dayValues = _d[0], setDayValues = _d[1];
    var getDate = function () { return new Date(Date.UTC(year, month, date, hours, minutes)); };
    return (React__default.createElement(reactNative.View, { style: styles$1.container },
        React__default.createElement(reactNative.View, { style: { flexDirection: "row", alignItems: "center" } },
            React__default.createElement(Picker, { onChange: function (day) {
                    date = day;
                }, flex: 1, values: dayValues, defaultValue: date - 1 }),
            React__default.createElement(Picker, { onChange: function (m) {
                    month = m;
                    setDayValues(getDayValues(daysInMonth(year, month)));
                }, flex: 1.5, values: monthValues, defaultValue: month }),
            React__default.createElement(Picker, { onChange: function (y) {
                    year = y;
                    console.log(getDate());
                }, flex: 1.5, values: yearValues, defaultValue: maxYear - year }),
            React__default.createElement(reactNative.View, { style: { width: 10 } }),
            React__default.createElement(Picker, { onChange: function (h) {
                    hours = h;
                    console.log(getDate());
                }, flex: 1, values: hourValues, defaultValue: hours }),
            React__default.createElement(reactNative.View, { style: styles$1.separator },
                React__default.createElement(reactNative.Text, { style: { color: "white" } }, ":")),
            React__default.createElement(Picker, { onChange: function (m) {
                    minutes = m;
                    console.log(minutes, m);
                    console.log(getDate());
                }, flex: 1, values: minValues, defaultValue: minutes }))));
};

exports.default = Picker$1;
//# sourceMappingURL=index.js.map
