import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import actions from '../../data/actions';
import {childCountSelector} from '../../data/children/childSelectors';
import {useAppDispatch, useAppSelector} from '../../data/store';
import {Child} from '../../data/types';
import {StackList} from '../../types';
import {ChildEditor} from './ChildEditor';

export type AddChildProps = NativeStackScreenProps<StackList, 'Add Child'>;

export const AddChild: React.FC<AddChildProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const childCount = useAppSelector(childCountSelector);

  useEffect(() => {
    navigation.setOptions({headerBackButtonMenuEnabled: childCount > 0});
  }, [childCount, navigation]);

  const onSave = async (childToSave: Child) => {
    dispatch(actions.addChild(childToSave));
    navigation.navigate('Home');
  };

  return <ChildEditor onSave={onSave} />;
};
