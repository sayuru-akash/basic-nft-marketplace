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
import { MetaMaskInpageProvider } from "@metamask/providers";

const pageReload = () => {
  window.location.reload();
};

const handleAccountsChanged =
  (ethereum: MetaMaskInpageProvider) => async () => {
    ethereum._metamask.isUnlocked().then((isUnlocked) => {
      if (!isUnlocked) {
        pageReload();
      }
    });
  };

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccountsChanged(ethereum));
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.removeListener("chainChanged", pageReload);
  ethereum.removeListener("accountsChanged", handleAccountsChanged);
};

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME;
const Web3Context = createContext<Web3State>(createDefaultState());

interface Web3ProviderProps {
  children: any;
}

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState);

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new BrowserProvider(window.ethereum as any);
        // @ts-ignore
        const contract = await loadContract(CONTRACT_NAME, provider);

        setGlobalListeners(window.ethereum);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract,
            isLoading: false,
          })
        );
      } catch (e: any) {
        console.error("Please install Metamask: ", e);
        setWeb3Api((web3Api) =>
          createWeb3State({
            ...(web3Api as any),
            isLoading: false,
          })
        );
      }
    }
    initWeb3().then((r) => console.log("Init Web3: ", r));
    return () => {
      if (window.ethereum) {
        removeGlobalListeners(window.ethereum);
      }
    };
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
