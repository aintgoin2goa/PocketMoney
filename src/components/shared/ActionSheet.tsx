import React from 'react';
import {Button, Modal, StyleSheet, useColorScheme, View} from 'react-native';
import {getColors} from '../../styles/colors';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: '#00000080',
    },
    modal: {},
    contentContainer: {
      flex: 1,
      marginBottom: 0,
      justifyContent: 'flex-start',
    },
    inputContainer: {
      backgroundColor: colors.background,
      padding: 50,
    },
    buttonRow: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.text,
    },
    submit: {},
    cancel: {},
    spacer: {
      flex: 1,
    },
  });
};

export type ActionSheetProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onShow?: () => void;
  onDone?: () => void;
  children: React.ReactNode;
};

export const ActionSheet: React.FC<ActionSheetProps> = ({
  show,
  setShow,
  children,
  onDone = () => {},
  onShow = () => {},
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  return (
    <Modal
      style={styles.modal}
      animationType="slide"
      visible={show}
      onShow={onShow}
      transparent={true}>
      <View style={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.buttonRow}>
          <View style={styles.cancel}>
            <Button title="Cancel" onPress={() => setShow(false)} />
          </View>
          <View style={styles.submit}>
            <Button
              title="OK"
              onPress={() => {
                onDone();
                setShow(false);
              }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>{children}</View>
      </View>
    </Modal>
  );
};
