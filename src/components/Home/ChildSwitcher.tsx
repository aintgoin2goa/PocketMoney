import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text} from '@rneui/base';
import React from 'react';
import {Pressable, StyleSheet, useColorScheme, View} from 'react-native';
import {useSelector} from 'react-redux';
import actions from '../../data/actions';
import {inactiveChildrenSelector} from '../../data/children/childSelectors';
import {useAppDispatch} from '../../data/store';
import {Child} from '../../data/types';
import {getColors} from '../../styles/colors';
import {BASE_FONT} from '../../styles/typography';
import {StackList} from '../../types';
import {Deletable} from '../shared/Deletable';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'column',
      width: '100%',
      top: 50,
      zIndex: 2,
    },
    row: {
      backgroundColor: colors.background,
      justifyContent: 'center',
      paddingVertical: 10,
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

export type ChildSwitcherProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  navigation: NativeStackNavigationProp<StackList, 'Home'>;
};

const ChildRow: React.FC<{
  child: Child;
  setVisible: (visible: boolean) => void;
}> = ({child, setVisible}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const dispatch = useAppDispatch();
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => {
          setVisible(false);
          dispatch(actions.switchChild(child));
        }}>
        <Text style={styles.text}>{child.name}</Text>
      </Pressable>
    </View>
  );
};

export const ChildSwitcher: React.FC<ChildSwitcherProps> = ({
  visible,
  setVisible,
  navigation,
}) => {
  const styles = getStyles(useColorScheme() === 'dark');
  const children = useSelector(inactiveChildrenSelector);
  const dispatch = useAppDispatch();
  if (!visible) {
    return null;
  }

  const rows = children.map(child => (
    <Deletable
      key={child.id}
      onDelete={() => dispatch(actions.deleteChild(child))}>
      <ChildRow setVisible={setVisible} child={child} />
    </Deletable>
  ));

  return (
    <View style={styles.container}>
      {rows}
      <View style={styles.row}>
        <Pressable
          testID="ChildSwitcher__AddChildButton"
          onPress={() => navigation.navigate('Add Child')}>
          <Text style={styles.text}>ADD CHILD</Text>
        </Pressable>
      </View>
    </View>
  );
};
