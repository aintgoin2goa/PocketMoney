import {Text} from '@rneui/base';
import React, {useRef} from 'react';
import {
  StyleSheet,
  useColorScheme,
  Animated,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';
import {backup as doBackup, restore as doRestore} from '../../lib/backup';
import {useAppDispatch, useAppSelector} from '../../data/store';
import {getOfflineMode} from '../../data/settings/selectors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackList} from '../../types';
import actions from '../../data/actions';

const getStyles = (isDarkMode: boolean, animation: Animated.Value) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    menu: {
      position: 'absolute',
      zIndex: 10,
      top: 50,
      display: 'flex',
      width: '80%',
      height: '100%',
      opacity: 0.9,
      transform: [{translateX: animation as unknown as number}],
      backgroundColor: colors.background,
      borderRightColor: colors.text,
      borderRightWidth: 1,
      shadowColor: colors.text,
      shadowOffset: {width: 0, height: 5},
      shadowRadius: 6,
      shadowOpacity: 0.34,
      elevation: 10,
    },
    header: {
      backgroundColor: colors.background,
      height: 70,
      borderBottomColor: colors.text,
      borderBottomWidth: 1,
    },
    row: {
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderBottomColor: colors.text,
      borderBottomWidth: 1,
    },
    text: {
      fontFamily: BASE_FONT,
      color: colors.text,
      textAlign: 'center',
      fontSize: 20,
    },
  });
};

export type SideMenuProps = {
  show: boolean;
  closeMenu: () => void;
  showSpinner: (show: boolean) => void;
  navigation: NativeStackNavigationProp<StackList, 'Home', undefined>;
};

const duration = 500;

export const SideMenu: React.FC<SideMenuProps> = ({
  show,
  closeMenu,
  showSpinner,
  navigation,
}) => {
  const {width: screenWidth} = useWindowDimensions();
  const isOffline = useAppSelector(getOfflineMode);
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const styles = getStyles(useColorScheme() === 'dark', slideAnim);
  const dispatch = useAppDispatch();

  const toValue = show ? 0 : -screenWidth;

  Animated.timing(slideAnim, {
    toValue,
    duration,
    useNativeDriver: true,
  }).start();

  const backup = async () => {
    closeMenu();
    showSpinner(true);
    await doBackup();
    showSpinner(false);
  };

  const restore = async () => {
    closeMenu();
    showSpinner(true);
    await doRestore();
    showSpinner(false);
  };

  const online = async () => {
    closeMenu();
    dispatch(actions.setOfflineMode(false));
    navigation.navigate('Start');
  };

  return (
    <Animated.View style={styles.menu}>
      {!isOffline && (
        <View style={styles.row}>
          <Pressable>
            <Text style={styles.text} onPress={backup}>
              Backup
            </Text>
          </Pressable>
        </View>
      )}

      {!isOffline && (
        <View style={styles.row}>
          <Pressable>
            <Text style={styles.text} onPress={restore}>
              Restore
            </Text>
          </Pressable>
        </View>
      )}

      {isOffline && (
        <View style={styles.row}>
          <Pressable>
            <Text style={styles.text} onPress={online}>
              Go online
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};
