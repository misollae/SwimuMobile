/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {Device} from 'react-native-ble-plx';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
  useColorScheme,
  StatusBar,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Button,
  StyleSheet,
} from 'react-native';
import useBLE from '../useBLE';



interface ScreenNavigation {
  navigation: any;
}

const BluetoothScreen = (props: ScreenNavigation) => {
  const useble = useBLE();
  const {requestPermissions, scanForDevices, allDevices, connectToDevice} = useble;
  const serialized = JSON.stringify(useble);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScanning, setIsScanning] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: '#e7edf2',
  };

  const startScan = async () => {
    requestPermissions((isGranted: boolean) => {
      if (isGranted) {
        setIsScanning(true);
        scanForDevices();
      }
    });
  };

  const tryConnect = async (device: Device) => {
    try {
      await connectToDevice(device);
      console.log('navigate');
      //props.navigation.navigate('HomeScreen', {serializedBLE: serialized});
    } catch (error) {
      console.log('Error when connecting: ', error);
    }
  };

  startScan();

  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#71a9d5"
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: 'backgroundStyle.backgroundColor',
            marginBottom: 40,
          }}>
          <View>
          <Svg height="1000" width="1000" viewBox="0 0 200 200">
            <Path
              fill="#71A9D5"
              d="M49,-64.3C61.6,-58.2,68.8,-41.4,69.3,-25.8C69.8,-10.2,63.6,4.2,54.7,13.5C45.8,22.8,34.1,26.8,24.6,33C15,39.2,7.5,47.6,-2.9,51.6C-13.3,55.6,-26.6,55.3,-31.7,47.6C-36.7,39.9,-33.4,24.9,-34.8,13.1C-36.1,1.3,-42,-7.1,-45.1,-19.9C-48.1,-32.7,-48.3,-49.7,-40.4,-57.4C-32.4,-65,-16.2,-63.2,1,-64.6C18.2,-65.9,36.3,-70.5,49,-64.3Z"
              transform="translate(14 65)"
            />
          </Svg>
          <Image
            source={require('./images/oglogo.png')}
            style={{ width: 253, height: 52, top: -660, left: 30 }} // Added position and top properties
          />
          <Text
              style={{
                fontSize: 40,
                textAlign: 'left',
                color: 'white',
                backgroundColor: 'transparent',
                fontWeight: '800',
                top: -660,
                left: 28,
              }}>
              Hello!
            </Text>
            <Text
              style={{
                fontSize: 26,
                textAlign: 'center',
                color: '#4c4c4c',
                backgroundColor: backgroundStyle.backgroundColor,
                fontWeight: '800',
                top: -470,
              }}>
              A device must be picked!
            </Text>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'left',
                color: '#a0a4a7',
                backgroundColor: backgroundStyle.backgroundColor,
                fontWeight: '700',
                paddingLeft: 30,
                paddingRight: 30,
                top: -470,
              }}>
              Here's what we found, are you using any of these?
            </Text>
          </View>
          {allDevices.map((device: Device) => (
              <TouchableOpacity key={device.id} style={{top: -430, left: 85}} onPress={tryConnect.bind(this, device)} ><Text style={{fontSize: 16, fontWeight: '600', color: '#a0a4a7'}}>{device.name}</Text></TouchableOpacity>
          ))}
          <Svg height="870" width="500" viewBox="0 0 200 200" style={{marginTop:-850, top: 470, left: 90}}>
            <Path
              fill="#71A9D5"
              d="M45.7,-62.2C59.1,-53.1,69.9,-39.7,74.8,-24.3C79.8,-9,79,8.2,71.6,20.9C64.3,33.6,50.3,41.9,37.3,47C24.3,52,12.1,53.9,-3,58.1C-18.1,62.2,-36.3,68.5,-48.6,63.2C-60.9,57.9,-67.3,40.9,-70.4,24.5C-73.5,8.1,-73.2,-7.8,-63.6,-15.6C-54.1,-23.4,-35.4,-23.1,-23.2,-32.7C-11.1,-42.2,-5.5,-61.5,5.3,-68.8C16.1,-76.1,32.3,-71.4,45.7,-62.2Z"
              transform="translate(100 0)"
            />
          </Svg>
        </View>
      </ScrollView>
      <Button
        title="Go to HomeScreen"
        onPress={() => props.navigation.navigate('HomeScreen', {serializedBLE: serialized})}
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
    top: -470,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default BluetoothScreen;
