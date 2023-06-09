import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../store';
import {State} from '../types';
import {getActiveChildId} from '../settings/selectors';

export const getChildren = (state: State) => {
  return state.children;
};

export const getChild = (state: State, id: string) => {
  return state.children.find(c => c.id === id);
};

export const getActiveChild = (state: State) => {
  const id = getActiveChildId(state);
  const child = getChild(state, id);
  return child ? child : state.children[0];
};

export const getSettings = (state: AppState) => getActiveChild(state)?.settings;

export const activeChildSelector = createSelector(
  getActiveChild,
  child => child.name,
);

export const activeChildDetailsSelector = createSelector(
  getActiveChild,
  child => child,
);

export const settingsSelector = createSelector(
  getSettings,
  settings => settings,
);

export const childCountSelector = createSelector(
  getChildren,
  children => children.filter(c => c.name !== '').length,
);

export const inactiveChildrenSelector = createSelector(
  getChildren,
  getActiveChild,
  (children, activeChild) => {
    return children.filter(c => c.id !== activeChild.id);
  },
);
