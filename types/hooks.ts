import { BrowserProvider, Contract } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { SWRResponse } from "swr";

export type Web3Deps = {
  provider: BrowserProvider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
};

export type CryptoHookFactory<D = any, P = any> = {
  (d: Partial<Web3Deps>): CryptoHandlerHook<D, P>;
};

export type CryptoHandlerHook<D = any, P = any> = (
  params?: string
) => CryptoSWRResponse<D>;

export type CryptoSWRResponse<D = any> = SWRResponse<D>;
