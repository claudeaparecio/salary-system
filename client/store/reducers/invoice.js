import {
  SET_INVOICE,
  CLEAR_INVOICE,
} from '_actions/invoice';

import { LOGOUT_USER } from '_actions/user';

export default function invoice(state = {}, action) {

  switch (action.type) {
    case SET_INVOICE:
      return action.invoice
    case CLEAR_INVOICE:
      return {}
    case LOGOUT_USER:
      return {};
    default:
      return state;
  }
}
