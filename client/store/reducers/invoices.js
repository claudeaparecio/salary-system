import update from 'immutability-helper';
import R from 'ramda';

import {
  SET_INVOICES,
  ADD_INVOICE,
  UPDATE_INVOICE,
  REMOVE_INVOICE,
} from '_actions/invoices';

import { LOGOUT_USER } from '_actions/user';

export function invoice(state = {}, action) {
  switch (action.type) {
    case ADD_INVOICE:
      return action.invoice;
    case UPDATE_INVOICE:
      return update(state, action.invoice);
    default:
      return state;
  }
}

export default function invoices(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);
  const updatedAtIndex = { $splice: [[index, 1, invoice(state[index], action)]] };

  switch (action.type) {
    case SET_INVOICES:
      return update(state, { $set: action.invoices });
    case ADD_INVOICE:
      return update(state, { $push: [invoice(undefined, action)] });
    case UPDATE_INVOICE:
      return update(state, updatedAtIndex);
    case REMOVE_INVOICE:
      return update(state, { $splice: [[index, 1]] });
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
