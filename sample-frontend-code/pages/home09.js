import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import Contract from "../contract/Contract";

import { MainButton, PartnerInput } from "../components";

export default function Home() {
  const web3 = useRef(null);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContractAddress, setDeployedContractAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const [partners, setPartners] = useState([
    {
      id: "1",
      label: "Partner A",
      address: "",
      error: "",
      split: 1,
    },
    {
      id: "2",
      label: "Partner B",
      address: "",
      error: "",
      split: 1,
    },
  ]);

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

  const handleConfirm = () => {
    setDeployedContractAddress("");
  };

  const handleStartPartnership = async () => {
    const addresses = [partners[0].address, partners[1].address];
    const splitRatio = [partners[0].split, partners[1].split];
    const contractArguments = [addresses, splitRatio];

    const { abi, bytecode } = Contract;
    const contract = new web3.current.eth.Contract(abi);

    const contractDeploymentData = {
      data: bytecode,
      arguments: contractArguments,
    };

    const gas = await contract.deploy(contractDeploymentData).estimateGas();

    setIsDeploying(true);

    contract
      .deploy(contractDeploymentData)
      .send({
        from: currentAccount,
        gas,
      })
      .on("error", (error) => {
        console.log(error);
        setIsDeploying(false);
      })
      .on("receipt", (receipt) => {
        // receipt will contain deployed contract address
        console.log(receipt);

        setIsDeploying(false);
        setDeployedContractAddress(receipt.contractAddress);
      })
      .on("confirmation", (_confirmationNumber, receipt) => {
        console.log(receipt);
        setIsDeploying(false);
      });
  };

  const addressInputs = partners.map((partner, index) => {
    return (
      <PartnerInput
        address={{
          label: partner.label,
          value: partner.address,
          onChange: (value) => {
            setPartners((oldPartnersState) => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].address = value;

              return newPartnersState;
            });
          },
          onBlur: (value) => {
            setPartners((oldPartnersState) => {
              const isValueAddress = web3.current.utils.isAddress(value);
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].error = isValueAddress
                ? ""
                : "Enter a valid wallet address";

              return newPartnersState;
            });
          },
          error: partner.error,
        }}
        split={{
          name: partner.label,
          value: partner.split,
          onChange: (value) => {
            setPartners((oldPartnersState) => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].split = value;

              return newPartnersState;
            });
          },
        }}
        key={partner.label}
      />
    );
  });

  const hasErrors = partners.some((partner) => Boolean(partner.error));
  const hasEmptyValues = partners.some((partner) => !Boolean(partner.address));

  if (deployedContractAddress) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex flex-1 flex-col items-center justify-start py-8 pt-12 px-6 md:pt-20 text-zinc-700">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 pb-2 text-indigo-600">
            Congratulations!
          </h1>

          <section className="max-w-md text-center mb-12">
            <p className="text-sm mb-6">
              Your contract is now deployed at this address. <br />
              <span className="font-bold">You should write it down.</span>
            </p>
            <p className="font-bold mb-6 text-sm border-dashed border-2 p-1 border-slate-600">
              {deployedContractAddress}
            </p>
            <p className="text-sm">
              Any payment made to this address will be split in between you and
              your partner when withdrawn.
            </p>
            <div className="p-4 flex flex-col justify-center items-center">
              <MainButton
                label={"I wrote down the address"}
                onClick={handleConfirm}
              />
            </div>
          </section>
        </main>
      </div>
    );
  }

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

        {currentAccount && (
          <div className="grid grid-cols-1 gap-3 mb-6">{addressInputs}</div>
        )}

        {currentAccount && (
          <div className="flex flex-col justify-center items-center p-3">
            <div>
              <MainButton
                onClick={handleStartPartnership}
                disabled={hasErrors || hasEmptyValues || isDeploying}
                label={isDeploying ? "Deploying" : "Partner Up!"}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
