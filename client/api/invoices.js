import request from "superagent";
import { handleSuccess, handleError } from "_utils/api";

export const postInvoice = (data) =>
  request
    .post("/api/invoices")
    .send(data)
    .then(handleSuccess)
    .catch(handleError);

export const getInvoices = () =>
  request.get("/api/invoices").then(handleSuccess).catch(handleError);

export const getInvoiceById = (id) =>
  request
    .get(`/api/invoices/find/${id}`)
    .then(handleSuccess)
    .catch(handleError);

export const putInvoice = (data) =>
  request
    .put("/api/invoices")
    .send(data)
    .then(handleSuccess)
    .catch(handleError);
