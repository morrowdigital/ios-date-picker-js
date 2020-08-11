import * as React from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";
import {
  useState,
  useRef,
  useImperativeHandle,
  PropsWithChildren,
} from "react";

import Picker from "./DatePicker";

interface IPickerModalProps {
  readonly useNativeDriver?: boolean | undefined;
  readonly pointerEvents?: ViewProps["pointerEvents"];
}

const OPACITY_ANIMATION_IN_TIME = 225;
const OPACITY_ANIMATION_OUT_TIME = 195;
const EASING_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASING_IN = Easing.out(EASING_OUT);

// let onSelectRef: (date: Date) => void;

export const PickerModal: React.ForwardRefExoticComponent<
  PropsWithChildren<IPickerModalProps> & React.RefAttributes<any>
> = React.forwardRef(
  ({ children, pointerEvents, useNativeDriver = true }, ref) => {
    let actionSheetHeight = 360;
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const onSelectRef = useRef<((date: Date) => void) | null>(null);
    const [overlayOpacity] = useState(new Animated.Value(0));
    const [sheetOpacity] = useState(new Animated.Value(0));

    let deferNextShow: ((x: any) => void) | undefined;

    useImperativeHandle(ref, () => ({
      showPickerModal,
    }));

    const setActionSheetHeight = ({ nativeEvent }: any) =>
      (actionSheetHeight = nativeEvent.layout.height);

    const overlay = isVisible ? (
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      />
    ) : null;
    // While the sheet is visible, hide the rest of the app's content from screen readers.
    const appContent = (
      <View
        style={styles.flexContainer}
        importantForAccessibility={isVisible ? "no-hide-descendants" : "auto"}
      >
        {React.Children.only(children)}
      </View>
    );
    const renderSheet = () => {
      return (
        <TouchableWithoutFeedback
          importantForAccessibility="yes"
          // onPress={selectCancelButton}
        >
          <Animated.View
            needsOffscreenAlphaCompositing={isAnimating}
            style={[
              styles.sheetContainer,
              {
                opacity: sheetOpacity,
                transform: [
                  {
                    translateY: sheetOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [actionSheetHeight, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.sheet} onLayout={setActionSheetHeight}>
              <Picker onConfirm={onSelectLib} />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    };

    const showPickerModal = (onSelect: (date: Date) => void) => {
      if (isVisible) {
        deferNextShow = showPickerModal;
        return;
      }

      onSelectRef.current = onSelect;
      setIsVisible(true);
      setIsAnimating(true);
      overlayOpacity.setValue(0);
      sheetOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.32,
          easing: EASING_OUT,
          duration: OPACITY_ANIMATION_IN_TIME,
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(sheetOpacity, {
          toValue: 1,
          easing: EASING_OUT,
          duration: OPACITY_ANIMATION_IN_TIME,
          useNativeDriver: useNativeDriver,
        }),
      ]).start((result) => {
        if (result.finished) {
          setIsAnimating(false);
          deferNextShow = undefined;
        }
      });
      BackHandler.addEventListener(
        // @ts-ignore: Argument of type '"actionSheetHardwareBackPress"' is not assignable to parameter of type '"hardwareBackPress"'
        "actionSheetHardwareBackPress",
        selectCancelButton
      );
    };

    const selectCancelButton = () => {
      return animateOut();
    };

    const onSelectLib = (date: Date): boolean => {
      if (isAnimating) {
        return false;
      }
      console.log("selected", onSelectRef.current);
      onSelectRef.current?.(date);
      return animateOut();
    };

    const animateOut = (): boolean => {
      if (isAnimating) {
        return false;
      }

      BackHandler.removeEventListener(
        // @ts-ignore: Argument of type '"actionSheetHardwareBackPress"' is not assignable to parameter of type '"hardwareBackPress"'
        "actionSheetHardwareBackPress",
        selectCancelButton
      );
      setIsAnimating(true),
        Animated.parallel([
          Animated.timing(overlayOpacity, {
            toValue: 0,
            easing: EASING_IN,
            duration: OPACITY_ANIMATION_OUT_TIME,
            useNativeDriver: useNativeDriver,
          }),
          Animated.timing(sheetOpacity, {
            toValue: 0,
            easing: EASING_IN,
            duration: OPACITY_ANIMATION_OUT_TIME,
            useNativeDriver: useNativeDriver,
          }),
        ]).start((result) => {
          if (result.finished) {
            setIsVisible(false);
            setIsAnimating(false);

            if (deferNextShow) {
              deferNextShow(null);
            }
          }
        });
      return true;
    };

    return (
      <View pointerEvents={pointerEvents} style={styles.flexContainer}>
        {appContent}
        {isVisible && (
          <Modal
            animationType="none"
            transparent={true}
            onRequestClose={selectCancelButton}
          >
            {overlay}
            {renderSheet()}
          </Modal>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "black",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "transparent",
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderTopColor: 1,
  },
  sheet: {
    flex: 1,
    paddingBottom: 40,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
});
