import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BluetoothScreen from './BluetoothScreen';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="BluetoothScreen"
          component={BluetoothScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
