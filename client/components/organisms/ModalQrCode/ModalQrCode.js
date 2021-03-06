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
import numeral from "numeral";

const WalletContainer = styled.div`
  display: flex;
  align-items: center;
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
  payUsingMetamask,
}) {
  const [btnDisable, setBtnDisable] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

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
              <Message.Header style={{ justifyContent: "center" }}>
                <div>Send Payment</div>
              </Message.Header>
              <Message.Body
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div>Scan this QR code or copy the wallet address below</div>
                <br />
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
                  ${numeral(invoiceData?.amount).format("0,0.00[00]")} USD ???{" "}
                  {numeral(invoiceData?.eth).format("0,0.00[000000]")} ETH
                </Title>
                <Field>
                  <WalletContainer>
                    <div>{invoiceData?.user?.walletAddress}</div>
                    <Button
                      style={{ marginLeft: "4px" }}
                      onClick={async() => {
                        navigator.clipboard.writeText(invoiceData?.user?.walletAddress).then(() => {
                          setShowCopied(true);
                          setTimeout(() => setShowCopied(false), 1500);
                        })
                      }}
                    >
                      {showCopied ? '??????' : 'Copy'}
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
                <div style={{ marginTop: "8px" }}>or</div>
                <ConfirmationBtnContainer>
                  <Button
                    style={{ margin: "0px 4px", backgroundColor: "#f88414" }}
                    color="info"
                    onClick={() => payUsingMetamask(invoiceData)}
                  >
                    Pay via Metamask
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
