import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import R from "ramda";
import styled from "styled-components";

import numeral from "numeral";

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

const Amount = styled.p`
  font-weight: bold;
  font-size: 14px;
`;

const Hash = styled.p`
  font-size: 8px;
`;

const InvoiceMainContentContainer = styled(Column)`
  align-items: flex-start;
  padding: 0.1rem !important;
`;

const renderReceipts = (receipts) =>
  receipts.map((receipt, index) => (
    <Notification key={`home.receipt.${index}`}>
      <Columns>
        <Column>
          <InvoiceMainContentContainer>
            <InvoiceDateRange>
              {receipt?.invoice?.referenceNumber}
            </InvoiceDateRange>
            <Hash>{receipt?.transaction?.hash}</Hash>
          </InvoiceMainContentContainer>
          <InvoiceMainContentContainer>
            {receipt?.employee?.lastName}
            {receipt?.employee?.firstName &&
              `, ${receipt?.employee?.firstName}`}
          </InvoiceMainContentContainer>
        </Column>

        <Column narrow>
          <Amount>${numeral(receipt?.amount).format("0,0.00[00]")}</Amount>
        </Column>
      </Columns>
    </Notification>
  ));

export default function ReceiptList() {
  const dispatch = useDispatch();
  const { receipts } = useSelector(R.pick(["receipts"]));

  return (
    <Box>
      <Title>Receipts</Title>
      {!!receipts && renderReceipts(receipts)}
    </Box>
  );
}
