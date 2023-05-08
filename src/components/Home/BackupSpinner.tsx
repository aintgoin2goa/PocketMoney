import React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';

const getStyles = (
  isDarkMode: boolean,
  spin: Animated.AnimatedInterpolation,
) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    spinner: {
      transform: [{rotate: spin as unknown as string}],
    },
    text: {
      color: colors.background,
      fontFamily: BASE_FONT,
      fontSize: 40,
    },
  });
};

export type BackupSpinnerProps = {
  text: string;
};

export const BackupSpinner: React.FC<BackupSpinnerProps> = ({text}) => {
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDarkMode = useColorScheme() === 'dark';
  const colors = getColors(isDarkMode);
  const styles = getStyles(isDarkMode, spin);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.spinner}>
        <Icon name="sync" size={120} color={colors.background} />
      </Animated.View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
