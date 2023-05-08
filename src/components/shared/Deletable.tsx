import React, {useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {getColors} from '../../styles/colors';
import {TITLE_FONT} from '../../styles/typography';

const getStyles = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return StyleSheet.create({
    deleteButtonContainer: {
      backgroundColor: colors.highlight,
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    deleteButtonText: {
      color: colors.background,
      fontFamily: TITLE_FONT,
      fontWeight: 'bold',
      fontSize: 20,
    },
  });
};

export type DeletableProps = {
  children: React.ReactNode;
  onDelete: () => void;
};

const renderRightActions =
  (
    styles: ReturnType<typeof getStyles>,
    onDeletePress: () => ReturnType<typeof Alert.alert>,
  ) =>
  () => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity onPress={onDeletePress}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

export const Deletable: React.FC<DeletableProps> = ({children, onDelete}) => {
  const ref = useRef<Swipeable>(null);
  const styles = getStyles(useColorScheme() === 'dark');
  const onDeletePress = () => {
    return Alert.alert('Are you sure?', 'This cannot be undone!', [
      {
        text: 'Yes',
        onPress: () => {
          ref.current?.close && ref.current.close();
          onDelete();
        },
      },
      {text: 'No'},
    ]);
  };
  return (
    <Swipeable
      ref={ref}
      renderRightActions={renderRightActions(styles, onDeletePress)}>
      {children}
    </Swipeable>
  );
};
