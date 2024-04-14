interface MessageHistoryRequest {
  id: 'MSG_HISTORY';
  type: 'MSG_FROM_USER';
  payload: {
    user: {
      login: string;
    };
  };
}

interface MsgReadRequest {
  id: 'MSG_READ';
  type: 'MSG_READ';
  payload: {
    message: {
      id: string;
    };
  };
}

export { MessageHistoryRequest, MsgReadRequest };
