import React, { useState } from "react";
import styled from "styled-components";
import {
  Title,
  Field,
  Input,
  Icon,
  Control,
  Button,
  Modal,
  Image,
  Message,
} from "react-bulma-companion";
import QRCode from "qrcode.react";

const WalletContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ConfirmationBtnContainer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
`;

export default function ModalQrCode({
  show,
  invoiceData,
  setShow,
  confirmPayment,
}) {
  const [btnDisable, setBtnDisable] = useState(false);

  const paymentConfirmed = () => {
    if (btnDisable) {
      return;
    } else {
      setBtnDisable(true);
      confirmPayment(invoiceData);
    }
  };
  return (
    <div>
      <Modal active={show.payModal}>
        <Modal.Background />
        <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
          <Image>
            <Message style={{ width: "400px" }}>
              <Message.Header>
                <div>Send Payment</div>
              </Message.Header>
              <Message.Body>
                {console.log(invoiceData)}
                Scan this QR code or copy the wallet address below
                <QRCode
                  value={
                    invoiceData?.user?.walletAddress
                      ? invoiceData?.user?.walletAddress
                      : "null"
                  }
                  size={128}
                  bgColor={"#f3f1ff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                  renderAs={"svg"}
                />
                <Title size="3" subtitle>
                  Amount: {invoiceData?.amount} USD
                </Title>
                <Field>
                  <WalletContainer>
                    <div>{invoiceData?.user?.walletAddress}</div>
                    <Button
                      style={{ marginLeft: "4px" }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          invoiceData?.user?.walletAddress
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </WalletContainer>
                </Field>
                <ConfirmationBtnContainer>
                  <Button
                    style={{ margin: "0px 4px" }}
                    color="danger"
                    onClick={() => setShow({ payModal: false })}
                  >
                    CANCEL
                  </Button>
                  <Button
                    style={{ margin: "0px 4px" }}
                    color="info"
                    onClick={() => {
                      paymentConfirmed();
                    }}
                  >
                    PAYMENT CONFIRMED
                  </Button>
                </ConfirmationBtnContainer>
              </Message.Body>
            </Message>
          </Image>
        </Modal.Content>
      </Modal>
    </div>
  );
}
