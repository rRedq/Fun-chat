import { UserData } from '@alltypes/common';
import { RequestUsers, ResponseAuthenticationList } from '@alltypes/serverResponse';

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

export { authenticationData, authenticatedUsers, unauthorizedUsers };
