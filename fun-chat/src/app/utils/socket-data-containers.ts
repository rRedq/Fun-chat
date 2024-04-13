import { UserData } from '@alltypes/common';
import { RequestMsg, RequestUsers, ResponseAuthenticationList } from '@alltypes/serverResponse';

const authenticationData = ({ name, password }: UserData, type: ResponseAuthenticationList) => {
  return {
    id: type,
    type,
    payload: {
      user: {
        login: name,
        password,
      },
    },
  };
};
const authenticatedUsers: RequestUsers = {
  id: 'USER_ACTIVE',
  type: 'USER_ACTIVE',
  payload: null,
};

const unauthorizedUsers: RequestUsers = {
  id: 'USER_INACTIVE',
  type: 'USER_INACTIVE',
  payload: null,
};

const sendMessage = (message: string, receiver: string): RequestMsg => {
  return {
    id: 'MSG_SEND',
    type: 'MSG_SEND',
    payload: {
      message: {
        to: message,
        text: receiver,
      },
    },
  };
};

export { authenticationData, authenticatedUsers, unauthorizedUsers, sendMessage };
