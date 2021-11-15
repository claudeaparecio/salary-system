import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import user from './user';
import todos from './todos';
import invoices from './invoices';
import ethereum from './ethereum';

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  user,
  todos,
  invoices,
  ethereum,
});

export default createRootReducer;
