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
  createWeb3State,
} from "@providers/web3/utils";
import { BrowserProvider } from "ethers";

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME;
const Web3Context = createContext<Web3State>(createDefaultState());

interface Web3ProviderProps {
  children: any;
}

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState);

  useEffect(() => {
    async function initWeb3() {
      const provider = new BrowserProvider(window.ethereum as any);

      // @ts-ignore
      const contract = await loadContract(CONTRACT_NAME, provider);

      setWeb3Api(
        createWeb3State({
          ethereum: window.ethereum,
          provider,
          contract,
          isLoading: false,
        })
      );
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

export function useWeb3Hooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
