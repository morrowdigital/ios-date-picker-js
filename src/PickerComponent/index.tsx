import MaskedView from "@react-native-community/masked-view";
import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  FlatListProps,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { ITEM_HEIGHT, PICKER_HEIGHT } from "../Constants";
import { PickerItem } from "./PickerItem";

type TFlatList = React.ComponentClass<
  Animated.AnimateProps<FlatListProps<unknown>>,
  IValue
>;
const AnimatedFlatList: TFlatList = Animated.createAnimatedComponent(FlatList);

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    overflow: "hidden",
  },
  lines: {
    borderColor: "grey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
  },
  flatListContainer: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  centerMaskElement: {
    flex: 1,
    backgroundColor: "white",
  },
  outerMaskElement: {
    flex: 2,
    backgroundColor: "white",
    opacity: 0.5,
  },
});

interface IValue {
  value: number;
  label: string;
}

interface PickerProps {
  defaultValue: number;
  values: IValue[];
  flex: number;
  onChange: (value: number) => void;
}

const MaskElement = (
  <View style={{ height: PICKER_HEIGHT }}>
    <View style={styles.outerMaskElement} />
    <View style={styles.centerMaskElement} />
    <View style={styles.outerMaskElement} />
  </View>
);

const PickerComponent = ({
  values,
  defaultValue,
  flex,
  onChange,
}: PickerProps) => {
  const ref = useRef<FlatList<IValue>>(null);
  const translateY = useSharedValue(0);
  const scrolled: Animated.SharedValue<boolean> = useSharedValue(false);

  useEffect(() => {
    console.log(values, defaultValue);
    if (defaultValue > values.length - 1) {
      translateY.value = ITEM_HEIGHT * values.length - 1;
      onChange(values.length - 1);
    }
  }, [values]);

  const onScroll = useAnimatedScrollHandler<{ beginY?: number; endY?: number }>(
    {
      onScroll: (event) => {
        translateY.value = event.contentOffset.y;
        const value = event.contentOffset.y / ITEM_HEIGHT;
        if (!scrolled.value) return (scrolled.value = true);

        if (value % 1 === 0 && scrolled.value) {
          return runOnJS(onChange)(value);
        }
      },
    }
  );

  // smooth load with fade in
  const opacity = useAnimatedStyle(() => ({
    opacity: withTiming(scrolled.value ? 1 : 0, { duration: 1000 }),
  }));

  const renderItem: ListRenderItem<IValue> = useCallback(
    ({ item, index }) => (
      <PickerItem item={item} index={index} translateY={translateY} />
    ),
    []
  );

  return (
    <View style={[styles.container, { flex }]}>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.lines} />
      </View>
      <MaskedView maskElement={MaskElement}>
        <AnimatedFlatList
          onLayout={() => {
            // initialise position
            ref?.current?.scrollToIndex({
              index: defaultValue,
              animated: false,
            });
            // track first load
            if (defaultValue === 0) {
              scrolled.value = true;
            }
          }}
          ref={ref as any}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          keyExtractor={({ label }) => label}
          style={opacity}
          contentContainerStyle={styles.flatListContainer}
          data={values}
          renderItem={renderItem}
          snapToInterval={ITEM_HEIGHT}
          onScroll={onScroll}
        />
      </MaskedView>
    </View>
  );
};

export default PickerComponent;
