import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import IntroCalibrationScreen from '../screens/IntroCalibrationScreen';
import MainScreen from '../screens/MainScreen';

export type RootStackParamList = {
    Welcome: undefined;
    IntroCalibration: undefined;
    Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="IntroCalibration" component={IntroCalibrationScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
