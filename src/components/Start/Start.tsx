import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {childCountSelector} from '../../data/children/childSelectors';
import {getBackupKey, getOfflineMode} from '../../data/settings/selectors';
import {useAppSelector} from '../../data/store';
import {restore} from '../../lib/backup';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';
import {StackList} from '../../types';
import {AddEmail} from './AddEmail';

const getStyles = (
  isDarkMode: boolean,
  spin: Animated.AnimatedInterpolation<number>,
) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: colors.background,
    },
    spinnerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    spinner: {
      transform: [{rotate: spin as unknown as string}],
    },
    text: {
      color: colors.text,
      fontFamily: BASE_FONT,
      fontSize: 40,
    },
  });
};

export type StartProps = NativeStackScreenProps<StackList, 'Start'>;

export const Start: React.FC<StartProps> = ({navigation}) => {
  const spinValue = new Animated.Value(0);
  const loop = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDarkMode = useColorScheme() === 'dark';
  const colors = getColors(isDarkMode);
  const styles = getStyles(isDarkMode, spin);

  const backupKey = useAppSelector(getBackupKey);
  const childCount = useAppSelector(childCountSelector);
  const offlineMode = useAppSelector(getOfflineMode);
  const [text, setText] = useState('');

  useEffect(() => {
    if (offlineMode) {
      navigation.navigate('Home');
      return;
    }
    if (!backupKey) {
      return;
    }

    loop.start();
    setText('Restoring backup');

    restore()
      .then(() => {
        loop.stop();
        if (childCount > 0) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Add Child');
        }
      })
      .catch(e => {
        console.error('restore error', e);
        navigation.navigate('Add Child');
      });
  }, [backupKey, childCount, navigation, offlineMode, loop]);

  return (
    <View style={styles.container} testID="StartScreen">
      <AddEmail display={!backupKey} />
      {text && (
        <View style={styles.spinnerContainer}>
          <Animated.View style={styles.spinner}>
            <Icon name="sync" size={120} color={colors.text} />
          </Animated.View>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </View>
  );
};
