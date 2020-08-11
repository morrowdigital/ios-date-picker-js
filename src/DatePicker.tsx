import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import PickerComponent from "./PickerComponent";
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

export interface IDatePickerProps {
  minYear?: number;
  maxYear?: number;
  onConfirm: (date: Date) => void;
}

const DatePicker = ({
  minYear = 1994,
  maxYear = 2020,
  onConfirm,
}: IDatePickerProps) => {
  const [yearValues] = useState(getYearValues(minYear, maxYear));
  const date = useRef(initialDate.getDate());
  const month = useRef(initialDate.getUTCMonth());
  const year = useRef(initialDate.getUTCFullYear());
  const hours = useRef(initialDate.getHours());
  const minutes = useRef(initialDate.getUTCMinutes());
  const [dayValues, setDayValues] = useState(
    getDayValues(daysInMonth(year.current, month.current))
  );
  const getDate = () =>
    new Date(
      Date.UTC(
        year.current,
        month.current,
        date.current,
        hours.current,
        minutes.current
      )
    );
  return (
    <View style={styles.container}>
      <Button title="confirm" onPress={() => onConfirm(getDate())} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <PickerComponent
          onChange={(day: number) => (date.current = day)}
          flex={1}
          values={dayValues}
          defaultValue={date.current - 1}
        />
        <PickerComponent
          onChange={(monthPosition: number) => {
            month.current = monthPosition;
            setDayValues(
              getDayValues(daysInMonth(year.current, month.current))
            );
          }}
          flex={1.5}
          values={monthValues}
          defaultValue={month.current}
        />
        <PickerComponent
          onChange={(yearPosition: number) => (year.current = yearPosition)}
          flex={1.5}
          values={yearValues}
          defaultValue={maxYear - year.current}
        />
        <View style={{ width: 10 }} />
        <PickerComponent
          onChange={(hourPosition: number) => (hours.current = hourPosition)}
          flex={1}
          values={hourValues}
          defaultValue={hours.current}
        />
        <View style={styles.separator}>
          <Text style={{ color: "white" }}>:</Text>
        </View>
        <PickerComponent
          onChange={(minutePosition: number) =>
            (minutes.current = minutePosition)
          }
          flex={1}
          values={minValues}
          defaultValue={minutes.current}
        />
      </View>
    </View>
  );
};

export default DatePicker;
