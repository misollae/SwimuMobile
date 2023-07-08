/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {SafeAreaView} from 'react-native-safe-area-context';
import Wave from 'react-native-waveview';

import {
  useColorScheme,
  StatusBar,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import useBLE from '../useBLE';

type HomeScreenParams = {
  serializedBLE: string;
};

const HomeScreen = () => {
  const route = useRoute();
  const { serializedBLE } = route.params as HomeScreenParams;
  const parsedBLE = serializedBLE ? JSON.parse(serializedBLE) : undefined;
  const { onStartTrain } = useBLE();
  const { connectedDevice } = parsedBLE;
  const [visible] = useState(true);
  const [text, setText] = useState('20');

  const handleChangeText = (inputText: React.SetStateAction<string>) => {
    setText(inputText);
  };


  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: '#e7edf2',
  };

  const handlePress = () => {
    console.log('Button pressed');
    onStartTrain(connectedDevice);
  };

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
          <View style={{
            backgroundColor: backgroundStyle.backgroundColor,
          }}>
            <View style={styles.wavecontainer} >
            <Wave
                style={styles.waveBall}
                H={130}
                waveParams={[
                    {A: 20, T: 180, fill: '#b9d0e3'},
                    {A: 20, T: 200, fill: '#80b3db'},
                    {A: 30, T: 240, fill: '#72a5d3'},
                ]}
                animated={true}
            />
            <TouchableOpacity
        style={{backgroundColor: 'transparent'}}
        onPress={handlePress}>
        <Text style={{
                fontSize: 27,
                textAlign: 'center',
                color: 'white',
                marginRight: 8,
                fontWeight: '700',
              }}> Start/Stop</Text>
      </TouchableOpacity>
        </View>
            <Text
              style={{
                fontSize: 40,
                textAlign: 'center',
                color: '#4c4c4c',
                backgroundColor: backgroundStyle.backgroundColor,
                fontWeight: '700',
                marginTop:80,
              }}>
              Settings
            </Text>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#a0a4a7',
                backgroundColor: backgroundStyle.backgroundColor,
                fontWeight: '600',
                paddingLeft: 30,
                marginTop: 10,
                paddingRight: 36,
              }}>
              Pool Size (m):
            </Text>
            <TextInput
        style={styles.input}
        onChangeText={handleChangeText}
        value={text}
        placeholder=""
      />
          </View>
        </View>
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
  input: {
    width: 230,
    height: 40,
    borderWidth: 1,
    marginTop: 8,
    alignSelf:'center',
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  wavecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
},
wave: {
    width: 200,
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
},
waveBall: {
  marginBottom: -95,
    width: 190,
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
}
});

export default HomeScreen;
