import { ethers } from 'ethers'

export const startPayment = async ({ amount, address }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(address);
      const tx = await signer.sendTransaction({
        from: '0x7D841670E1dd8cC1be130F611928689993A31ED7', // admin wallet address
        to: address,
        value: ethers.utils.parseEther(amount),
      });
      return { transaction: tx, success: true, message: 'Processing payment' };
    } catch (err) {
      return { transaction: tx, success: true, message: err.message };
    }
};