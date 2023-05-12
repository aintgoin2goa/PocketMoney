import React, {useState} from 'react';
import {Button, StyleSheet, useColorScheme, View} from 'react-native';
import {TopBar, Owed} from '.';
import {PrimaryActionButton} from '../shared/PrimaryActionButton';
import {PayDialog} from './PayDialog';
import {Dates} from './Dates';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackList} from '../../types';
import {getColors} from '../../styles/colors';
import {SideMenu} from './SideMenu';
import {BackupSpinner} from './BackupSpinner';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    footer: {
      padding: 10,
    },
  });
};

export type HomeProps = NativeStackScreenProps<StackList, 'Home'>;

export const Home: React.FC<HomeProps> = ({navigation}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackupSpinner, setShowBackupSpinner] = useState(false);

  const menuPressed = () => {
    setShowMenu(!showMenu);
  };

  const menuIcon = showMenu ? 'close' : 'menu-outline';

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        onMenuPress={menuPressed}
        menuIcon={menuIcon}
      />
      <SideMenu
        show={showMenu}
        closeMenu={() => setShowMenu(false)}
        showSpinner={setShowBackupSpinner}
      />
      <View style={styles.contentContainer}>
        <Owed />
        <Dates />
        <Button
          title="View Payment History"
          onPress={() => navigation.navigate('Payment History')}
        />
      </View>
      <View style={styles.footer}>
        <PrimaryActionButton
          text="Pay"
          onPress={() => setShowPayDialog(true)}
        />
      </View>
      <PayDialog
        setShowPayDialog={setShowPayDialog}
        showPayDialog={showPayDialog}
      />
      {showBackupSpinner && <BackupSpinner text="Please Wait..." />}
    </View>
  );
};
