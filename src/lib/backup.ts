import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
import {store} from '../data/store';
import {restoreBackup} from '../data/reducers/global-reducer';
import {State} from '../data/types';
import actions from '../data/actions';
import {sha256} from 'react-native-sha256';
import {appleAuth} from '@invertase/react-native-apple-authentication';

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

const getEmailViaAppleAuth = async (): Promise<string | null> => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    // Note: it appears putting FULL_NAME first is important, see issue #293
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });
  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );

  // use credentialState response to ensure the user is authenticated
  if (credentialState !== appleAuth.State.AUTHORIZED) {
    return null;
  }

  return appleAuthRequestResponse.email;
};

const generateBackupKey = async (): Promise<string> => {
  // const email = 'paul.wilson66@gmail.com';
  const email = await getEmailViaAppleAuth();
  if (!email) {
    throw new Error('Failed to get email');
  }
  const key = sha256(email);
  return key;
};

export const backup = async () => {
  try {
    const state = store.getState() as State;
    if (!state.settings.backupKey) {
      const key = await generateBackupKey();
      store.dispatch(actions.setBackupKey({key}));
    }
    const Body = JSON.stringify(state);
    const command = new PutObjectCommand({
      Bucket: 'pocket-money',
      Key: `${state.settings.backupKey}/backup.json`,
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
    const state = store.getState() as State;
    const backupKey = state.settings.backupKey || (await generateBackupKey());
    const command = new GetObjectCommand({
      Bucket: 'pocket-money',
      Key: `${backupKey}/backup.json`,
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
