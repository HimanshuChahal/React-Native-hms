import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BaseScreen from './src/BaseScreen';
import VideoCallScreen from './src/VideoCallScreen';

const Stack = createNativeStackNavigator()

export default function App() {

  // const [ instance, setInstance ] = useState(null)

  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen name = 'Base' component = { BaseScreen }/>

        <Stack.Screen name = 'Video' component = { VideoCallScreen }/>

      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
