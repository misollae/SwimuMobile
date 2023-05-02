/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {Device} from 'react-native-ble-plx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  useColorScheme,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Button,
  Dimensions,
  StyleSheet,
} from 'react-native';
import useBLE from '../useBLE';
import {RNSerialport} from 'react-native-serialport';
import React from 'react';


interface ScreenNavigation {
  navigation: any;
}

const BluetoothScreen = (props: ScreenNavigation) => {
  const useble = useBLE();
  const {requestPermissions, scanForDevices, allDevices, connectToDevice} = useble;
  const serialized = JSON.stringify(useble);
  const [isScanning, setIsScanning] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const startScan = async () => {
    requestPermissions((isGranted: boolean) => {
      if (isGranted) {
        setIsScanning(true);
        scanForDevices();
      }
    });
  };
  const startList = () =>{
    RNSerialport.list()
  .then(ports => {
      console.log('Available ports:', ports);
  
      // RNSerialport.writeString('HELLO');
      // Find the port you want to connect to (in this example, we assume it's the first port)
      const port = ports[0];
  
      // Open the port
      RNSerialport.open(port.path, {
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
      })
        .then(port => {
          console.log(`Connected to port ${port.path}`);
  
          // Send a message to the board
          RNSerialport.writeString('Hello, board!');
  
          // Receive data from the board
          RNSerialport.onData(data => {
            console.log(`Received data from board: ${data}`);
          });
        })
        .catch(error => {
          console.error(`Failed to open port: ${error.message}`);
        });
    })
    .catch(error => {
      console.error(`Failed to list available ports: ${error.message}`);
    });
  }
  

  const tryConnect = async (device: Device) => {
    await connectToDevice(device);
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            marginBottom: 40,
          }}>
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: isDarkMode ? Colors.white : Colors.black,
              }}>
              Bluetooth Test
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={startScan}>
            <Text style={styles.buttonTextStyle}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
          {allDevices.map((device: Device) => (
              <TouchableOpacity key={device.id} onPress={tryConnect.bind(this, device)} ><Text>{device.name}</Text></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Button
        title="Go to HomeScreen"
        onPress={startList}
        // onPress={() => props.navigation.navigate('HomeScreen', { serializedBLE: serialized })}
      />
    </SafeAreaView>
  );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default BluetoothScreen;
