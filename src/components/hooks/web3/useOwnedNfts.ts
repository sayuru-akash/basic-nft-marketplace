import { CryptoHookFactory } from "@nft_types/hooks";
import { Nft } from "@nft_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";
import { useCallback } from "react";

type UseOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};
type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getOwnedNfts();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }

        return nfts;
      }
    );

    const listNft = useCallback(
      async (tokenId: number, price: number) => {
        try {
          const tx = await contract!.placeNftOnSale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
              value: ethers.utils.parseEther((0.025).toString()),
            }
          );
          await tx.wait();

          alert("NFT listed successfully!");
        } catch (e: any) {
          console.error(e.message);
        }
      },
      [contract]
    );

    return {
      ...swr,
      listNft,
      data: data || [],
    };
  };