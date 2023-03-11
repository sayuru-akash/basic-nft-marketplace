import { Web3Deps } from "@nft_types/hooks";
import {
  hookFactory as createAccountHook,
  UseAccountHook,
} from "@hooks/web3/useAccount";

export type Web3Hooks = {
  useAccount: UseAccountHook;
};

export type SetupHooks = {
  (d: Web3Deps): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
  };
};
