import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, StyleSheet, Text, useColorScheme, View} from 'react-native';
import actions from '../../data/actions';
import {paymentHistorySelector} from '../../data/payments/paymentSelectors';
import {useAppDispatch, useAppSelector} from '../../data/store';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';
import {StackList} from '../../types';
import {Deletable} from '../shared/Deletable';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    buttonRow: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.text,
    },
    done: {},
    listContainer: {},
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
      backgroundColor: colors.background,
      color: colors.text,
    },
    date: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      color: colors.text,
    },
    amount: {
      fontFamily: BASE_FONT,
      fontWeight: 'bold',
      fontSize: 20,
      color: colors.text,
    },
  });
};

export type PaymentHistoryProps = NativeStackScreenProps<
  StackList,
  'Payment History'
>;

type ItemProps = {
  index: number;
  id: string;
  key: string;
  date: string;
  amount: string;
};

type RenderItemArgs = {
  item: ItemProps;
};

export const Item: React.FC<ItemProps> = ({date, amount, id}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const dispatch = useAppDispatch();
  const onDelete = () => dispatch(actions.deletePayment({id}));
  return (
    <Deletable onDelete={onDelete}>
      <View style={styles.item}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </Deletable>
  );
};

export const PaymentHistory: React.FC<PaymentHistoryProps> = () => {
  const styles = getStyles(useColorScheme() === 'dark');
  const history = useAppSelector(paymentHistorySelector);
  const renderItem = ({item}: RenderItemArgs) => {
    return <Item {...item} />;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};
