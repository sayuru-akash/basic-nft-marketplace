import { BrowserProvider, Contract } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { SWRResponse } from "swr";

export type Web3Deps = {
  provider: BrowserProvider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R= any, P = any> = {
  (d: Partial<Web3Deps>): CryptoHandlerHook<D, R, P>;
};

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: string
) => CryptoSWRResponse<D, R>;

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;
