import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { ITEM_HEIGHT } from "./Constants";
import PickerComponent from "./PickerComponent";

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
  centerRow: { flexDirection: "row", alignItems: "center" },
  widthTen: { width: 10 },
  colorWhite: { color: "white" },
});

const getYearValues = (min: number, max: number) => {
  // const yearValues = new Array(max - min + 1)
  //   .fill(0)
  //   .map((_, i) => {
  //     const value = min + i;
  //     return { value, label: `${value}` };
  //   })
  //   .reverse();
  const yearValues = [];
  for (let i = min; i < max; i++) {
    yearValues.push({ value: i, label: `${i}` });
  }
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

export interface IDatePickerProps {
  minYear?: number;
  maxYear?: number;
  initialDate?: Date;
  onConfirm: (date: Date) => void;
}

const DatePicker = ({
  minYear,
  maxYear,
  initialDate = new Date(),
  onConfirm,
}: IDatePickerProps) => {
  const date = useRef(initialDate.getDate() - 1);
  const month = useRef(initialDate.getUTCMonth());
  const year = useRef(initialDate.getUTCFullYear());
  const hours = useRef(initialDate.getHours());
  const minutes = useRef(initialDate.getUTCMinutes());
  const [yearValues, setYearValues] = useState(
    getYearValues(minYear ?? year.current - 20, maxYear ?? year.current + 20)
  );
  const [dayValues, setDayValues] = useState(
    getDayValues(daysInMonth(year.current, month.current))
  );
  const getDate = () =>
    new Date(
      Date.UTC(
        year.current,
        month.current,
        date.current + 1,
        hours.current - 1,
        minutes.current
      )
    );

  const addPreviousYears = () => {
    console.log("adding years");
    const years = [...yearValues];
    const oldestYear = years[0].value;
    for (let i = 1; i <= 20; i++) {
      years.unshift({ value: oldestYear - i, label: `${oldestYear - i}` });
    }
    setYearValues(years);
  };

  const addFutureYears = () => {
    const years = [...yearValues];
    const oldestYear = years[years.length - 1].value;
    for (let i = 1; i <= 20; i++) {
      years.push({ value: oldestYear + i, label: `${oldestYear + i}` });
    }
    setYearValues(years);
  };
  return (
    <View style={styles.container}>
      <Button title="confirm" onPress={() => onConfirm(getDate())} />
      <View style={styles.centerRow}>
        <PickerComponent
          onChange={(day: number) => (date.current = day)}
          flex={1}
          values={dayValues}
          defaultValue={date.current}
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
          onChange={(yearPosition: number) =>
            (year.current = yearValues[yearPosition].value)
          }
          flex={1.5}
          values={yearValues}
          onStartReached={addPreviousYears}
          onEndReached={addFutureYears}
          defaultValue={yearValues.findIndex(
            ({ value }) => value === year.current
          )}
        />
        <View style={styles.widthTen} />
        <PickerComponent
          onChange={(hourPosition: number) => (hours.current = hourPosition)}
          flex={1}
          values={hourValues}
          defaultValue={hours.current}
        />
        <View style={styles.separator}>
          <Text style={styles.colorWhite}>:</Text>
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
