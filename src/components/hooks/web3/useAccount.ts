import useSWR from "swr";
import { CryptoHookFactory } from "@nft_types/hooks";
import { BrowserProvider } from "ethers";

type AccountHookFactory = CryptoHookFactory<string, string>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider }) =>
  (params) => {
    const swrRes = useSWR("web3/useAccount", () => {
      provider?.listAccounts();
      console.log(params);
      return "Test User";
    });

    return swrRes;
  };
