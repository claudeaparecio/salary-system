import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import R from "ramda";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 } from "uuid";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import {
  accountChangedHandler,
  chainChangedHandler,
  connectWalletHandler,
} from "../../../hooks/useEthereum";
import numeral from "numeral";
import ModalQrCode from "_organisms/ModalQrCode";
import { startPayment } from "../../../hooks/useEthereum";
import { attemptUpdateInvoice } from "_thunks/invoices";
import { attemptAddReceipt } from "_thunks/receipts";

import {
  Table,
  Title,
  Box,
  Notification,
  Column,
  Columns,
  Button,
} from "react-bulma-companion";

const InvoiceDateRange = styled.p`
  color: #2c71f0;
  font-size: 14px;
  font-weight: 600;
`;

const InvoiceNumber = styled.p`
  font-size: 12px;
`;

const Amount = styled.p`
  font-weight: bold;
  font-size: 14px;
`;

const Status = styled.p`
  color: ${({ status }) =>
    status === "pending"
      ? "#f78400"
      : status === "approved"
      ? "#00a700"
      : "#7c8286"};
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
`;

const CustomNotification = styled(Notification)`
  :hover {
    cursor: pointer;
  }
`;

const ClickableInvoice = styled(Column)`
  cursor: pointer;
`;

export default function InvoiceList() {
  const dispatch = useDispatch();
  const { invoices } = useSelector(R.pick(["invoices"]));
  const { user } = useSelector(R.pick(["user"]));
  const [invoiceData, setInvoiceData] = useState();
  const [show, setShow] = useState({
    payModal: false,
  });

  const isAdmin = user.role === "admin";
  const openInvoice = (invoice) => {
    dispatch(push("/invoice/details/" + invoice.id, { state: invoice }));
  };


  const roundCryptoValueString = (str, decimalPlaces = 18) => {
    const arr = str.split(".");
    const fraction = arr[1].substr(0, decimalPlaces);
    return arr[0] + "." + fraction;
  };

  const getUSDToEthValue = async (amount) => {
    const response = await axios.get(
      `https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=${amount}&convert_id=1027&id=2781`
    );
    const ethValue = response.data?.data?.quote[0].price;

    return roundCryptoValueString(`${ethValue}`);
  };  

  const confirmPayment = async (invoice) => {
    await dispatch(
      attemptUpdateInvoice({
        id: invoice.id,
        status: "paid",
      })
    );
  }

    const payUsingMetamask = async (invoice) => {
      const amount = invoice.amount;
      const userWalletAddress = invoice?.user?.walletAddress;
      const usdToEth = await getUSDToEthValue(amount);
  
      const response = await startPayment({
        amount: usdToEth,
        address: userWalletAddress,
      });
  
      if (response.success) {
        await dispatch(
          attemptUpdateInvoice({
            id: invoice.id,
            status: "paid",
          })
        );
  
        await dispatch(
          attemptAddReceipt({
            transaction: response.transaction,
            employee: invoice.user.Id,
            invoice: invoice.id,
            amount: invoice.amount,
          })
        );
  
        RNC.addNotification({
          title: "Success!",
          message: response.message,
          type: "success",
          container: "top-right",
          animationIn: ["animated", "fadeInRight"],
          animationOut: ["animated", "fadeOutRight"],
          dismiss: {
            duration: 5000,
          },
        });
      } else {
        RNC.addNotification({
          title: `Error: Payment failed.`,
          message: response.message,
          type: "danger",
          container: "top-right",
          animationIn: ["animated", "fadeInRight"],
          animationOut: ["animated", "fadeOutRight"],
          dismiss: {
            duration: 5000,
          },
        });
      }
    };
  
    console.log(isAdmin)

  const renderInvoices = (invoices, openInvoice) =>
  invoices.map((invoice) => (
    <CustomNotification>
      <Columns>
        <Column onClick={() => openInvoice(invoice)}>
          {invoice?.user?.lastName}{" "}
          {invoice?.user?.firstName && `, ${invoice?.user?.firstName}`}
          <InvoiceDateRange>
            For {moment(invoice.startDate).format("MMM Do")} -{" "}
            {moment(invoice.endDate).format("MMM Do")}
          </InvoiceDateRange>
          <InvoiceNumber>{invoice.referenceNumber}</InvoiceNumber>
        </Column>
        <Column narrow>
          <Amount>${numeral(invoice.amount).format("0,0.00[00]")}</Amount>
          <Status status={invoice.status}>{invoice.status}</Status>
        </Column>
        {isAdmin && !!invoice?.user?.walletAddress && invoice.status === "pending" && (
          <Column narrow>
            <Button
              onClick={async () => {
                setShow({ payModal: true });
                const usdToEth = await getUSDToEthValue(
                  invoice.amount
                );
                setInvoiceData({
                  ...invoice,
                  eth: usdToEth,
                });
              }}
              color="info"
            >
              Pay
            </Button>
          </Column>
        )}
    </Columns>
  </CustomNotification>
));


  return (
    <Box>
      <Title>Invoices</Title>
      {!!invoices && renderInvoices(invoices, openInvoice, isAdmin)}
      <ModalQrCode
        show={show}
        invoiceData={invoiceData}
        setShow={setShow}
        confirmPayment={confirmPayment}
        payUsingMetamask={payUsingMetamask}
      />
    </Box>
  );
}
