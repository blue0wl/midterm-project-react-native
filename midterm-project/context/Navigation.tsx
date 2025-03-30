import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import { JobsProvider } from '../context/JobsContext';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationForm from '../screens/ApplicationForm';
import { RootStackParamList } from '../src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="JobFinder"
      screenOptions={{
        headerShown: false // This hides the header for all screens
      }}
    >
      <Stack.Screen
        name="JobFinder"
        component={JobFinderScreen}
      />
      <Stack.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
      />
      <Stack.Screen
        name="ApplicationForm"
        component={ApplicationForm}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <ThemeProvider>
      <JobsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </JobsProvider>
    </ThemeProvider>
  );
};