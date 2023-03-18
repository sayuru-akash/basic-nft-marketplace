import { useWeb3Hooks } from "@providers/web3";


export const useAccount = () => {
  const hooks = useWeb3Hooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes
  }
}