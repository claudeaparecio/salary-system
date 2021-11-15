import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import R from 'ramda';

import { attemptGetInvoices } from '_thunks/invoices';
import abi from '../../../config/abi.json'

import {
    Button,
    Title,
    Section,
    Container,
    Columns,
    Column,
} from 'react-bulma-companion'

export default function WalletPage({ location }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  let contractAddress = '0x9e172614ED54BB87e335F36b39Cef99De66b7021';

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
      if (window.ethereum && window.ethereum.isMetaMask) {

          window.ethereum.request({ method: 'eth_requestAccounts'})
          .then(result => {
              accountChangedHandler(result[0]);
              setConnButtonText('Wallet Connected');
          })
          .catch(error => {
              setErrorMessage(error.message);
          
          });

      } else {
          console.log('Need to install MetaMask');
          setErrorMessage('Please install MetaMask browser extension to interact');
      }
  }

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
      setDefaultAccount(newAccount);
      updateEthers();
  }

  const chainChangedHandler = () => {
      // reload the page to avoid any errors with chain change mid use of application
      window.location.reload();
  }


  // listen for account changes
  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  const updateEthers = () => {
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);

      let tempSigner = tempProvider.getSigner();
      setSigner(tempSigner);

      let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
      setContract(tempContract);	
  }

  const setHandler = (event) => {
      event.preventDefault();
      console.log('sending ' + event.target.setText.value + ' to the contract');
      contract.set(event.target.setText.value);
  }

  const getCurrentVal = async () => {
      let val = await contract.get();
      setCurrentContractVal(val);
  }

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, []);
    
  return (
    <div className="wallet-page page">
      <Section>
        <Container>
          <Columns>
            <Button onClick={connectWalletHandler}>
                <Title>
                    {connButtonText}
                </Title>
            </Button>
            <Title>Address: {defaultAccount}</Title>
          </Columns>
          <form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
        </Container>
      </Section>
    </div>
  );
}
