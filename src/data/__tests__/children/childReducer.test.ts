import {childSlice} from '../../children/childReducer';
import {makeChild, makeChildren} from '../utils';

describe('childReducer', () => {
  describe('editChild', () => {
    it('can edit a child', () => {
      const children = makeChildren(3);
      const childToEdit = {...children[1]};
      childToEdit.name = 'edited';
      const action = childSlice.actions.editChild(childToEdit);

      const result = childSlice.reducer(children, action);
      expect(result[1].name).toEqual('edited');
    });

    it('should return children unedited if no child found matching the given id', () => {
      const children = makeChildren(3);
      const childToEdit = {...children[1]};
      childToEdit.id = 'notfound';
      childToEdit.name = 'edited';
      const action = childSlice.actions.editChild(childToEdit);

      const result = childSlice.reducer(children, action);
      expect(result).toEqual(children);
    });
  });

  describe('deleteChild', () => {
    it('should delete the given child', () => {
      const children = makeChildren(3);
      const childToDelete = {...children[2]};
      const action = childSlice.actions.deleteChild(childToDelete);

      const result = childSlice.reducer(children, action);

      expect(result).toHaveLength(2);
      expect(result).not.toContain(childToDelete);
    });

    it('should return children unedited if no child found matching the given id', () => {
      const children = makeChildren(3);
      const childToDelete = {...children[2]};
      childToDelete.id = 'notfound';
      const action = childSlice.actions.deleteChild(childToDelete);

      const result = childSlice.reducer(children, action);

      expect(result).toHaveLength(3);
    });
  });

  describe('addChild', () => {
    it('should be able to add a child', () => {
      const children = makeChildren(1);
      const newChild = makeChild('new-child');
      const action = childSlice.actions.addChild(newChild);

      const result = childSlice.reducer(children, action);

      expect(result).toHaveLength(2);
      expect(result).toContain(newChild);
    });
    it('if only the initial "placeholder" child is there, replace instead', () => {
      // placeholder child has a blank name
      const children = [makeChild('')];
      const newChild = makeChild('new-child');
      const action = childSlice.actions.addChild(newChild);

      const result = childSlice.reducer(children, action);

      expect(result).toHaveLength(1);
      expect(result).toContain(newChild);
    });
  });
});
