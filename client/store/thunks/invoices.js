import { push } from 'connected-react-router';
import { snakeToCamelCase, camelToSnakeCase } from 'json-style-converter/es5';
import R from 'ramda';
import { store as RNC } from 'react-notifications-component';

import {
  postInvoice,
  getInvoices,
} from '_api/invoices';
import {
  addInvoice,
  setInvoices,
} from '_actions/invoices';

import { dispatchError } from '_utils/api';

export const attemptAddInvoice = invoice => dispatch =>
  postInvoice(camelToSnakeCase(invoice))
    .then(data => {
      const invoice = R.omit(['Id'], R.assoc('id', data.invoice._id, snakeToCamelCase(data.invoice)));
      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      dispatch(addInvoice(invoice));
      dispatch(push('/invoice/history'))
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptGetInvoices = () => dispatch =>
  getInvoices()
    .then(data => {
      const invoices = R.map(invoice =>
        R.omit(['Id'], R.assoc('id', invoice._id, snakeToCamelCase(invoice))), data.invoices);

      dispatch(setInvoices(invoices));
      return data.invoices;
    })
    .catch(dispatchError(dispatch));