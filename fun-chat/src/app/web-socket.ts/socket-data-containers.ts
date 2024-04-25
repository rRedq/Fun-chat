import { RequestUsers } from '@alltypes/socketTypes';

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

export { authenticatedUsers, unauthorizedUsers };
