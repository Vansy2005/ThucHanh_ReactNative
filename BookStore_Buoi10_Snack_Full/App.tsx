import React from "react";
import { Provider } from "react-redux"; // BT10.8c
import { SafeAreaProvider } from "react-native-safe-area-context"; // BT10.1a
import { NavigationContainer } from "@react-navigation/native"; // BT10.7c
import { RootNavigator } from "./navigation";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
