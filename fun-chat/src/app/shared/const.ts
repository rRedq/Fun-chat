import { UserData } from '@alltypes/common';

const serverUrl = 'ws://localhost:4000' as const;

const socketDataContainer = ({ id, name, password }: UserData, type: 'USER_LOGIN' | 'USER_LOGOUT') => {
  return {
    id,
    type,
    payload: {
      user: {
        login: name,
        password,
      },
    },
  };
};

export { serverUrl, socketDataContainer };
