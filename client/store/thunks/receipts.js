import { snakeToCamelCase, camelToSnakeCase } from 'json-style-converter/es5';
import R from 'ramda';
import { store as RNC } from 'react-notifications-component';

import {
  postReceipt,
  getReceipts,
  getReceipt,
} from '_api/receipts';

import {
    addReceipt,
    setReceipts,
} from '_actions/receipts';

import { dispatchError } from '_utils/api';

export const attemptAddReceipt = receipt => dispatch =>
  postReceipt(camelToSnakeCase(receipt))
    .then(data => {
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

      dispatch(addReceipt({
          ...data.receipt,
          invoice: snakeToCamelCase(data.receipt.invoice)
      }))
    })
    .catch(dispatchError(dispatch));

export const attemptGetReceipts = () => dispatch =>
  getReceipts()
    .then(data => {
      const receipts = R.map(receipt =>
        R.omit(['Id'], R.assoc('id', receipt._id, snakeToCamelCase(receipt))), data.receipts);

      dispatch(setReceipts(receipts));
    })
    .catch(dispatchError(dispatch));

export const attemptGetReceipt = (id) => dispatch =>  
    getReceipt(id)
    .then(data => {
      const receipt = R.omit(['Id'], R.assoc('id', data.receipt._id, snakeToCamelCase(data.receipt)));
      return receipt;
    })
    .catch(dispatchError(dispatch));