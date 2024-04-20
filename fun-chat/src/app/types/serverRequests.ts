interface MsgReadRequest {
  id: 'MSG_READ';
  type: 'MSG_READ';
  payload: {
    message: {
      id: string;
    };
  };
}

export { MsgReadRequest };
