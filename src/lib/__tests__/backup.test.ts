import {backup, generateBackupKey, restore} from '../backup';
import {sha256} from 'react-native-sha256';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {initialState} from '../../data/initialState';
import {State} from '../../data/types';
import {store} from '../../data/store';
import {restoreBackup} from '../../data/reducers/global-reducer';

const getStateMock = store.getState as jest.Mock<State>;
const dispatchMock = store.dispatch as jest.Mock;

jest.mock('react-native-sha256', () => ({
  sha256: jest.fn().mockResolvedValue('sha256'),
}));

jest.mock('react-native-url-polyfill/auto', () => {});
jest.mock('react-native-get-random-values', () => {});

jest.mock('../../data/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock('@aws-sdk/client-s3', () => {
  const mock3Client = {
    send: jest.fn(),
  };
  return {
    S3Client: jest.fn().mockReturnValue(mock3Client),
    PutObjectCommand: jest
      .fn()
      .mockReturnValue(
        new (jest.requireActual('@aws-sdk/client-s3').PutObjectCommand)(),
      ),
    GetObjectCommand: jest
      .fn()
      .mockReturnValue(
        new (jest.requireActual('@aws-sdk/client-s3').GetObjectCommand)(),
      ),
  };
});

const mockS3Response = (data: any) => {
  return {
    Body: {
      transformToString: () => JSON.stringify(data),
    },
  };
};

describe('lib/backup', () => {
  it('can generate a backup key', async () => {
    const email = 'my.email@email.com';
    const key = await generateBackupKey(email);
    expect(sha256).toBeCalledWith(email);
    expect(key).toEqual('sha256');
  });

  describe('backup', () => {
    it('should save backups on s3', async () => {
      const mockState: State = JSON.parse(JSON.stringify(initialState));
      mockState.settings.backupKey = 'backup-key';
      getStateMock.mockReturnValueOnce(mockState);
      // @ts-ignore
      const mockClient = new S3Client();

      await backup();

      expect(PutObjectCommand).toBeCalledWith({
        Bucket: 'pocket-money',
        Key: 'backup-key/backup.json',
        Body: JSON.stringify(mockState),
      });
      expect(mockClient.send).toBeCalled();
      // @ts-ignore
      const command = mockClient.send.mock.calls[0][0];
      expect(command.constructor.name).toEqual('PutObjectCommand');
    });

    describe('No backup key', () => {
      let mockClient: S3Client;
      beforeAll(async () => {
        jest.clearAllMocks();
        const mockState: State = JSON.parse(JSON.stringify(initialState));
        getStateMock.mockReturnValueOnce(mockState);
        // @ts-ignore
        mockClient = new S3Client();
        await backup();
      });
      it('should not save to s3', () => {
        expect(mockClient.send).not.toHaveBeenCalled();
      });
    });
  });

  describe('restore', () => {
    describe('no backup key', () => {
      let mockClient: S3Client;
      beforeAll(async () => {
        jest.clearAllMocks();
        const mockState: State = JSON.parse(JSON.stringify(initialState));
        getStateMock.mockReturnValueOnce(mockState);
        // @ts-ignore
        mockClient = new S3Client();
        await restore();
      });

      it('should not download the backup', () => {
        expect(mockClient.send).not.toHaveBeenCalled();
      });
      it('should not alter the state', () => {
        expect(dispatchMock).not.toHaveBeenCalled();
      });
    });

    describe('with backup key', () => {
      let mockClient: S3Client;
      let remoteState: State;

      beforeAll(async () => {
        jest.clearAllMocks();
        const mockState: State = JSON.parse(JSON.stringify(initialState));
        remoteState = JSON.parse(JSON.stringify(initialState));
        mockState.settings.backupKey = 'backup-key';
        remoteState.settings.backupKey = 'backup-key';
        remoteState.children.push({
          id: 'id',
          name: 'name',
          settings: {
            currency: {major: '£', minor: 'p'},
            pocketMoneyPerWeek: 1,
            payDay: 6,
            beginningOfTime: '',
          },
          payments: [],
        });
        getStateMock.mockReturnValueOnce(mockState);
        // @ts-ignore
        mockClient = new S3Client();
        (mockClient.send as jest.Mock).mockResolvedValueOnce(
          mockS3Response(remoteState),
        );
        await restore();
      });

      it('should download backup from S3', () => {
        expect(GetObjectCommand).toBeCalledWith({
          Bucket: 'pocket-money',
          Key: `backup-key/backup.json`,
        });
        // @ts-ignore
        const command = mockClient.send.mock.calls[0][0];
        expect(command.constructor.name).toEqual('GetObjectCommand');
      });

      it('should restore the state', () => {
        expect(dispatchMock).toBeCalledWith(restoreBackup(remoteState));
      });
    });
  });
});
