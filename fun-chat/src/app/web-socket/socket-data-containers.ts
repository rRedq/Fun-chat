import { EnumResponses } from '@alltypes/enum';
import { RequestUsers } from '@alltypes/socketTypes';

const authenticatedUsers: RequestUsers = {
  id: EnumResponses.active,
  type: EnumResponses.active,
  payload: null,
};

const unauthorizedUsers: RequestUsers = {
  id: EnumResponses.inactive,
  type: EnumResponses.inactive,
  payload: null,
};

export { authenticatedUsers, unauthorizedUsers };
