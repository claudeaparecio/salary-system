export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_DEFAULT_ACCOUNT = 'SET_DEFAULT_ACCOUNT';
export const SET_IS_CONNECTED = 'SET_IS_CONNECTED';
export const SET_CURRENT_CONTRACT_VALUE = 'SET_CURRENT_CONTRACT_VALUE';
export const SET_PROVIDER = 'SET_PROVIDER';
export const SET_SIGNER = 'SET_SIGNER';
export const SET_CONTRACT = 'SET_CONTRACT';

export const setErrorMessage = message => ({
  type: SET_ERROR_MESSAGE,
  message,
});
export const setDefaultAccount = account => ({
  type: SET_DEFAULT_ACCOUNT,
  account,
});
export const setIsConnected = value => ({
  type: SET_IS_CONNECTED,
  isConnected: value,
});
export const setCurrentContractValue = contractValue => ({
  type: SET_CURRENT_CONTRACT_VALUE,
  contractValue,
});
export const setProvider = provider => ({
  type: SET_PROVIDER,
  provider,
});
export const setSigner = signer => ({
  type: SET_SIGNER,
  signer,
});
export const setContract = contract => ({
  type: SET_CONTRACT,
  contract,
});
