import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import R from "ramda";

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
  margin: 50px 0px;
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
  color: #fefffe;
  margin-top: 50px;
  text-align: center;
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

const TableHeader = styled.tr`
  border: 1px solid #393d3c;
`;

const renderPdfPreview = (invoiceData, container) => {
  return (
    <PaperContainer ref={container}>
      <LeftSection>
        <Logo>Logo</Logo>
        <EmployerDetails>
          <Text size={"15px"} weight={"500"} color={"#fefffe"}>
            EMPLOYER
          </Text>
          <Container2>
            <Text size={"12px"} weight={"500"} color={"#fefffe"}>
              Employer Name
            </Text>
            <Text size={"12px"} color={"#878A8B"}>
              Address
            </Text>
            <Text size={"12px"} color={"#878A8B"}>
              Email address
            </Text>
          </Container2>
        </EmployerDetails>
        <div>
          <Text size={"15px"} weight={"500"} color={"#fefffe"}>
            EMPLOYEE
          </Text>
          <Container2>
            <Text size={"12px"} weight={"500"} color={"#fefffe"}>
              Employee Name
            </Text>
            <Text size={"12px"} color={"#878A8B"}>
              Position
            </Text>
            <Text size={"12px"} color={"#878A8B"}>
              Email
            </Text>
          </Container2>
        </div>
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
                4365876
              </Text>
            </FlexContainer>
          </InvoiceTitleContainer2>
        </InvoiceTitleContainer>
        <div>
          <FlexContainer>
            <Text weight={"600"}>Date:</Text>
            <Text margin={"0px 0px 0px 2px"}>28/November/2021</Text>
          </FlexContainer>
          <Text margin={"16px 0px 0px 0px"}>Total due:</Text>
          <Text size={"20px"} weight={"600"} lineHeight={"24px"}>
            1000.00 USD
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
              Pending
            </Text>
          </FlexContainer>
        </div>
        <TableContainer>
          <Table hoverable fullwidth>
            <thead>
              <Table.Row>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>HOURS</th>
                <th>RATE</th>
                <th>TOTAL</th>
              </Table.Row>
            </thead>
            <tbody>
              <tr>
                <td>Nov 15th - Nov 30th</td>
                <td>Description</td>
                <td>Hours worked</td>
                <td>Rate</td>
                <td>Total</td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </RightSection>
    </PaperContainer>
  );
};

export default function InvoiceDetails() {
  const { invoice } = useSelector(R.pick(["invoice"]));
  const history = useHistory();
  const dispatch = useDispatch();
  const container = useRef(null);
  const [invoiceData, setInvoiceData] = useState();

  const getId = async () => {
    const path = window.location.pathname.split("/");
    const id = path[path.length - 1];

    // getInvoiceById(id)
    //   .then((res) => {
    //     console.log(res.invoice);
    //     setInvoiceData(res.invoice);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const response = await dispatch(attemptGetInvoice(id));
    console.log(response);
  };

  /** Downloads invoice */
  const handleDownload = () => {
    if (!!invoiceData) {
      useReactToPrint({
        content: () => container.current,
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    dispatch(attemptGetInvoice("61938f946ff6f5c33f0992c3"));
  }, []);

  useEffect(() => {
    setInvoiceData(invoice);
  }, [invoice]);

  return invoiceData ? (
    <Box>
      <Title>Invoice Details</Title>
      <Button onClick={handleDownload} color="info">
        Download
      </Button>

      <Container>
        {!!invoiceData && renderPdfPreview(invoiceData, container)}
        {/* {renderPdfPreview(invoiceData, container)} */}
      </Container>
    </Box>
  ) : null;
}
