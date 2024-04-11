import { UserData } from '@alltypes/common';
import { ResponseAuthenticationList } from '@alltypes/serverResponse';

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

export { authenticationData };
