import React, { useState } from "react";
import { StatusBar, Button, View, Text } from "react-native";
// import Picker from "ios-date-picker-js";

import PickerModalProvider from "ios-date-picker-js";
import { usePickerModal } from "ios-date-picker-js";

const App = () => {
  const [x, setx] = useState("");
  const { showPickerModal } = usePickerModal();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar barStyle="light-content" />
      <Button
        onPress={() =>
          showPickerModal((date) => {
            console.log(date);
            setx(date.toISOString());
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
