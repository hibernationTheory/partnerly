import { useEffect, useState } from "react";

export default function Home() {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);

  const checkIfWalletIsConnected = () => {
    return Boolean(window.ethereum);
  };

  useEffect(() => {
    const hasWallet = checkIfWalletIsConnected();
    setHasWalletWarning(!hasWallet);
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
