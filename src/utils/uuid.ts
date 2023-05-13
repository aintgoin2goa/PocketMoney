import uuid from 'react-native-uuid';

export const generateUUID = (prefix: string) => `${prefix}-${uuid.v4()}`;
