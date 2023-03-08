import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDefaultState,
  Web3State,
  loadContract,
} from "@providers/web3/utils";
import { BrowserProvider } from "ethers";

const Web3Context = createContext<Web3State>(createDefaultState());

interface Web3ProviderProps {
  children: any;
}

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState);

  useEffect(() => {
    async function initWeb3() {
      const provider = new BrowserProvider(window.ethereum as any);

      const contract = await loadContract("NFTMarket", provider);

      setWeb3Api({
        ethereum: window.ethereum,
        provider: provider,
        contract: contract,
        isLoading: false,
      });
    }

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

export default Web3Provider;
