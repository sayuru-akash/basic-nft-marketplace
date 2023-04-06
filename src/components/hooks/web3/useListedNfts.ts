import { CryptoHookFactory } from "@nft_types/hooks";
import { Nft } from "@nft_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";
import { useCallback } from "react";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();

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

    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const tx = await contract!.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });
          await tx.wait();
          alert(
            "NFT purchased successfully. Visit your profile to see the purchased NFT"
          );
        } catch (e: any) {
          console.error(e.message);
        }
      },
      [contract]
    );

    return {
      ...swr,
      buyNft,
      data: data || [],
    };
  };
