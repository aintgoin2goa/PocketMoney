import React from 'react';
import {Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {getColors} from '../../styles/colors';
import {TITLE_FONT} from '../../styles/typography';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      marginTop: 'auto',
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    button: {
      backgroundColor: colors.highlight,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      fontFamily: TITLE_FONT,
      color: colors.background,
      fontSize: 30,
      textAlign: 'center',
    },
  });
};

export type PayButtonProps = {
  text: string;
  onPress: () => void;
};

export const PrimaryActionButton: React.FC<PayButtonProps> = ({
  onPress,
  text,
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
};
