import {Text, Button} from 'react-native';
import {VStack} from '@react-native-material/core';
import React, {useState} from 'react';
import BleManager from 'react-native-ble-manager';

export default function App() {
  // const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // This function will be triggered when the button is pressed
  const toggleLoading = () => {
    setIsLoading(!isLoading);
    startBluetooth();
  };
  return (
    <>
      <VStack fill center spacing={10}>
        <Text>Swimu App</Text>
        <Text>My testing now</Text>
        <Button
          //loading={isLoading}
          onPress={toggleLoading}
          title="Start"
          //trailing={<Icon name="star-three-points" />}
          //loadingIndicatorPosition="trailing"
        />
      </VStack>
    </>
  );
}

function startBluetooth() {
  console.log('Entrei');
  BleManager.start({showAlert: false});
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/
