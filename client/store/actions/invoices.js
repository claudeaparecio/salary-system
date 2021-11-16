export const SET_INVOICES = 'SET_INVOICES';
export const ADD_INVOICE = 'ADD_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const REMOVE_INVOICE = 'REMOVE_TODO';

export const setInvoices = invoices => ({
  type: SET_INVOICES,
  invoices,
});
export const addInvoice = invoice => ({
  type: ADD_INVOICE,
  invoice,
});
export const updateInvoice = invoice => ({
  type: UPDATE_INVOICE,
  invoice,
});
export const removeInvoice = invoice => ({
  type: REMOVE_INVOICE,
  invoice,
});