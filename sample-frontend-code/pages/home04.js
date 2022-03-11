import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

function MainButton({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      <span>{label}</span>
    </button>
  );
}

export default function Home() {
  const web3 = useRef(null);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [hasWalletWarning, setHasWalletWarning] = useState(false);

  const checkIfWalletIsConnected = () => {
    return Boolean(window.ethereum);
  };

  useEffect(() => {
    const hasWallet = checkIfWalletIsConnected();
    setHasWalletWarning(!hasWallet);
  }, []);

  useEffect(() => {
    if (web3.current) {
      return;
    }

    if (!checkIfWalletIsConnected()) {
      return;
    }

    web3.current = new Web3(window.ethereum);
    web3.current.eth.getBlock("latest").then((block) => console.log(block));
  }, []);

  const connectWallet = async () => {
    if (!checkIfWalletIsConnected()) {
      return;
    }

    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <main>
        {hasWalletWarning && (
          <p>You will need Metamask or equivalent to use this app.</p>
        )}
        {!currentAccount && (
          <div>
            <MainButton onClick={connectWallet} label={"Connect Wallet"} />
          </div>
        )}
      </main>
    </div>
  );
}
