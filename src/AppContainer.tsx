/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './data/store';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App';
import {persistStore} from 'redux-persist';
import {View, Text, AppState} from 'react-native';

const listenForAppStateChange = (setNow: (now: number) => void) => {
  AppState.addEventListener('change', nextAppState => {
    console.log('AppStateChange', nextAppState);
    setNow(Date.now());
  });
};

const AppContainer = () => {
  const [rehydrated, setRehydrated] = useState(false);
  const [, setNow] = useState(Date.now());
  React.useEffect(() => listenForAppStateChange(setNow), []);
  const persistor = persistStore(store, {}, () => setRehydrated(true));
  if (!rehydrated) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} />
      <App />
    </Provider>
  );
};

export default AppContainer;
