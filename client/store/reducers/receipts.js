import {
  SET_RECEIPTS,
  ADD_RECEIPT,
} from '_actions/receipts';

import { LOGOUT_USER } from '_actions/user';

export default function receipts(state = [], action) {

  switch (action.type) {
    case SET_RECEIPTS:
      return state.concat(action.receipts);
    case ADD_RECEIPT:
      return state.concat(action.receipt);
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
