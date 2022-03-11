import { useEffect, useRef, useState } from "react";

import Contract from "../contract/Contract";
import Web3 from "web3";
import { MainButton, AddressInput } from "../components";

export default function Home() {
  const web3 = useRef(null);

  const [address, setAddress] = useState("");
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [hasWalletWarning, setHasWalletWarning] = useState(false);

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
    web3.current.eth.getBlock("latest").then(console.log);
  }, []);

  useEffect(() => {
    getAuthorizedAccount();
  }, []);

  const checkIfWalletIsConnected = () => {
    return Boolean(window.ethereum);
  };

  const getAuthorizedAccount = async () => {
    if (!checkIfWalletIsConnected()) {
      return;
    }

    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleWithdraw = async () => {
    const { abi } = Contract;
    const contract = new web3.current.eth.Contract(abi, address);

    const gas = await contract.methods.withdraw().estimateGas();

    setIsProcessing(true);

    contract.methods
      .withdraw()
      .send({
        from: currentAccount,
        gas,
      })
      .on("error", (error) => {
        console.log("error", error);
        setIsProcessing(false);
      })
      .on("receipt", (receipt) => {
        // receipt will contain deployed contract address
        console.log("Receipt", receipt);

        setIsProcessing(false);
      })
      .on("confirmation", (_confirmationNumber, receipt) => {
        console.log("Confirmed", receipt);
      });
  };

  const addressInput = (
    <AddressInput
      label={""}
      value={address}
      onChange={(value) => {
        setAddress(value);
      }}
      onBlur={(value) => {
        const isValueAddress = web3.current.utils.isAddress(value);
        setError(isValueAddress ? "" : "Enter a valid wallet address");
      }}
      error={error}
    />
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-start py-8 pt-12 md:pt-20 text-zinc-700 px-6">
      <h1 className="text-5xl font-extrabold mb-3 pb-2">Withdraw</h1>

      <section className="max-w-md text-center">
        <p className="text-md mb-4">
          Initiate a payout from a given Partnerly contract to the recorded
          addresses in that contract.
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

        {currentAccount && (
          <section>
            <div className="grid grid-cols-1 gap-3 mb-3">{addressInput}</div>

            <div className="flex flex-col justify-center items-center">
              <div>
                <MainButton
                  onClick={handleWithdraw}
                  disabled={Boolean(error) || !Boolean(address) || isProcessing}
                  label={isProcessing ? "Processing" : "Withdraw"}
                />
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
