import update from 'immutability-helper';
import R from 'ramda';

import {
  SET_INVOICES,
  ADD_INVOICE,
  UPDATE_INVOICE,
  REMOVE_INVOICE,
} from '_actions/invoices';

import { LOGOUT_USER } from '_actions/user';

export default function invoices(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);

  switch (action.type) {
    case SET_INVOICES:
      return state.concat(action.invoices);
    case ADD_INVOICE:
      return state.concat(action.invoice);
    case UPDATE_INVOICE:
      return state.map((invoice) =>
        invoice.id === action.invoice.id ? Object.assign(invoice, action.invoice) : invoice
      );
    case REMOVE_INVOICE:
      return update(state, { $splice: [[index, 1]] });
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
