import React from "react";
import {
  NativeBaseProvider,
  extendTheme,
} from "native-base";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./src/screens/Home";
import SearchResult from "./src/screens/SearchResult";
import CarparkDetails from "./src/screens/CarparkDetails";
import { Provider } from 'react-redux';
import { store } from "./src/store/store";

const newColorTheme = {
  colors: {
    // Add new color
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    // Redefinig only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'dark',
  },
}

const theme = extendTheme({ colors: newColorTheme });

const Stack = createStackNavigator();

function MyStack() {
  return (<>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}
        options={{
          headerStyle: {
            backgroundColor: '#0284c7',
          },
          headerTintColor: 'white',
        }} />
      <Stack.Screen name="Search Result" component={SearchResult}
        options={{
          headerStyle: {
            backgroundColor: '#0284c7',
          },
          headerTintColor: 'white',
        }} />
      <Stack.Screen name="Carpark Details" component={CarparkDetails}
        options={{
          headerStyle: {
            backgroundColor: '#0284c7',
          },
          headerTintColor: 'white',
        }} />
    </Stack.Navigator>
  </>);
}

export default function () {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </NativeBaseProvider >
    </Provider>
  );
}