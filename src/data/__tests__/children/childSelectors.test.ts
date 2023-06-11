import {
  activeChildDetailsSelector,
  activeChildSelector,
  childCountSelector,
  getActiveChild,
  getChild,
  getChildren,
  getSettings,
  inactiveChildrenSelector,
  settingsSelector,
} from '../../children/childSelectors';
import {initialState} from '../../initialState';
import {Child, ChildSettings, State} from '../../types';

const STERLING = {major: '£', minor: 'p'};

const defaultSettings: ChildSettings = {
  currency: STERLING,
  pocketMoneyPerWeek: 100,
  payDay: 6,
  beginningOfTime: '',
};

const generateMockChild = (
  id: string,
  settings: Partial<ChildSettings> = {},
): Child => {
  return {
    id,
    name: id,
    payments: [],
    settings: {...defaultSettings, ...settings},
  };
};

const generateMockState = (children: number = 1): State => {
  const state: State = JSON.parse(JSON.stringify(initialState));
  for (let i = 0; i < children; i++) {
    state.children[i] = generateMockChild(i.toString());
  }
  return state;
};

describe('data/children/childSelectors', () => {
  describe('getChildren', () => {
    it('should return all children in state', () => {
      const state = generateMockState(2);
      const children = getChildren(state);
      expect(children).toEqual(state.children);
    });
  });
  describe('getChild', () => {
    it('should return a given child by id', () => {
      const state = generateMockState(2);
      const child = getChild(state, state.children[0].id);
      expect(child).toEqual(state.children[0]);
    });
    it('should return undefined if no child found', () => {
      const state = generateMockState(2);
      const child = getChild(state, 'no-child');
      expect(child).toBeUndefined();
    });
  });
  describe('getActiveChild', () => {
    it('should get the child with id matching activeChild in settings', () => {
      const state = generateMockState(2);
      state.settings.currentChild = state.children[1].id;
      const child = getActiveChild(state);
      expect(child).toEqual(state.children[1]);
    });
    it('should return the first child if active cannot be found', () => {
      const state = generateMockState(2);
      const child = getActiveChild(state);
      expect(child).toEqual(state.children[0]);
    });
  });
  describe('getSettings', () => {
    it('should return settings for active child', () => {
      const state = generateMockState(2);
      state.settings.currentChild = state.children[1].id;
      const settings = getSettings(state);
      expect(settings).toEqual(state.children[1].settings);
    });
  });
  describe('activeChildSelector', () => {
    it('should return the name of the active child', () => {
      const state = generateMockState(2);
      state.settings.currentChild = state.children[1].id;
      const name = activeChildSelector(state);
      expect(name).toEqual(state.children[1].name);
    });
  });
  describe('activeChildDetailsSelector', () => {
    it('should return all data for active child', () => {
      const state = generateMockState(2);
      state.settings.currentChild = state.children[1].id;
      const details = activeChildDetailsSelector(state);
      expect(details).toEqual(state.children[1]);
    });
  });
  describe('settingsSelector', () => {
    it('should return settings for active child', () => {
      const state = generateMockState(2);
      state.settings.currentChild = state.children[1].id;
      const settings = settingsSelector(state);
      expect(settings).toEqual(state.children[1].settings);
    });
  });
  describe('childCountSelector', () => {
    it('should return number of children', () => {
      const state = generateMockState(4);
      const count = childCountSelector(state);
      expect(count).toEqual(4);
    });
  });
  describe('inactiveChildrenSelector', () => {
    it('should return all children except active one', () => {
      const state = generateMockState(3);
      state.settings.currentChild = state.children[1].id;
      const children = inactiveChildrenSelector(state);
      expect(children).toEqual([state.children[0], state.children[2]]);
    });
  });
});
