import React, { useState } from "react";
import { StatusBar, Button, View, Text } from "react-native";

// swap these imports during dev
import { PickerModalProvider, usePickerModal } from "common";
// import { PickerModalProvider, usePickerModal } from "ios-date-picker-js";

const App = () => {
  const [x, setX] = useState(new Date().toISOString());
  const { showPickerModal } = usePickerModal();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <StatusBar barStyle="light-content" />
      <Button
        onPress={() =>
          showPickerModal(
            (date) => {
              console.log(date);
              setX(date.toISOString());
            },
            { initialDate: new Date(x), minYear: 1915 }
          )
        }
        title="Press"
      />
      <Text
        style={{
          color: "white",
        }}
      >
        {x}
      </Text>
    </View>
  );
};

export default () => (
  <PickerModalProvider>
    <App />
  </PickerModalProvider>
);
