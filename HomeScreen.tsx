import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Button} from 'react-native/types';

const HomeScreen = ({navigation}) => {
  return (
    <NavigationContainer>
      <Button
        title="Go to HomeScreen"
        onPress={() => navigation.navigate('Home')}
      />
    </NavigationContainer>
  );
};

export default HomeScreen;
