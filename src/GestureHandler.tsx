import React from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { add, set, useCode } from "react-native-reanimated";
import { usePanGestureHandler } from "react-native-redash";
import { withDecay } from "./AnimationHelpers";
import { ITEM_HEIGHT } from "./Constants";

interface GestureHandlerProps {
  value: Animated.Value<number>;
  max: number;
  defaultValue: number;
  onChange: (index: number) => void;
}

const GestureHandler = ({
  value,
  max,
  onChange,
  defaultValue,
}: GestureHandlerProps) => {
  const {
    gestureHandler,
    translation,
    velocity,
    state,
  } = usePanGestureHandler();
  const snapPoints = new Array(max).fill(0).map((_, i) => i * -ITEM_HEIGHT);
  const translateY = withDecay({
    value: translation.y,
    velocity: velocity.y,
    state,
    snapPoints,
    onChange,
    defaultValue,
  });
  useCode(() => [set(value, add(translateY, ITEM_HEIGHT * 2))], []);
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill} />
    </PanGestureHandler>
  );
};

export default GestureHandler;
