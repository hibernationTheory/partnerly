import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

export default function Home() {
  const web3 = useRef(null);

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

  return (
    <div>
      <main>
        {hasWalletWarning && (
          <p>You will need Metamask or equivalent to use this app.</p>
        )}
      </main>
    </div>
  );
}
