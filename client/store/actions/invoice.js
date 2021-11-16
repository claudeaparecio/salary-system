export const SET_INVOICE = 'SET_INVOICE';
export const CLEAR_INVOICE = 'CLEAR__INVOICE';

export const setInvoice = invoice => ({
  type: SET_INVOICE,
  invoice,
});
export const clearInvoice = () => ({
  type: CLEAR_INVOICE,
});
