import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postReceipt = data =>
  request.post('/api/receipts')
    .send(data)
    .then(handleSuccess)
    .catch(handleError);

export const getReceipts = () => 
  request.get('/api/receipts')
    .then(handleSuccess)
    .catch(handleError);

export const getReceipt = id =>
  request.get(`/api/receipts/${id}`)
    .then(handleSuccess)
    .catch(handleError);