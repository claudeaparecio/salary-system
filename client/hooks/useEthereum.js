import { ethers } from 'ethers'

export const startPayment = async ({ amount, address }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const adminAddress = await signer.getAddress()
      ethers.utils.getAddress(address);
      const tx = await signer.sendTransaction({
        from: adminAddress, // admin wallet address
        to: address,
        value: ethers.utils.parseEther(amount),
      });
      return { transaction: tx, success: true, message: 'Processing payment' };
    } catch (err) {
      return { success: false, message: err.message };
    }
};