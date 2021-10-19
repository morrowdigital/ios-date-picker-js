import React, { FC } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { VISIBLE_ITEMS, ITEM_HEIGHT } from "../Constants";

const styles = StyleSheet.create({
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
const RADIUS_REL = VISIBLE_ITEMS * 2;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;

interface IValue {
  value: number;
  label: string;
}

export const PickerItem: FC<{
  item: IValue;
  index: number;
  translateY: Animated.SharedValue<number>;
}> = ({ item, index, translateY }) => {
  const style = useAnimatedStyle(() => {
    const y = interpolate(
      translateY.value - index * ITEM_HEIGHT,
      [-ITEM_HEIGHT * 2, 0, ITEM_HEIGHT * 2],
      [-0.7, 0, 0.7],
      Extrapolate.CLAMP
    );
    const rotateX = Math.asin(y);
    const z = RADIUS * Math.cos(rotateX) - RADIUS;
    return {
      transform: [
        { perspective },
        { rotateX: rotateX + "rad" },
        { scale: perspective / (perspective - z) },
      ],
      opacity: perspective / (perspective - z),
    };
  });
  return (
    <Animated.View key={item?.value} style={[styles.item, style]}>
      <Text style={styles.label}>{item?.label}</Text>
    </Animated.View>
  );
};
