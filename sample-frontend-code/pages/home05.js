import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

function MainButton({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex rounded-md shadow disabled:opacity-50`}
    >
      <span
        className={`inline-flex items-center justify-center px-5 py-3 border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700`}
      >
        {label}
      </span>
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
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col items-center justify-start py-8 pt-12 px-6 md:pt-20 text-zinc-700">
        <h1 className="text-7xl md:text-6xl font-extrabold text-indigo-600 mb-3 pb-2">
          Partnerly
        </h1>
        <section className="max-w-md text-center mb-12">
          <p className="text-xl">
            Partnerly creates a smart contract for you and your partner that
            distributes the payments to the partnership contract in a
            predetermined split ratio.
          </p>
          {hasWalletWarning && (
            <p className="mt-4 text-red-600">
              You will need Metamask or equivalent to use this app.
            </p>
          )}
          {!currentAccount && (
            <div className="mt-4">
              <MainButton onClick={connectWallet} label={"Connect Wallet"} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
