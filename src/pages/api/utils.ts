import { Session, withIronSession } from "next-iron-session";
import * as util from "ethereumjs-util";
import contract from "../../../public/contracts/NFTMarket.json";
import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { NftMarketContract } from "@nft_types/nftMarketContract";

const NETWORKS = {
  "5777": "Ganache",
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

// @ts-ignore
export const contractAddress = contract["networks"][targetNetwork]["address"];

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });
}

export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get("message-session");
    const provider = new ethers.providers.JsonRpcProvider(
      "Http://127.0.0.1:7545"
    );

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    let nonce: string | Buffer =
      "\x19Ethereum Signed Message:\n" +
      JSON.stringify(message).length +
      JSON.stringify(message);

    //@ts-ignore
    nonce = util.keccak256(Buffer.from(nonce));
    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const publicKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const addressBuffer = util.pubToAddress(publicKey);
    const address = util.bufferToHex(addressBuffer);

    if (!message) {
      reject("Cannot find message!");
    } else if (req.body.address !== address) {
      reject("Invalid contract address!");
    } else {
      resolve("Contract address is valid!");
    }
  });
};
