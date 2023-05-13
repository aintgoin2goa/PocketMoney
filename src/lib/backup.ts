import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
import {AppState, store} from '../data/store';
import {restoreBackup} from '../data/reducers/global-reducer';

const client = new S3Client({
  // The AWS Region where the Amazon Simple Storage Service (Amazon S3) bucket will be created. Replace this with your Region.
  region: 'eu-west-1',
  credentials: fromCognitoIdentityPool({
    // Replace the value of 'identityPoolId' with the ID of an Amazon Cognito identity pool in your Amazon Cognito Region.
    identityPoolId: 'eu-west-1:de8eff08-9d6d-4455-b4b0-0f13d1ef3202',
    // Replace the value of 'region' with your Amazon Cognito Region.
    clientConfig: {region: 'eu-west-1'},
  }),
});

export const backup = async () => {
  try {
    const data = store.getState() as AppState;
    console.log('DATA', data);
    const Body = JSON.stringify(data);
    const command = new PutObjectCommand({
      Bucket: 'pocket-money',
      Key: 'test/backup.json',
      Body,
    });
    const response = await client.send(command);
    console.log({response});
  } catch (e) {
    console.error(e);
  }
};

export const restore = async () => {
  try {
    const command = new GetObjectCommand({
      Bucket: 'pocket-money',
      Key: 'test/backup.json',
    });
    const response = await client.send(command);
    console.log({response});
    if (response.Body) {
      const body = await response.Body.transformToString();
      if (!body) {
        return;
      }
      const data = JSON.parse(body);
      console.log(data);
      store.dispatch(restoreBackup(data));
    }
  } catch (error) {
    console.error({error});
  }
};
