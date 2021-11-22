import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import R from "ramda";
import moment from "moment";
import axios from "axios";
import { store as RNC } from "react-notifications-component";
import numeral from "numeral";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import {
  Columns,
  Column,
  Box,
  Notification,
  Button,
  Modal,
  Image,
  Message,
} from "react-bulma-companion";
import { startPayment } from "../../../hooks/useEthereum";
import { attemptGetInvoices, attemptUpdateInvoice } from "_thunks/invoices";
import { attemptGetReceipts, attemptAddReceipt } from "_thunks/receipts";

import ModalQrCode from "_organisms/ModalQrCode";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const data = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
  datasets: [
    {
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      borderWidth: 1,
    },
  ],
};

const StyledTitle = styled(Title)`
  text-align: left;
`;

const StyledBox = styled(Box)`
  border-radius: 7px;
`;

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

const PayButton = styled(Button)``;

const Hash = styled.p`
  font-size: 8px;
`;

const InvoiceMainContentContainer = styled(Column)`
  align-items: flex-start;
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

export default function HomePage() {
  const dispatch = useDispatch();
  const [invoiceData, setInvoiceData] = useState();
  const [show, setShow] = useState({
    payModal: false,
  });
  const { user } = useSelector(R.pick(["user"]));
  const { invoices } = useSelector(R.pick(["invoices"]));
  const { receipts } = useSelector(R.pick(["receipts"]));
  const isAdmin = user.role === "admin";

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push("/"));
    } else {
      dispatch(attemptGetInvoices());
      dispatch(attemptGetReceipts());
    }
  }, []);

  const generateGreetings = () => {
    const hour = moment().hour();
    if (hour > 16) {
      return "Good evening";
    }
    if (hour > 11) {
      return "Good afternoon";
    }
    return "Good morning";
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

  const openInvoice = (invoice) => {
    dispatch(push("/invoice/details/" + invoice.id, { state: invoice }));
  };

  const confirmPayment = async (invoice) => {
    await dispatch(
      attemptUpdateInvoice({
        id: invoice.id,
        status: "paid",
      })
    );

    // await dispatch(
    //   attemptAddReceipt({
    //     transaction: response.transaction,
    //     employee: invoice.user.Id,
    //     invoice: invoice.id,
    //     amount: invoice.amount,
    //   })
    // );

    RNC.addNotification({
      title: "Success!",
      message: "Paid",
      type: "success",
      container: "top-right",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  };

  return (
    <div className="home-page page">
      <Section>
        <Container>
          <StyledTitle>
            {generateGreetings()} {user.firstName && `, ${user.firstName}!`}
          </StyledTitle>
          <Columns>
            <Column>
              {isAdmin ? (
                <StyledBox>
                  Payment Dues
                  {invoices.map((invoice, index) => {
                    if (index <= 5) {
                      return (
                        <CustomNotification key={`home.invoice.${index}`}>
                          <Columns>
                            <InvoiceMainContentContainer
                              onClick={() => openInvoice(invoice)}
                            >
                              {invoice?.user?.firstName}{" "}
                              {invoice?.user?.lastName}
                              <InvoiceDateRange>
                                For {moment(invoice.startDate).format("MMM Do")}{" "}
                                - {moment(invoice.endDate).format("MMM Do")}
                              </InvoiceDateRange>
                            </InvoiceMainContentContainer>
                            <Column narrow>
                              <Amount>
                                ${numeral(invoice.amount).format("0,0.00[00]")}
                              </Amount>
                              <Status status={invoice.status}>
                                {invoice.status}
                              </Status>
                            </Column>
                            {!!invoice?.user?.walletAddress &&
                              invoice.status === "pending" && (
                                <Column narrow>
                                  <PayButton
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
                                  </PayButton>
                                </Column>
                              )}
                          </Columns>
                        </CustomNotification>
                      );
                    } else {
                      return;
                    }
                  })}
                  {invoices.length > 5 ? (
                    <Title
                      style={{ cursor: "pointer" }}
                      subtitle
                      onClick={() => {
                        dispatch(push("/invoice/history"));
                      }}
                    >
                      See All
                    </Title>
                  ) : null}
                </StyledBox>
              ) : (
                <StyledBox>
                  Invoices
                  {invoices.map((invoice, index) => {
                    if (index <= 5) {
                      return (
                        <CustomNotification
                          onClick={() => openInvoice(invoice)}
                          key={`home.invoice.${index}`}
                        >
                          <Columns>
                            <InvoiceMainContentContainer>
                              {invoice?.user?.firstName}{" "}
                              {invoice?.user?.lastName}
                              <InvoiceDateRange>
                                For {moment(invoice.startDate).format("MMM Do")}{" "}
                                - {moment(invoice.endDate).format("MMM Do")}
                              </InvoiceDateRange>
                            </InvoiceMainContentContainer>
                            <Column narrow>
                              <Amount>
                                ${numeral(invoice.amount).format("0,0.00[00]")}
                              </Amount>
                              <Status status={invoice.status}>
                                {invoice.status}
                              </Status>
                            </Column>
                          </Columns>
                        </CustomNotification>
                      );
                    } else {
                      return;
                    }
                  })}
                  {invoices.length > 5 ? (
                    <Title
                      style={{ cursor: "pointer" }}
                      subtitle
                      onClick={() => {
                        dispatch(push("/invoice/history"));
                      }}
                    >
                      See All...
                    </Title>
                  ) : null}
                </StyledBox>
              )}
            </Column>
            <Column>
              <StyledBox>
                History
                {receipts.map((receipt, index) => {
                  if (index <= 5) {
                    return (
                      <Notification key={`home.receipt.${index}`}>
                        <Columns>
                          <InvoiceMainContentContainer>
                            <InvoiceDateRange>
                              {receipt.invoice.referenceNumber}
                            </InvoiceDateRange>
                            <Hash>{receipt.transaction?.hash}</Hash>
                          </InvoiceMainContentContainer>
                          <Column narrow>
                            <Amount>
                              ${numeral(receipt.amount).format("0,0.00[00]")}
                            </Amount>
                          </Column>
                        </Columns>
                      </Notification>
                    );
                  } else {
                    return;
                  }
                })}
                {receipts.length > 5 ? (
                  <Title
                    style={{ cursor: "pointer" }}
                    subtitle
                    onClick={() => {
                      dispatch(push("/receipt/history"));
                    }}
                  >
                    See All
                  </Title>
                ) : null}
              </StyledBox>
              {!isAdmin && (
                <StyledBox>
                  Money Earned Graph
                  <Bar
                    data={data}
                    options={{
                      onHover: () => {},
                    }}
                  />
                </StyledBox>
              )}
            </Column>
          </Columns>
        </Container>
      </Section>
      <ModalQrCode
        show={show}
        invoiceData={invoiceData}
        setShow={setShow}
        confirmPayment={confirmPayment}
        payUsingMetamask={payUsingMetamask}
      />
    </div>
  );
}
