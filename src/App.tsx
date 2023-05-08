/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {Home} from './components/Home';
import {getColors} from './styles/colors';
import {useAppSelector} from './/data/store';
import {PaymentHistory} from './components/PaymentHistory';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackList} from './types';
import {EditChild} from './components/EditChild';
import {AddChild} from './components/EditChild/AddChild';
import {childCountSelector} from './data/children/childSelectors';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });
};

const Stack = createNativeStackNavigator<StackList>();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const childCount = useAppSelector(childCountSelector);
  const initialRouteName: keyof StackList =
    childCount > 0 ? 'Home' : 'Add Child';
  // console.log({childCount, initialRouteName});

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={initialRouteName}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="Payment History"
            component={PaymentHistory}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="Edit Child"
            component={EditChild}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="Add Child"
            component={AddChild}
            options={{
              headerShown: true,
              headerBackButtonMenuEnabled: !!childCount,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
