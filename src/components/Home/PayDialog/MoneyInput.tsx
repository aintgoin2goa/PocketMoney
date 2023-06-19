import React from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {CurrencySymbol} from '../../../data/types';
import {printCurrency} from '../../../data/utils';
import {getColors} from '../../../styles/colors';
import Slider from '@react-native-community/slider';
import {TITLE_FONT} from '../../../styles/typography';
import {useAppDispatch, useAppSelector} from '../../../data/store';
import {getCurrentPayment} from '../../../data/settings/selectors';
import actions from '../../../data/actions';

export type MoneyInputProps = {
  currency: CurrencySymbol;
  pocketMoneyPerWeek: number;
  owed: number;
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
  step,
  pocketMoneyPerWeek,
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const minimumValue = 0;
  const maximumValue = owed > 0 ? owed * 2 : pocketMoneyPerWeek * 2;
  const amount = useAppSelector(getCurrentPayment);
  const dispatch = useAppDispatch();

  const onValueChange = (value: number) => {
    dispatch(actions.setCurrentPayment(value));
  };

  console.log('MoneyInput', {amount, owed});

  return (
    <View testID="MoneyInput" style={styles.container}>
      <Text testID="MoneyInput__Amount" style={styles.amount}>
        {printCurrency(amount, currency)}
      </Text>
      <View style={styles.sliderContainer}>
        <Slider
          testID="MoneyInput__Slider"
          value={amount}
          maximumValue={maximumValue}
          minimumValue={minimumValue}
          step={step}
          onValueChange={onValueChange}
        />
      </View>
    </View>
  );
};
