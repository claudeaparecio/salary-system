import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import R from "ramda";
import _ from "lodash";
import moment from "moment";

import { useReactToPrint } from "react-to-print";

import { Title, Box, Button, Table } from "react-bulma-companion";

import { attemptGetInvoice } from "_thunks/invoices";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: ${(props) => props.content};
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
`;

const PaperContainer = styled.div`
  width: 816px;
  height: 816px;
  display: flex;
  box-shadow: 4px 3px 8px 1px #969696;
  -webkit-box-shadow: 4px 3px 8px 1px #969696;
`;

const LeftSection = styled.div`
  width: 30%;
  background-color: #393d3c;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  width: 70%;
  background-color: #fefffe;
  margin: 0px 24px 0px 24px;
`;

const EmployerDetails = styled.div`
  margin: 60px 0px;
  width: 60%;
`;

const EmployeeDetails = styled.div`
  width: 60%;
`;

const Container2 = styled.div`
  margin: 20px 0px;
`;

const InvoiceTitleContainer = styled.div`
  margin: 50px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const InvoiceTitleContainer2 = styled.div`
  width: 200px;
`;

const Logo = styled.div`
  width: 60%;
  color: #fefffe;
  margin-top: 50px;
  font-size: 50px;
  line-height: 50px;
`;

const Text = styled.div`
  font-family: ${(props) => props.family};
  font-style: ${(props) => props.style};
  font-weight: ${(props) => props.weight};
  font-size: ${(props) => props.size};
  letter-spacing: ${(props) => props.spacing};
  color: ${(props) => props.color};
  width: ${(props) => props.width};
  padding: ${(props) => props.padding};
  line-height: ${(props) => props.lineHeight};
  margin: ${(props) => props.margin};
`;

const TableContainer = styled.div`
  margin: 48px auto;
`;

const Header = styled.th`
  font-size: 12px;
  font-weight: bold;
`;

const CellValue = styled.td`
  font-size: 12px;
`;

const renderPdfPreview = (invoiceData) => {
  if (!_.isEmpty(invoiceData)) {
    return (
      <PaperContainer>
        <LeftSection>
          <Logo>Logo</Logo>
          <EmployerDetails>
            <Text size={"15px"} weight={"500"} color={"#fefffe"}>
              EMPLOYER
            </Text>
            <Container2>
              <Text size={"12px"} weight={"500"} color={"#fefffe"}>
                SwipeBit
              </Text>
              <Text size={"12px"} color={"#878A8B"}>
                Address
              </Text>
              <Text size={"12px"} color={"#878A8B"}>
                Email address
              </Text>
            </Container2>
          </EmployerDetails>
          <EmployeeDetails>
            <Text size={"15px"} weight={"500"} color={"#fefffe"}>
              EMPLOYEE
            </Text>
            <Container2>
              <Text size={"12px"} weight={"500"} color={"#fefffe"}>
                {invoiceData?.user?.first_name +
                  " " +
                  invoiceData?.user?.last_name}
              </Text>
              {/* <Text size={"12px"} color={"#878A8B"}>
                Position
              </Text> */}
              <Text size={"12px"} color={"#878A8B"}>
                {invoiceData?.user?.email}
              </Text>
            </Container2>
          </EmployeeDetails>
        </LeftSection>
        <RightSection>
          <InvoiceTitleContainer>
            <InvoiceTitleContainer2>
              <Text
                size={"48px"}
                weight={"200"}
                lineHeight={"45px"}
                spacing={"4px"}
              >
                INVOICE
              </Text>
              <FlexContainer>
                <Text weight={"600"} margin={"0px 0px 0px 2px"}>
                  Invoice#
                </Text>
                <Text
                  weight={"300"}
                  spacing={"-0.5px"}
                  margin={"0px 0px 0px 2px"}
                >
                  {invoiceData?.reference_number}
                </Text>
              </FlexContainer>
            </InvoiceTitleContainer2>
          </InvoiceTitleContainer>
          <div>
            <FlexContainer>
              <Text weight={"600"}>Date:</Text>

              <Text margin={"0px 0px 0px 2px"}>
                {moment(invoiceData?.createdAt).format("DD/MMMM/YYYY")}
              </Text>
            </FlexContainer>
            <Text margin={"16px 0px 0px 0px"}>Total due:</Text>
            <Text size={"20px"} weight={"600"} lineHeight={"24px"}>
              {invoiceData?.amount} USD
            </Text>
            <FlexContainer margin={"16px 0px 0px 0px"} flexDirection={"column"}>
              <Text>Status:</Text>
              <Text
                color={
                  invoiceData?.status === "pending"
                    ? "#f78400"
                    : invoiceData?.status === "approved"
                    ? "#00a700"
                    : "#7c8286"
                }
                size={"16px"}
                weight={"500"}
                lineHeight={"16px"}
              >
                {invoiceData?.status}
              </Text>
            </FlexContainer>
          </div>
          <TableContainer>
            <Table hoverable fullwidth>
              <thead>
                <Table.Row>
                  <Header>DATE</Header>
                  <Header>DESCRIPTION</Header>
                  <Header>HOURS</Header>
                  <Header>RATE</Header>
                  <Header>TOTAL</Header>
                </Table.Row>
              </thead>
              <tbody>
                <tr>
                  <CellValue>
                    For {moment(invoiceData?.start_date).format("MMM Do")} -{" "}
                    {moment(invoiceData?.end_date).format("MMM Do")}
                  </CellValue>
                  <CellValue>{invoiceData?.description}</CellValue>
                  <CellValue>{invoiceData?.number_of_hours}</CellValue>
                  <CellValue>{invoiceData?.hourly_rate} usd/hr</CellValue>
                  <CellValue>{invoiceData?.amount} USD</CellValue>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </RightSection>
      </PaperContainer>
    );
  } else {
    return;
  }
};

export default function InvoiceDetails() {
  const { invoice } = useSelector(R.pick(["invoice"]));
  const dispatch = useDispatch();
  const container = useRef(null);
  const [invoiceData, setInvoiceData] = useState();
  const path = window.location.pathname.split("/");
  const id = path[path.length - 1];

  const getId = () => {
    dispatch(attemptGetInvoice(id));
  };

  /** Downloads invoice */
  const handleDownload = useReactToPrint({
    content: () => container.current,
  });

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    setInvoiceData(invoice);
  }, [invoice]);

  return !!invoiceData ? (
    <Box>
      <Title>Invoice Details</Title>
      {!_.isEmpty(invoiceData) && (
        <Button onClick={handleDownload} color="info">
          Download
        </Button>
      )}

      <Container ref={container}>
        {!_.isEmpty(invoiceData) && renderPdfPreview(invoiceData)}
        {/* {renderPdfPreview(invoiceData, container)} */}
      </Container>
    </Box>
  ) : null;
}
