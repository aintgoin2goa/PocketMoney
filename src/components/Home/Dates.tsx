import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {
  lastPaymentSelector,
  nextPaymentSelector,
} from '../../data/payments/paymentSelectors';
import {useAppSelector} from '../../data/store';
import {getColors} from '../../styles/colors';
import {BASE_FONT, TITLE_FONT} from '../../styles/typography';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    innerContainer: {
      marginTop: 50,
      // flex: 1,
    },
    title: {
      fontFamily: TITLE_FONT,
      fontSize: 25,
      backgroundColor: colors.text,
      color: colors.background,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    amount: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      color: colors.text,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  });
};

export const Dates: React.FC = () => {
  const styles = getStyles(useColorScheme() === 'dark');
  const nextDueDate = useAppSelector(nextPaymentSelector);
  const lastPaid = useAppSelector(lastPaymentSelector);
  console.info('Dates', {nextDueDate, lastPaid, now: new Date()});
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Next due</Text>
        <Text style={styles.amount}>{nextDueDate}</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Last paid </Text>
        <Text style={styles.amount}>{lastPaid}</Text>
      </View>
    </View>
  );
};
