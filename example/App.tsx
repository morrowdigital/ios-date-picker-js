import React, { useState } from "react";
import { StatusBar, Button, View, Text } from "react-native";
import { PickerModalProvider, usePickerModal } from "ios-date-picker-js";

const App = () => {
  const [x, setX] = useState("");
  const { showPickerModal } = usePickerModal();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar barStyle="light-content" />
      <Button
        onPress={() =>
          showPickerModal((date) => {
            setX(date.toISOString());
          })
        }
        title="Press"
      />
      <Text>{x}</Text>
    </View>
  );
};

export default () => (
  <PickerModalProvider>
    <App />
  </PickerModalProvider>
);
