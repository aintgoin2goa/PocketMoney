import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {activeChildSelector} from '../../data/children/childSelectors';
import {useAppSelector} from '../../data/store';
import {getColors} from '../../styles/colors';
import {StackList} from '../../types';
import {ChildSwitcher} from './ChildSwitcher';

const createStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      height: 50,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderBottomColor: colors.text,
      borderBottomWidth: 1,
      flexDirection: 'row',
    },
    settingsIcon: {
      alignSelf: 'flex-end',
      color: colors.text,
    },
    childNameContainer: {
      justifyContent: 'center',
      flexGrow: 1,
      flexDirection: 'row',
    },
    childName: {
      fontFamily: 'Helvetica',
      fontSize: 20,
      color: colors.text,
    },
    childMenuIcon: {
      marginLeft: 5,
      marginTop: 2,
      color: colors.text,
    },
    menuIcon: {
      alignSelf: 'flex-start',
      color: colors.text,
    },
  });
};

export type TopBarProps = {
  navigation: NativeStackNavigationProp<StackList, 'Home'>;
  menuIcon: 'menu-outline' | 'close';
  onMenuPress: () => void;
};

export const TopBar: React.FC<TopBarProps> = ({
  navigation,
  onMenuPress,
  menuIcon,
}) => {
  const styles = createStyles(useColorScheme() === 'dark');
  const name = useAppSelector(activeChildSelector);
  const [childSwitcherVisible, setChildSwitcherVisible] = useState(false);
  navigation.addListener('transitionEnd', () => setChildSwitcherVisible(false));
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Pressable onPress={onMenuPress}>
          <Icon name={menuIcon} size={30} style={styles.menuIcon} />
        </Pressable>
        <Pressable
          testID="HomeScreen__ChildSwitcherButton"
          style={styles.childNameContainer}
          onPress={() => setChildSwitcherVisible(!childSwitcherVisible)}>
          <Text testID="HomeScreen__ChildName" style={styles.childName}>
            {name}
          </Text>
          <Icon
            style={styles.childMenuIcon}
            name={childSwitcherVisible ? 'caret-up' : 'caret-down'}
            size={20}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Edit Child')}>
          <Icon
            name="ios-settings-outline"
            size={30}
            style={styles.settingsIcon}
          />
        </Pressable>
      </View>
      <ChildSwitcher
        visible={childSwitcherVisible}
        navigation={navigation}
        setVisible={setChildSwitcherVisible}
      />
    </React.Fragment>
  );
};
