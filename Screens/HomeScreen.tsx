/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
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
import useBLE from '../useBLE';

const HomeScreen = () => {
  const {onStartTrain} = useBLE();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handlePress = () => {
    console.log('Button pressed');
    onStartTrain(); // call the function from useBLE
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
        </View>
      </ScrollView>
      <Button title="Start Train" onPress={handlePress} />
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
