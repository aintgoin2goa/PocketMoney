import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import actions from '../../data/actions';
import {useAppDispatch} from '../../data/store';
import {generateBackupKey} from '../../lib/backup';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';
import {PrimaryActionButton} from '../shared/PrimaryActionButton';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
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
    input: {
      height: 60,
      padding: 5,
      borderWidth: 1,
      borderColor: colors.text,
      fontFamily: BASE_FONT,
      fontSize: 20,
      backgroundColor: colors.background,
      color: colors.text,
    },
  });
};

type AddEmailProps = {
  display: boolean;
};

export const AddEmail: React.FC<AddEmailProps> = ({display}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();

  if (!display) {
    return null;
  }

  const onContinueClick = async () => {
    const backupKey = await generateBackupKey(email.toLowerCase());
    dispatch(actions.setBackupKey({key: backupKey}));
  };

  const onOfflineModeClick = async () => {
    dispatch(actions.setOfflineMode(true));
  };

  return (
    <React.Fragment>
      <View style={styles.field}>
        <Text style={styles.labelText}>Enter your email:</Text>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={setEmail}
          returnKeyType="go"
        />
      </View>
      <Button title="Offline mode" onPress={onOfflineModeClick} />
      <PrimaryActionButton onPress={onContinueClick} text="Continue" />
    </React.Fragment>
  );
};
