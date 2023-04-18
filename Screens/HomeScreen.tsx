/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  useColorScheme,
  StatusBar,
  ScrollView,
  View,
  Text,
  Button,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import useBLE from '../useBLE';
import DashboardComponent from '../Components/Dashboard';

type HomeScreenParams = {
  serializedBLE: string;
};

const HomeScreen = () => {
  const route = useRoute();
  const { serializedBLE } = route.params as HomeScreenParams;
  const parsedBLE = serializedBLE ? JSON.parse(serializedBLE) : undefined;
  const { onStartTrain } = useBLE();
  const { connectedDevice } = parsedBLE;
  const [visible, setVisible] = useState(true);


  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handlePress = () => {
    console.log('Button pressed');
    onStartTrain(connectedDevice); // call the function from useBLE
    setVisible(false);

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
              Welcome
            </Text>
          </View>
          {visible && (<Button title="Start Train" onPress={handlePress} color="#307ecc" />)}
        </View>
          <DashboardComponent/>
      </ScrollView>
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

export default HomeScreen;
