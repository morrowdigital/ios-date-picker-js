import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  multiply,
  cos,
  sub,
  asin,
  divide,
} from "react-native-reanimated";
import { useValue, translateZ } from "react-native-redash";
import MaskedView from "@react-native-community/masked-view";

import GestureHandler from "./GestureHandler";
import { VISIBLE_ITEMS, ITEM_HEIGHT } from "./Constants";

const styles = StyleSheet.create({
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
const perspective = 600;
const RADIUS_REL = VISIBLE_ITEMS * 0.5;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;

interface PickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
  flex: number;
  onChange: (value: number) => void;
}

const Picker = ({ values, defaultValue, flex, onChange }: PickerProps) => {
  const translateY = useValue(0);
  const maskElement = (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {values.map((v, i) => {
        const y = interpolate(
          divide(sub(translateY, ITEM_HEIGHT * 2), -ITEM_HEIGHT),
          {
            inputRange: [i - RADIUS_REL, i, i + RADIUS_REL],
            outputRange: [-1, 0, 1],
            extrapolate: Extrapolate.CLAMP,
          }
        );
        const rotateX = asin(y);
        const z = sub(multiply(RADIUS, cos(rotateX)), RADIUS);
        const opacity =
          Platform.OS === "ios"
            ? 1
            : interpolate(y, {
                outputRange: [0, 1, 0],
                inputRange: [-1, 0, 1],
              });
        return (
          <Animated.View
            key={v.value}
            style={[
              styles.item,
              {
                transform: [
                  { perspective },
                  { rotateX },
                  translateZ(perspective, z),
                ],
                opacity,
              },
            ]}
          >
            <Text style={styles.label}>{v.label}</Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
  return (
    <View style={[styles.container, { flex }]}>
      {Platform.OS === "ios" ? (
        <MaskedView {...{ maskElement }}>
          <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
          <View style={{ height: ITEM_HEIGHT, backgroundColor: "white" }} />
          <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
        </MaskedView>
      ) : (
        maskElement
      )}
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            borderColor: "grey",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />
      </View>
      <GestureHandler
        max={values.length}
        value={translateY}
        onChange={(index) => onChange(values[index]?.value)}
        defaultValue={defaultValue * -ITEM_HEIGHT}
      />
    </View>
  );
};

export default Picker;
