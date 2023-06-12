import {createSlice} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import type {Child} from '../types';
import type {PayloadAction} from '@reduxjs/toolkit';

const editChild = (children: Child[], action: PayloadAction<Child>) => {
  const index = children.findIndex(c => c.id === action.payload.id);
  if (index < 0) {
    return children;
  }

  children[index] = action.payload;
  return children;
};

const deleteChild = (
  children: Child[],
  action: PayloadAction<{id: string}>,
) => {
  const index = children.findIndex(c => c.id === action.payload.id);
  if (index < 0) {
    return children;
  }
  children.splice(index, 1);
  return children;
};

const addChild = (children: Child[], action: PayloadAction<Child>) => {
  // if the placeholder empty child is there, replace it
  if (children.length === 1 && children[0].name === '') {
    children[0] = action.payload;
  } else {
    children.push(action.payload);
  }

  return children;
};

export const childSlice = createSlice({
  name: 'children',
  initialState: initialState.children,
  reducers: {
    addChild,
    editChild,
    deleteChild,
  },
});
