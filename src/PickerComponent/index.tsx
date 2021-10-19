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
  onStartReached?: () => void;
  onEndReached?: () => void;
}

const MaskElement = (
  <View style={{ height: PICKER_HEIGHT }}>
    <View style={styles.outerMaskElement} />
    <View style={styles.centerMaskElement} />
    <View style={styles.outerMaskElement} />
  </View>
);

type TFlatList = React.ComponentClass<
  Animated.AnimateProps<FlatListProps<unknown>>,
  IValue
>;
const AnimatedFlatList: TFlatList = Animated.createAnimatedComponent(FlatList);

const PickerComponent = ({
  values,
  defaultValue,
  flex,
  onChange,
  onStartReached,
  onEndReached,
}: PickerProps) => {
  const ref = useRef<FlatList<IValue>>(null);
  const translateY = useSharedValue(0);
  const scrolled: Animated.SharedValue<boolean> = useSharedValue(false);
  const maxValue = values.length - 1;

  const onStartReachedInProgress = useRef(false);

  const onEndReachedInProgress = useRef(false);

  useEffect(() => {
    if (defaultValue > maxValue) {
      ref?.current?.scrollToIndex({
        index: maxValue,
      });
      onChange(maxValue);
    }
  }, [values]);

  const maybeCallOnStartReached = async () => {
    console.log("onStartReached", onStartReachedInProgress);
    // If onStartReached has already been called for given data length, then ignore.
    if (onStartReachedInProgress.current || !onStartReached) return;

    onStartReachedInProgress.current = true;
    ref?.current?.setNativeProps({ scrollEnabled: false });
    onStartReached();
    ref?.current?.scrollToOffset({
      animated: true,
      offset: ITEM_HEIGHT * 20,
    });
    ref?.current?.setNativeProps({ scrollEnabled: true });

    // setTimeout(() => {
    onStartReachedInProgress.current = false;
    // }, 100);
  };

  const maybeCallOnEndReached = () => {
    console.log("onEndReached");
    // If onEndReached has already been called for given data length, then ignore.
    if (onEndReachedInProgress.current || !onEndReached) return;

    onEndReachedInProgress.current = true;
    onEndReached();
    ref?.current?.scrollToOffset({
      animated: true,
      offset: ITEM_HEIGHT * 20,
    });
    setTimeout(() => {
      onEndReachedInProgress.current = false;
    }, 100);
  };

  const onScroll = useAnimatedScrollHandler<{ beginY?: number; endY?: number }>(
    {
      onScroll: (event) => {
        const offset = event.contentOffset.y;
        const visibleLength = event.layoutMeasurement.height;
        const contentLength = event.contentSize.height;

        // Check if scroll has reached either start of end of list.
        const isScrollAtStart = offset < 100;
        const isScrollAtEnd = contentLength - visibleLength - offset < 100;

        if (isScrollAtStart) {
          runOnJS(maybeCallOnStartReached)();
        }

        if (isScrollAtEnd) {
          runOnJS(maybeCallOnEndReached)();
        }

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
            if (defaultValue < maxValue) {
              ref?.current?.scrollToIndex({
                index: defaultValue,
                animated: false,
              });
            }
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
          keyExtractor={(x) => x?.label}
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
