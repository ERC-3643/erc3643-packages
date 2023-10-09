import { TokenContract } from "@erc-3643/core";
import { useEffect, useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";

export interface Token {
  owner: any;
  name: any;
  totalSupply: any;
  decimals: any;
  frozenTokens: any;
  realBalanceOf: any;
  balanceOf: any;
  paused: any;
  walletIsFrozen: any;
  identityRegistry: any;
  pause: () => Promise<void>;
  run: () => Promise<void>;
  unfreeze: (address: string) => Promise<void>;
  freeze: (address: string) => Promise<void>;
  compliance: () => Promise<any>;
  isWalletFrozen: (walletAddress: string) => Promise<boolean>;
  getFrozenTokens: (walletAddress: string) => Promise<boolean>;
  getBalance: (walletAddress: string) => Promise<any>;
  areTransferPartiesFrozen: (from: string, to: string) => Promise<void>;
  isEnoughSpendableBalance: (from: string, amount: number) => Promise<void>;
}

export const useToken = (signer: Signer | undefined, debug = false) => {
  const [token, setToken] = useState<any>();

  const getTkn = async (tokenAddress: string): Promise<Token | null> => {
    if (!signer) {
      return null;
    }

    const token = await TokenContract.init(tokenAddress, signer);

    setToken(token);

    if (!token) {
      return null;
    }

    return {
      owner: await token.owner(),
      name: await token.name(),
      totalSupply: await token.totalSupply(),
      decimals: await token.decimals(),
      frozenTokens: await token.frozenTokens(),
      realBalanceOf: await token.realBalanceOf(),
      balanceOf: await token.balanceOf(),
      paused: await token.paused(),
      walletIsFrozen: await token.walletIsFrozen(),
      identityRegistry: await token.identityRegistry(),
      pause: token.pause,
      run: token.run,
      unfreeze: token.unfreeze,
      freeze: token.freeze,
      compliance: token.compliance,
      isWalletFrozen: token.isWalletFrozen,
      getFrozenTokens: token.getFrozenTokens,
      getBalance: token.getBalance,
      areTransferPartiesFrozen: token.areTransferPartiesFrozen,
      isEnoughSpendableBalance: token.isEnoughSpendableBalance,
    };
  };

  useEffect(() => {
    if (!signer || !token) {
      return;
    }

    if (token.contract) {
      token.contract.on("Paused", () => {
        setToken({ ...token, paused: true });
      });

      token.contract.on("Unpaused", () => {
        setToken({ ...token, paused: false });
      });

      token.contract.on(
        "AddressFrozen",
        (
          walletAddressToFreeze: string,
          isFrozen: boolean,
          signerAddress: string
        ) => {
          console.log(walletAddressToFreeze, "is frozen", isFrozen);
        }
      );

      token.contract.on("error", (error: Error) => {
        console.log(error);
      });
    }

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }
  }, [token]);

  return {
    getToken: getTkn,
  };
};
