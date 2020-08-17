import {
  BackHandler,
  StyleSheet,
  View,
  ViewProps,
  SafeAreaView,
} from "react-native";
import React, {
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

export interface IModalDatePickerProps {
  initialDate?: Date;
  minYear?: number;
  maxYear?: number;
}

export const PickerModal: React.ForwardRefExoticComponent<
  PropsWithChildren<IPickerModalProps> & React.RefAttributes<any>
> = React.forwardRef(({ children, pointerEvents }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const onSelectRef = useRef<((date: Date) => void) | null>(null);
  const [options, setOptions] = useState<IModalDatePickerProps>({});

  useImperativeHandle(ref, () => ({
    showPickerModal,
  }));

  // While the sheet is visible, hide the rest of the app's content from screen readers.
  const appContent = (
    <View
      style={styles.flexContainer}
      importantForAccessibility={isVisible ? "no-hide-descendants" : "auto"}
    >
      {React.Children.only(children)}
    </View>
  );

  const showPickerModal = (
    onSelect: (date: Date) => void,
    options: { initialDate?: Date; minYear?: number; maxYear?: number }
  ) => {
    if (isVisible) {
      return;
    }
    setOptions(options || {});
    onSelectRef.current = onSelect;
    setIsVisible(true);

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
    onSelectRef.current?.(date);
    BackHandler.removeEventListener(
      // @ts-ignore: Argument of type '"actionSheetHardwareBackPress"' is not assignable to parameter of type '"hardwareBackPress"'
      "actionSheetHardwareBackPress",
      selectCancelButton
    );
    return animateOut();
  };

  const animateOut = (): boolean => {
    setIsVisible(false);
    return true;
  };

  return (
    <View pointerEvents={pointerEvents} style={styles.flexContainer}>
      {appContent}

      {isVisible && (
        <SafeAreaView style={styles.modal}>
          {/* <TouchableWithoutFeedback
            importantForAccessibility="yes"
            // onPress={selectCancelButton}
          > */}
          <View style={styles.sheetContainer}>
            <View style={styles.sheet}>
              <Picker
                minYear={options?.minYear}
                maxYear={options?.maxYear}
                initialDate={options?.initialDate}
                onConfirm={onSelectLib}
              />
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </SafeAreaView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  flexContainer: {
    flex: 1,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "30%",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
});
