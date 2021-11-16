export const SET_RECEIPTS = 'SET_RECEIPTS';
export const ADD_RECEIPT = 'ADD_RECEIPT';

export const setReceipts = receipts => ({
  type: SET_RECEIPTS,
  receipts,
});
export const addReceipt = receipt => ({
  type: ADD_RECEIPT,
  receipt,
});