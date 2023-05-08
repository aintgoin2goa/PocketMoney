import React from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {CurrencySymbol} from '../../../data/types';
import {printCurrency} from '../../../data/utils';
import {getColors} from '../../../styles/colors';
import {Slider} from '@miblanchard/react-native-slider';
import {TITLE_FONT} from '../../../styles/typography';

export type MoneyInputProps = {
  currency: CurrencySymbol;
  pocketMoneyPerWeek: number;
  owed: number;
  amount: number;
  setAmount: (amount: number) => void;
  step: number;
};

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      //   flex: 1,
      //   alignItems: 'center',
      //   justifyContent: 'center',
    },
    amount: {
      fontFamily: TITLE_FONT,
      fontSize: 80,
      color: colors.highlight,
      flexWrap: 'nowrap',
      flexShrink: 1,
      textAlign: 'center',
    },
    sliderContainer: {},
    thumb: {
      backgroundColor: colors.background,
      borderRadius: 30 / 2,
      height: 30,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.35,
      shadowRadius: 2,
      width: 30,
    },
    track: {
      borderRadius: 1,
      height: 2,
    },
  });
};

export const MoneyInput: React.FC<MoneyInputProps> = ({
  currency,
  owed,
  amount,
  step,
  setAmount,
  pocketMoneyPerWeek,
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const onChange = value => {
    setAmount(value);
  };
  const minimumValue = 0;
  const maximumValue = owed > 0 ? owed * 2 : pocketMoneyPerWeek * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>{printCurrency(amount, currency)}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          value={amount}
          maximumValue={maximumValue}
          minimumValue={minimumValue}
          step={step}
          onValueChange={onChange}
        />
      </View>
    </View>
  );
};
