import React, { useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

import Picker from "./Picker";
import { ITEM_HEIGHT } from "./Constants";

const styles = StyleSheet.create({
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

const getYearValues = (min: number, max: number) => {
  const yearValues = new Array(max - min + 1)
    .fill(0)
    .map((_, i) => {
      const value = min + i;
      return { value, label: `${value}` };
    })
    .reverse();
  return yearValues;
};

const monthValues = [
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

const daysInMonth = (year: number, month: number) => {
  const x = new Date(year, month + 1, 0);
  return x.getDate();
};

const getDayValues = (days: number) =>
  new Array(days).fill(0).map((_, i) => ({ value: i + 1, label: `${i + 1}` }));

const hourValues = new Array(24)
  .fill(0)
  .map((_, i) => ({ value: i, label: `${i}`.padStart(2, "0") }));
const minValues = new Array(60)
  .fill(0)
  .map((_, i) => ({ value: i, label: `${i}`.padStart(2, "0") }));

const initialDate = new Date();
const PickerDemo = ({ minYear = 2010, maxYear = 2030 }) => {
  const [yearValues] = useState(getYearValues(minYear, maxYear));
  let date = useRef(initialDate.getDate()).current;
  let month = useRef(initialDate.getUTCMonth()).current;
  let year = useRef(initialDate.getUTCFullYear()).current;
  let hours = useRef(initialDate.getHours()).current;
  let minutes = useRef(initialDate.getUTCMinutes()).current;
  const [dayValues, setDayValues] = useState(
    getDayValues(daysInMonth(year, month))
  );
  const getDate = () => new Date(Date.UTC(year, month, date, hours, minutes));
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Picker
          onChange={(day) => {
            date = day;
          }}
          flex={1}
          values={dayValues}
          defaultValue={date - 1}
        />
        <Picker
          onChange={(m) => {
            month = m;
            setDayValues(getDayValues(daysInMonth(year, month)));
          }}
          flex={1.5}
          values={monthValues}
          defaultValue={month}
        />
        <Picker
          onChange={(y) => {
            year = y;
            console.log(getDate());
          }}
          flex={1.5}
          values={yearValues}
          defaultValue={maxYear - year}
        />
        <View style={{ width: 10 }} />
        <Picker
          onChange={(h) => {
            hours = h;
            console.log(getDate());
          }}
          flex={1}
          values={hourValues}
          defaultValue={hours}
        />
        <View style={styles.separator}>
          <Text style={{ color: "white" }}>:</Text>
        </View>
        <Picker
          onChange={(m) => {
            minutes = m;
            console.log(minutes, m);
            console.log(getDate());
          }}
          flex={1}
          values={minValues}
          defaultValue={minutes}
        />
      </View>
    </View>
  );
};

export default PickerDemo;
