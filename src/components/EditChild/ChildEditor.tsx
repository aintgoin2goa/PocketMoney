import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Child, CurrencySymbol} from '../../data/types';
import {BASE_FONT} from '../../styles/typography';
import {getColors} from '../../styles/colors';
import {formatDate, parseDate, splitCurrencyAmount} from '../../data/utils';
import {PrimaryActionButton} from '../shared/PrimaryActionButton';
import {Picker} from '@react-native-picker/picker';
import {ActionSheet} from '../shared/ActionSheet';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {generateUUID} from '../../utils/uuid';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: colors.background,
    },
    moneyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencySymbol: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      color: colors.text,
    },
    field: {
      marginBottom: 20,
      marginTop: 10,
    },
    labelText: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      marginBottom: 10,
      color: colors.text,
    },
    inlineLabelText: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      marginHorizontal: 5,
      color: colors.text,
    },
    input: {
      height: 40,
      padding: 5,
      borderWidth: 1,
      borderColor: colors.text,
      fontFamily: BASE_FONT,
      fontSize: 20,
      backgroundColor: colors.background,
      color: colors.text,
      flexGrow: 1,
    },
    valueContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'baseline',
    },
    value: {
      fontFamily: BASE_FONT,
      fontSize: 20,
      fontWeight: 'bold',
      marginHorizontal: 10,
      color: colors.text,
    },
  });
};

const daysOfWeek = [
  {label: 'Monday', value: 1},
  {label: 'Tuesday', value: 2},
  {label: 'Wednesday', value: 3},
  {label: 'Thursday', value: 4},
  {label: 'Friday', value: 5},
  {label: 'Saturday', value: 6},
  {label: 'Sunday', value: 0},
];

const CURRENCY_POUNDS = {major: '£', minor: 'p'};
const CURRENCY_EUROS = {major: '€', minor: 'c'};

const currencyMap = new Map<string, CurrencySymbol>([
  [CURRENCY_POUNDS.major, CURRENCY_POUNDS],
  [CURRENCY_EUROS.major, CURRENCY_EUROS],
]);

const currencies = Array.from(currencyMap.keys()).map(k => ({
  label: k,
  value: k,
}));

const currenciesPickerItems = () => {
  return currencies.map(c => (
    <Picker.Item key={c.value} label={c.label} value={c.value} />
  ));
};

const daysOfWeekPickerItems = () => {
  return daysOfWeek.map(d => <Picker.Item key={d.value} {...d} />);
};

const dayAsText = (value: number): string =>
  daysOfWeek.find(d => d.value === value)?.label ?? 'ERROR';

export type ChildEditorProps = {
  child?: Child;
  onSave: (child: Child) => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
};

export const ChildEditor: React.FC<ChildEditorProps> = ({
  child,
  onSave,
  secondaryButtonText,
  onSecondaryButtonClick,
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const [name, setName] = useState(child?.name ?? '');
  const pocketMoneyAmounts = splitCurrencyAmount(
    child?.settings?.pocketMoneyPerWeek,
  );
  const [pounds, setPounds] = useState(pocketMoneyAmounts[0]);
  const [pence, setPence] = useState(pocketMoneyAmounts[1]);

  const [day, setDay] = useState(child?.settings?.payDay ?? 0);
  const [pickerDay, setPickerDay] = useState(day);

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const [beginningOfTime, setBeginningOfTime] = useState(
    parseDate(child?.settings?.beginningOfTime ?? formatDate(new Date())),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [currency, setCurrency] = useState(
    child?.settings?.currency.major ?? CURRENCY_POUNDS.major,
  );
  const [pickerCurrency, setPickerCurrency] = useState(currency);
  const [pickerDate, setPickerDate] = useState(beginningOfTime);

  const onSaveClick = () => {
    const currencyToSave = currencyMap.get(currency) ?? CURRENCY_POUNDS;
    const pocketMoneyPerWeek = pounds * 100 + pence;
    const childToSave: Child = {
      id: child?.id ?? generateUUID('CHILD'),
      name,
      payments: child?.payments ?? [],
      settings: {
        ...(child?.settings ?? {}),
        currency: currencyToSave,
        payDay: day,
        pocketMoneyPerWeek,
        beginningOfTime: formatDate(beginningOfTime),
      },
    };

    onSave(childToSave);
  };

  return (
    <View style={styles.container} testID="ChildEditor">
      {secondaryButtonText && onSecondaryButtonClick && (
        <Button
          title={secondaryButtonText}
          onPress={() => onSecondaryButtonClick()}
        />
      )}

      <View style={styles.field}>
        <Text style={styles.labelText}>Name</Text>
        <TextInput
          testID="ChildEditor__NameInput"
          value={name}
          style={styles.input}
          onChangeText={setName}
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <View style={styles.valueContainer}>
          <Text style={styles.labelText}>Pocket money day:</Text>
          <Text testID="ChildEditor__PayDay" style={styles.value}>
            {dayAsText(day)}
          </Text>
          <Button
            testID="ChildEditor__ChangeDay"
            title="Change"
            onPress={() => setShowDayPicker(true)}
          />
        </View>
        <ActionSheet
          show={showDayPicker}
          setShow={setShowDayPicker}
          onDone={() => setDay(pickerDay)}>
          <Picker
            testID="ChildEditor__DayPicker"
            selectedValue={pickerDay}
            onValueChange={setPickerDay}>
            {daysOfWeekPickerItems()}
          </Picker>
        </ActionSheet>
      </View>

      <View style={styles.field}>
        <Text style={styles.labelText}>Pocket money per week</Text>
        <View style={styles.moneyContainer}>
          <Text testID="ChildEditor__Currency" style={styles.inlineLabelText}>
            {currency}
          </Text>
          <TextInput
            testID="ChildEditor__Amount__Major"
            style={styles.input}
            value={String(pounds)}
            keyboardType="numeric"
            onChangeText={text => setPounds(Number(text))}
            returnKeyType="done"
          />
          <Text style={styles.inlineLabelText}>.</Text>
          <TextInput
            testID="ChildEditor__Amount__Minor"
            style={styles.input}
            value={String(pence)}
            keyboardType="numeric"
            onChangeText={text => setPence(Number(text))}
            returnKeyType="done"
          />
        </View>
        <Button
          testID="ChildEditor__ChangeCurrencyButton"
          title="change currency"
          onPress={() => setShowCurrencyPicker(true)}
        />
        <ActionSheet
          show={showCurrencyPicker}
          setShow={setShowCurrencyPicker}
          onDone={() => setCurrency(pickerCurrency)}>
          <Picker
            testID="ChildEditor__CurrencyPicker"
            selectedValue={pickerCurrency}
            onValueChange={setPickerCurrency}>
            {currenciesPickerItems()}
          </Picker>
        </ActionSheet>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.labelText}>Begin on:</Text>
        <Text testID="ChildEditor__BeginDate" style={styles.value}>
          {format(beginningOfTime, 'do MMM yyyy')}
        </Text>
        <Button
          testID="ChildEditor__ChangeBeginDateButton"
          title="Change"
          onPress={() => setShowDatePicker(true)}
        />

        <ActionSheet
          show={showDatePicker}
          setShow={setShowDatePicker}
          onDone={() => setBeginningOfTime(pickerDate)}>
          {showDatePicker && (
            <DateTimePicker
              testID="ChildEditor__DatePicker"
              value={pickerDate}
              display="spinner"
              mode="date"
              onChange={(e, selectedDate) => setPickerDate(selectedDate!)}
            />
          )}
        </ActionSheet>
      </View>
      <PrimaryActionButton
        testID="ChildEditor__SaveButton"
        onPress={onSaveClick}
        text="Save"
      />
    </View>
  );
};
