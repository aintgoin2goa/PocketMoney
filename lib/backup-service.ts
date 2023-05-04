import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {sha256} from 'react-native-sha256';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getBackupKey as getBackupKeyFromState} from '../data/global/selectors';
import {globalSlice} from '../data/global/slice';
import {store} from '../data/store';
import {Alert} from 'react-native';

let bucketClient: S3Client;

const getClient = () => {
  if (!bucketClient) {
    bucketClient = new S3Client({
      region: 'eu-west-1',
      credentials: {
        accessKeyId: 'AKIA6EIOYUMBFR4XIUXI',
        secretAccessKey: '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',
      },
    });
  }
  return bucketClient;
};

const getBackupKey = async (): Promise<string> => {
  console.log('STATE', store.getState());
  const keyFromState = getBackupKeyFromState(store.getState());
  if (keyFromState) {
    console.log('key found in state', keyFromState);
    return keyFromState;
  }
  const email = 'paul.wilson66@gmail.com';
  const hash = await sha256(email);
  console.log('key generated', hash);
  store.dispatch(globalSlice.actions.setBackupKey({key: hash}));
  console.log('key saved', store.getState());
  return hash;
};

const testHTTPGet = async () => {
  try {
    const response = await fetch('https://api.ipify.org/?format=json');
    console.log('HTTP GET', response);
  } catch (e) {
    console.error('HTTP GET Failed', e);
  }
};

export const doBackup = async (): Promise<void> => {
  const backupKey = await getBackupKey();
  const Key = `backups/${backupKey}.json`;
  const Body = JSON.stringify({foo: 'bar', foo2: 'bar2'});
  console.log('BACKUPKEY', backupKey);
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: 'pocket-money',
    Key,
    Body,
  });
  // await testHTTPGet();
  try {
    console.log('UPLOAD', command);
    const response = await client.send(command);
    console.log('UPLOAD COMPLETE', Key, Body, response);
  } catch (e) {
    console.error(e);
    Alert.alert('Failed to upload', (e as Error).message);
  }
};
